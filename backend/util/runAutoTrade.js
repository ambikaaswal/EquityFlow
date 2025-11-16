// const { UsersModel } = require("../models/UsersModel");
// const { OrdersModel } = require("../models/OrdersModel");
// const { HoldingsModel } = require("../models/HoldingsModel");
// const { StocksModel } = require("../models/StocksModel");

// async function runAutoTrade() {
//   console.log("🚀 Running Auto trade");

//   const users = await UsersModel.find({ autoTradingEnabled: true });
//   if (!users.length) {
//     console.log("⚠️ No auto-trading users found");
//     return;
//   }

//   for (const user of users) {
//     console.log(`\n👤 Processing user: ${user.username}`);
//     const { _id: userId, autoTradeLimitPercent } = user;

//     // Initialize AutoTradeFund if not set
//     if (!user.autoTradeFund || user.autoTradeFund <= 0) {
//       const fund = (user.balance * autoTradeLimitPercent) / 100;
//       user.autoTradeFund = fund;
//       user.balance -= fund;
//       await user.save();
//       console.log(`💰 Initialized AutoTradeFund: ₹${user.autoTradeFund}`);
//     }

//     // Fetch auto-traded holdings
//     let autoHoldings = await HoldingsModel.find({ user: userId, isAutoTraded: true });
//     let investedAutoBalance = autoHoldings.reduce((sum, h) => sum + h.quantity * h.price, 0);
//     let remainingAutoBalance = user.autoTradeFund - investedAutoBalance;

//     console.log(`AutoTradeFund: ₹${user.autoTradeFund}, Invested: ₹${investedAutoBalance}, Remaining: ₹${remainingAutoBalance}`);

//     if (remainingAutoBalance <= 0) {
//       console.log("❌ No remaining auto-trade balance");
//       continue;
//     }

//     const stocks = await StocksModel.find({ autoTradeEnabled: true });
//     if (!stocks.length) {
//       console.log("⚠️ No eligible stocks found for trading.");
//       continue;
//     }

//     console.log(`Eligible stocks for trading: ${stocks.map(s => s.symbol).join(", ")}`);

//     for (const stock of stocks) {
//       const { symbol, mlRecommendation, confidence, lastPredictedAt, currentPrice } = stock;

//       // Skip outdated predictions
//       if (Date.now() - new Date(lastPredictedAt) > 24 * 60 * 60 * 1000) {
//         console.log(`⏰ Skipped ${symbol}: Prediction older than 24h`);
//         continue;
//       }

//       if (confidence < 0.60) {
//         console.log(`⚠️ Skipped ${symbol}: Confidence too low (${confidence})`);
//         continue;
//       }

//       const existingHolding = await HoldingsModel.findOne({ user: userId, name: symbol });
//       const price = currentPrice || 1000;

//       // ===== BUY LOGIC =====
//       if (mlRecommendation.toUpperCase() === "BUY" && remainingAutoBalance > 0) {
//         // Allocate 50% of remaining auto fund for this stock, min 1 share
//         let allocation = Math.min(remainingAutoBalance, user.autoTradeFund * 0.3);
//         let quantity = Math.max(1, Math.floor(allocation / price));
//         const totalCost = quantity * price;

//         if (totalCost > remainingAutoBalance) {
//           quantity = Math.floor(remainingAutoBalance / price);
//         }

//         if (quantity <= 0) {
//           console.log(`⚠️ Skipped BUY ${symbol}: Allocation too small`);
//           continue;
//         }

//         const finalCost = quantity * price;

//         try {
//           // Create order
//           const newOrder = await OrdersModel.create({
//             user: userId,
//             name: symbol,
//             quantity,
//             price,
//             action: "BUY",
//             mlRecommendation,
//             confidence,
//             autoTradeEnabled: true,
//             executed: true,
//             autoTradeBalanceUsed: finalCost,
//           });

//           await UsersModel.findByIdAndUpdate(userId, { $push: { orders: newOrder._id } });

//           // Update or create holding
//           if (existingHolding) {
//             const newQuantity = existingHolding.quantity + quantity;
//             const newAvgPrice = ((existingHolding.avg_price * existingHolding.quantity) + finalCost) / newQuantity;
//             existingHolding.quantity = newQuantity;
//             existingHolding.avg_price = newAvgPrice;
//             existingHolding.price = price;
//             existingHolding.pnl = (price - newAvgPrice) * newQuantity;
//             existingHolding.isLoss = existingHolding.pnl < 0;
//             await existingHolding.save();
//           } else {
//             const newHolding = await HoldingsModel.create({
//               user: userId,
//               name: symbol,
//               quantity,
//               avg_price: price,
//               price,
//               pnl: 0,
//               isLoss: false,
//               autoTradeEnabled: true,
//             });
//             await UsersModel.findByIdAndUpdate(userId, { $push: { holdings: newHolding._id } });
//           }

//           // Update user's autoTradeFund and remaining balance
//           user.autoTradeFund -= finalCost;
//           await user.save();
//           remainingAutoBalance -= finalCost;
//           investedAutoBalance += finalCost;

//           console.log(`✅ Auto-Buy executed: ${symbol} (${quantity} shares at ₹${price})`);
//         } catch (err) {
//           console.log(`❌ Failed to execute BUY for ${symbol}:`, err.message);
//         }
//       }

//       // ===== SELL LOGIC =====
//       if (mlRecommendation.toUpperCase() === "SELL" && existingHolding && existingHolding.isAutoTraded) {
//         const quantityToSell = existingHolding.quantity;
//         const sellPrice = price;
//         const proceeds = quantityToSell * sellPrice;

//         const autoFundPortion = proceeds * 0.5;
//         const balancePortion = proceeds - autoFundPortion;

//         try {
//           // Create order
//           const newOrder = await OrdersModel.create({
//             user: userId,
//             name: symbol,
//             quantity: quantityToSell,
//             price: sellPrice,
//             action: "SELL",
//             mlRecommendation,
//             autoTradeEnabled: true,
//             executed: true,
//           });

//           await UsersModel.findByIdAndUpdate(userId, { $push: { orders: newOrder._id } });

//           // Remove holding
//           await HoldingsModel.deleteOne({ _id: existingHolding._id });
//           await UsersModel.findByIdAndUpdate(userId, { $pull: { holdings: existingHolding._id } });

//           // Update user balances
//           user.balance += balancePortion;
//           user.autoTradeFund += autoFundPortion;
//           await user.save();

//           // Update local variables
//           remainingAutoBalance += quantityToSell * existingHolding.avg_price;
//           investedAutoBalance -= quantityToSell * existingHolding.avg_price;

//           console.log(`✅ Auto-Sell executed: ${symbol} (${quantityToSell} shares at ₹${sellPrice})`);
//         } catch (err) {
//           console.log(`❌ Failed to execute SELL for ${symbol}:`, err.message);
//         }
//       }
//     }

//     // Recalculate totals
//     try {
//       const userHoldings = await HoldingsModel.find({ user: userId });
//       const totalCurrentValue = userHoldings.reduce((acc, h) => acc + h.price * h.quantity, 0);
//       const totalInvested = userHoldings.reduce((acc, h) => acc + h.avg_price * h.quantity, 0);
//       const totalPnL = totalCurrentValue - totalInvested;

//       user.totalInvested = totalInvested;
//       user.totalCurrentValue = totalCurrentValue;
//       user.totalPnL = totalPnL;
//       await user.save();
//     } catch (err) {
//       console.log("❌ Failed to update user totals:", err.message);
//     }
//   }

//   console.log("\n✅ Auto Trade cycle completed.");
// }

// module.exports = runAutoTrade;

const { UsersModel } = require("../models/UsersModel");
const { OrdersModel } = require("../models/OrdersModel");
const { HoldingsModel } = require("../models/HoldingsModel");
const { StocksModel } = require("../models/StocksModel");

async function runAutoTrade() {
  console.log("🚀 Running Auto trade");

  const users = await UsersModel.find({ autoTradingEnabled: true });
  if (!users.length) {
    console.log("⚠️ No auto-trading users found");
    return;
  }

  for (const user of users) {
    console.log(`\n👤 Processing user: ${user.username}`);
    const { _id: userId, autoTradeLimitPercent } = user;

    // Initialize AutoTradeFund if not set
    if (!user.autoTradeFund || user.autoTradeFund <= 0) {
      const fund = (user.balance * autoTradeLimitPercent) / 100;
      user.autoTradeFund = fund;
      user.balance -= fund;
      await user.save();
      console.log(`💰 Initialized AutoTradeFund: ₹${user.autoTradeFund}`);
    }

    // Fetch auto-traded holdings
    let autoHoldings = await HoldingsModel.find({ user: userId, isAutoTraded: true });
    let investedAutoBalance = autoHoldings.reduce((sum, h) => sum + h.quantity * h.price, 0);
    let remainingAutoBalance = user.autoTradeFund - investedAutoBalance;

    console.log(`AutoTradeFund: ₹${user.autoTradeFund}, Invested: ₹${investedAutoBalance}, Remaining: ₹${remainingAutoBalance}`);

    if (remainingAutoBalance <= 0) {
      console.log("❌ No remaining auto-trade balance");
      continue;
    }

    const stocks = await StocksModel.find({ autoTradeEnabled: true });
    if (!stocks.length) {
      console.log("⚠️ No eligible stocks found for trading.");
      continue;
    }

    console.log(`Eligible stocks for trading: ${stocks.map(s => s.symbol).join(", ")}`);

    const boughtStocksThisCycle = new Set();

    for (const stock of stocks) {
      const { symbol, mlRecommendation, confidence, lastPredictedAt, currentPrice } = stock;

      // Skip outdated predictions
      if (Date.now() - new Date(lastPredictedAt) > 24 * 60 * 60 * 1000) continue;
      if (confidence < 0.6) continue;

      const existingHolding = await HoldingsModel.findOne({ user: userId, name: symbol });
      const price = currentPrice || 1000;

      // ===== BUY LOGIC =====
      if (
        mlRecommendation.toUpperCase() === "BUY" &&
        remainingAutoBalance > 0 &&
        !boughtStocksThisCycle.has(symbol)
      ) {
        let allocation = Math.min(remainingAutoBalance, user.autoTradeFund * 0.3);
        let quantity = Math.max(1, Math.floor(allocation / price));

        if (quantity <= 0) quantity = 1; // Force at least 1 share if allocation too small

        const totalCost = quantity * price;
        if (totalCost > remainingAutoBalance) quantity = Math.floor(remainingAutoBalance / price);

        const finalCost = quantity * price;

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
            autoTradeBalanceUsed: finalCost,
          });
          await UsersModel.findByIdAndUpdate(userId, { $push: { orders: newOrder._id } });

          // Update or create holding
          if (existingHolding) {
            const newQuantity = existingHolding.quantity + quantity;
            const newAvgPrice = ((existingHolding.avg_price * existingHolding.quantity) + finalCost) / newQuantity;
            existingHolding.quantity = newQuantity;
            existingHolding.avg_price = newAvgPrice;
            existingHolding.price = price;
            existingHolding.pnl = (price - newAvgPrice) * newQuantity;
            existingHolding.isLoss = existingHolding.pnl < 0;
            await existingHolding.save();
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
            await UsersModel.findByIdAndUpdate(userId, { $push: { holdings: newHolding._id } });
          }

          // Update balances
          user.autoTradeFund -= finalCost;
          await user.save();
          remainingAutoBalance -= finalCost;
          investedAutoBalance += finalCost;

          boughtStocksThisCycle.add(symbol);
          console.log(`✅ Auto-Buy executed: ${symbol} (${quantity} shares at ₹${price})`);
        } catch (err) {
          console.log(`❌ Failed to execute BUY for ${symbol}:`, err.message);
        }
      }

      // ===== SELL LOGIC =====
      if (mlRecommendation.toUpperCase() === "SELL" && existingHolding && existingHolding.isAutoTraded) {
        const quantityToSell = existingHolding.quantity;
        const sellPrice = price;
        const proceeds = quantityToSell * sellPrice;
        const autoFundPortion = proceeds * 0.5;
        const balancePortion = proceeds - autoFundPortion;

        try {
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
          await UsersModel.findByIdAndUpdate(userId, { $push: { orders: newOrder._id } });

          await HoldingsModel.deleteOne({ _id: existingHolding._id });
          await UsersModel.findByIdAndUpdate(userId, { $pull: { holdings: existingHolding._id } });

          user.balance += balancePortion;
          user.autoTradeFund += autoFundPortion;
          await user.save();

          remainingAutoBalance += quantityToSell * existingHolding.avg_price;
          investedAutoBalance -= quantityToSell * existingHolding.avg_price;

          console.log(`✅ Auto-Sell executed: ${symbol} (${quantityToSell} shares at ₹${sellPrice})`);
        } catch (err) {
          console.log(`❌ Failed to execute SELL for ${symbol}:`, err.message);
        }
      }
    }

    // Recalculate totals
    try {
      const userHoldings = await HoldingsModel.find({ user: userId });
      const totalCurrentValue = userHoldings.reduce((acc, h) => acc + h.price * h.quantity, 0);
      const totalInvested = userHoldings.reduce((acc, h) => acc + h.avg_price * h.quantity, 0);
      const totalPnL = totalCurrentValue - totalInvested;

      user.totalInvested = totalInvested;
      user.totalCurrentValue = totalCurrentValue;
      user.totalPnL = totalPnL;
      await user.save();
    } catch (err) {
      console.log("❌ Failed to update user totals:", err.message);
    }
  }

  console.log("\n✅ Auto Trade cycle completed.");
}

module.exports = runAutoTrade;
