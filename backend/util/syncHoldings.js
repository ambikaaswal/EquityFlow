const axios = require("axios");
const { HoldingsModel } = require("../models/HoldingsModel");

async function syncHoldingsWithLivePrices() {
  try {
    // 1️⃣ Fetch all NIFTY 50 stocks from NSE
    const response = await axios.get(
      "https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050",
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/json",
          "Referer": "https://www.nseindia.com/",
        },
      }
    );

    const stocks = response.data.data;
    if (!stocks || !stocks.length) throw new Error("No data from NSE");

    // 2️⃣ Create lookup map for quick access
    const stockMap = {};
    for (const s of stocks) {
      stockMap[s.symbol] = {
        price: parseFloat(s.lastPrice),
        percent: parseFloat(s.pChange),
      };
    }

    // 3️⃣ Get all holdings
    const holdings = await HoldingsModel.find({});

    // 4️⃣ Sync each holding with live data
    for (const holding of holdings) {
      const symbol = holding.name.replace(".NS", "");
      const live = stockMap[symbol];

      if (!live) {
        console.warn(`No NSE data found for ${holding.name}`);
        continue;
      }

      const livePrice = live.price;
      const dayChange = live.percent;

      const net = (livePrice - holding.avg_price) * holding.quantity;
      const isLoss = net < 0;

      holding.price = livePrice;
      holding.net = ((net / (holding.avg_price * holding.quantity)) * 100).toFixed(2);
      holding.isLoss = isLoss;
      holding.day = dayChange;
      holding.lastSyncedAt = new Date();

      await holding.save();
      console.log(`✅ Synced ${holding.name}: ₹${livePrice} (${dayChange}%)`);
    }

  } catch (err) {
    console.error("❌ Sync failed:", err.message);
  }
}

module.exports = { syncHoldingsWithLivePrices };
