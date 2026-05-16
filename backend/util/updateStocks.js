
// updateStocks.js - Robust batch update
const axios = require("axios");
const { StocksModel } = require("../models/StocksModel");

async function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function updateStocks() {
  try {
    console.log(" Manual updateStocks triggered...");
    console.log(" Updating stock predictions...");

    // 1️ Fetch live stock data from NSE
    const response = await axios.get(
      "https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050",
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
          Referer: "https://www.nseindia.com/",
        },
      }
    );

    const stocks = response.data.data;
    if (!stocks || !stocks.length) throw new Error("No data from NSE");
    console.log(`✅ Got ${stocks.length} stocks from NSE.`);

    // 2️ Clear old data
    await StocksModel.deleteMany({});

    // 3️ Helper to process one stock with retry
    const processStock = async (stock) => {
      const symbol = stock.symbol + ".NS";
      const price = parseFloat(stock.lastPrice);
      const percent = parseFloat(stock.pChange);
      if (!symbol || isNaN(price)) return null;

      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
          const mlResponse = await axios.post(
            `${BACKEND_URL}/mlservice/predict`,
            { symbol, force_retrain: false },
            { headers: { "Content-Type": "application/json" }, timeout: 20000 }
          );

          const data = mlResponse.data;

          if (!data || !data.recommendation) {
            console.log(` Skipping ${symbol}: No recommendation`);
            return null;
          }

          const rec = data.recommendation;
          const sentiment = data.sentiment || {};
          const MIN_CONFIDENCE = 0.60;

          console.log(` Updated ${symbol}: ${rec.action || "HOLD"}`);

          return {
            symbol,
            name: stock.identifier || symbol,
            currentPrice: price,
            percentChange: percent,
            isDown: percent < 0,
            mlRecommendation: rec.action || "HOLD",
            confidence: rec.final_confidence ?? null,
            sentimentScore: sentiment.score ?? null,
            reasoning: rec.reasoning || null,
            meetsThreshold: !!rec.meets_threshold,
            autoTradeEnabled: rec?.meets_threshold && (rec.confidence ?? rec.final_confidence) >= MIN_CONFIDENCE,
            lastPredictedAt: new Date(),
          };
        } catch (err) {
          console.log(
            ` Attempt ${attempt} failed for ${symbol}: ${err.message}`
          );
          if (attempt === 2) return null; // Skip after second failure
          await delay(2000); // wait 2s before retry
        }
      }
    };

    // 4️ Run predictions in batches to reduce load
    const BATCH_SIZE = 5;
    const formattedStocks = [];

    for (let i = 0; i < stocks.length; i += BATCH_SIZE) {
      const batch = stocks.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(batch.map(processStock));
      formattedStocks.push(...results.filter(Boolean));
      await delay(1000); // brief pause between batches
    }

    // 5 Save all valid predictions to DB
    if (formattedStocks.length > 0) {
      await StocksModel.insertMany(formattedStocks);
    }

    console.log(
      ` All ${formattedStocks.length} stock updates complete.`
    );
  } catch (err) {
    console.log(" updateStocks failed:", err.message);
  }
}

module.exports = updateStocks;
