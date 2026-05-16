const { UsersModel } = require("../models/UsersModel");
const { OrdersModel } = require("../models/OrdersModel");
const { HoldingsModel } = require("../models/HoldingsModel");
const { StocksModel } = require("../models/StocksModel");

async function runAutoTrade() {
  console.log(" Running Auto trade");

  const users = await UsersModel.find({ autoTradingEnabled: true });
  if (!users.length) {
    console.log(" No auto-trading users found");
    return;
  }

  for (const user of users) {
    console.log(`\n Processing user: ${user.username}`);
    const { _id: userId, autoTradeLimitPercent } = user;

    // Initialize AutoTradeFund ONLY if it hasn't been set yet (first time enabling)
    if (user.autoTradeFund === 0 && user.autoTradeLimitPercent > 0) {
      // IMPORTANT: Clear any orphaned auto-trade holdings before initializing
      const orphanedHoldings = await HoldingsModel.find({ 
        user: userId, 
        isAutoTraded: true 
      });
      
      if (orphanedHoldings.length > 0) {
        console.log(` Found ${orphanedHoldings.length} orphaned auto-trade holdings. Clearing...`);
        // Mark them as manual holdings instead of deleting
        await HoldingsModel.updateMany(
          { user: userId, isAutoTraded: true },
          { $set: { isAutoTraded: false } }
        );
      }
      
      const fund = (user.balance * autoTradeLimitPercent) / 100;
      user.autoTradeFund = fund;
      user.balance -= fund;
      await user.save();
      console.log(` Initialized AutoTradeFund: ₹${user.autoTradeFund}`);
    }

    // Calculate available auto-trade balance
    const autoHoldings = await HoldingsModel.find({ user: userId, isAutoTraded: true });
    
    // Invested = sum of (avg_price × quantity) for auto-traded holdings
    const investedAutoBalance = autoHoldings.reduce(
      (sum, h) => sum + (h.avg_price * h.quantity), 
      0
    );
    
    const remainingAutoBalance = user.autoTradeFund - investedAutoBalance;

    console.log(` AutoTradeFund: ₹${user.autoTradeFund.toFixed(2)}`);
    console.log(`Invested: ₹${investedAutoBalance.toFixed(2)}`);
    console.log(` Remaining: ₹${remainingAutoBalance.toFixed(2)}`);

    if (remainingAutoBalance <= 0) {
      console.log(" No remaining auto-trade balance");
      continue;
    }

    const stocks = await StocksModel.find({ autoTradeEnabled: true });
    if (!stocks.length) {
      console.log(" No eligible stocks found for trading.");
      continue;
    }

    console.log(` Eligible stocks: ${stocks.map(s => s.symbol).join(", ")}`);

    const boughtStocksThisCycle = new Set();
    let currentRemainingBalance = remainingAutoBalance;

    for (const stock of stocks) {
      const { symbol, mlRecommendation, confidence, lastPredictedAt, currentPrice } = stock;

      // Skip outdated predictions (older than 24 hours)
      if (Date.now() - new Date(lastPredictedAt) > 24 * 60 * 60 * 1000) {
        console.log(` Skipping ${symbol}: Prediction too old`);
        continue;
      }
      
      if (confidence < 0.6) {
        console.log(` Skipping ${symbol}: Low confidence (${confidence})`);
        continue;
      }

      const existingHolding = await HoldingsModel.findOne({ 
        user: userId, 
        name: symbol 
      });
      
      const price = currentPrice || 1000;

      // ===== BUY LOGIC =====
      if (
        mlRecommendation.toUpperCase() === "BUY" &&
        currentRemainingBalance > 0 &&
        !boughtStocksThisCycle.has(symbol)
      ) {
        // Allocate max 30% of total auto-trade fund per stock
        let maxAllocation = user.autoTradeFund * 0.3;
        let allocation = Math.min(currentRemainingBalance, maxAllocation);
        
        // Calculate quantity - must be at least 1
        let quantity = Math.floor(allocation / price);
        
        // Skip if can't afford even 1 share
        if (quantity < 1) {
          console.log(` Skipped BUY ${symbol}: Can't afford 1 share (Price: ₹${price}, Available: ₹${currentRemainingBalance.toFixed(2)})`);
          continue;
        }

        const totalCost = quantity * price;

        try {
          // Create order
          const newOrder = await OrdersModel.create({
            user: userId,
            name: symbol,
            quantity,
            price,
            action: "BUY",
            mlRecommendation,
            confidence,
            autoTradeEnabled: true,
            executed: true,
          });
          await UsersModel.findByIdAndUpdate(userId, { 
            $push: { orders: newOrder._id } 
          });

          // Update or create holding
          if (existingHolding) {
            const newQuantity = existingHolding.quantity + quantity;
            const newCost = (existingHolding.avg_price * existingHolding.quantity) + totalCost;
            const newAvgPrice = newCost / newQuantity;
            
            existingHolding.quantity = newQuantity;
            existingHolding.avg_price = newAvgPrice;
            existingHolding.price = price;
            existingHolding.pnl = (price - newAvgPrice) * newQuantity;
            existingHolding.isLoss = existingHolding.pnl < 0;
            existingHolding.isAutoTraded = true; // Mark as auto-traded
            await existingHolding.save();
            
            console.log(` Updated holding ${symbol}: ${newQuantity} shares @ avg ₹${newAvgPrice.toFixed(2)}`);
          } else {
            const newHolding = await HoldingsModel.create({
              user: userId,
              name: symbol,
              quantity,
              avg_price: price,
              price,
              pnl: 0,
              isLoss: false,
              isAutoTraded: true,
            });
            await UsersModel.findByIdAndUpdate(userId, { 
              $push: { holdings: newHolding._id } 
            });
            
            console.log(`✨ Created new holding ${symbol}: ${quantity} shares @ ₹${price}`);
          }

          // Update tracking
          currentRemainingBalance -= totalCost;
          boughtStocksThisCycle.add(symbol);
          
          console.log(` Auto-Buy executed: ${symbol} (${quantity} shares at ₹${price}, Cost: ₹${totalCost.toFixed(2)})`);
        } catch (err) {
          console.log(` Failed to execute BUY for ${symbol}:`, err.message);
        }
      }

      // ===== SELL LOGIC =====
      if (
        mlRecommendation.toUpperCase() === "SELL" && 
        existingHolding && 
        existingHolding.isAutoTraded
      ) {
        const quantityToSell = existingHolding.quantity;
        const sellPrice = price;
        const proceeds = quantityToSell * sellPrice;
        
        // Calculate the cost basis (what we invested)
        const costBasis = existingHolding.avg_price * quantityToSell;

        try {
          // Create sell order
          const newOrder = await OrdersModel.create({
            user: userId,
            name: symbol,
            quantity: quantityToSell,
            price: sellPrice,
            action: "SELL",
            mlRecommendation,
            autoTradeEnabled: true,
            executed: true,
          });
          await UsersModel.findByIdAndUpdate(userId, { 
            $push: { orders: newOrder._id } 
          });

          // Remove holding
          await HoldingsModel.deleteOne({ _id: existingHolding._id });
          await UsersModel.findByIdAndUpdate(userId, { 
            $pull: { holdings: existingHolding._id } 
          });

          // Return proceeds to balance (user can use it freely)
          user.balance += proceeds;
          await user.save();
          
          // The freed-up cost basis goes back to available auto-trade fund
          currentRemainingBalance += costBasis;

          console.log(`Auto-Sell executed: ${symbol} (${quantityToSell} shares at ₹${sellPrice})`);
          console.log(` Proceeds (₹${proceeds.toFixed(2)}) → balance`);
          console.log(` Cost basis (₹${costBasis.toFixed(2)}) freed for auto-trading`);
        } catch (err) {
          console.log(` Failed to execute SELL for ${symbol}:`, err.message);
        }
      }
    }

    // Recalculate user totals
    try {
      const userHoldings = await HoldingsModel.find({ user: userId });
      const totalCurrentValue = userHoldings.reduce(
        (acc, h) => acc + (h.price * h.quantity), 
        0
      );
      const totalInvested = userHoldings.reduce(
        (acc, h) => acc + (h.avg_price * h.quantity), 
        0
      );
      const totalPnL = totalCurrentValue - totalInvested;

      user.totalInvested = totalInvested;
      user.totalCurrentValue = totalCurrentValue;
      user.totalPnL = totalPnL;
      await user.save();
      
      console.log(` Updated totals - Invested: ₹${totalInvested.toFixed(2)}, Current: ₹${totalCurrentValue.toFixed(2)}, P&L: ₹${totalPnL.toFixed(2)}`);
    } catch (err) {
      console.log("Failed to update user totals:", err.message);
    }
  }

  console.log("\n Auto Trade cycle completed.");
}

module.exports = runAutoTrade;