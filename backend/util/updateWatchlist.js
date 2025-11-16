const axios = require("axios");
const { WatchlistModel } = require("../models/WatchlistModel");

async function updateWatchlist(){
    try{
        console.log("updating watchlist from NSE...");
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
        if(!stocks||!stocks.length) throw new Error("No data from NSE");
        
        const formatted = stocks.map(stock=>({
            name: stock.symbol + ".NS",
            price: parseFloat(stock.lastPrice),
            percent: parseFloat(stock.pChange),
            isDown: parseFloat(stock.pChange)<0,
        }));
        await WatchlistModel.deleteMany({});
        await WatchlistModel.insertMany(formatted);
        console.log("Watchlist schema updated");
    }catch(err){
        console.log("Watchlist updation failed:", err.message);
    }
}

module.exports = {updateWatchlist};
