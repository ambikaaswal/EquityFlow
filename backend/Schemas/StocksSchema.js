// const mongoose = require("mongoose");
// const StocksSchema = new mongoose.Schema({
//   symbol: String,
//   date: Date,
//   close: Number,
//   prediction: {
//     direction: String, // 'UP' or 'DOWN'
//     confidence: Number,
//     model_version: String
//   }
// },{timestamps: true} );

// module.exports = {StocksSchema}
const mongoose = require("mongoose");
const { Schema } = mongoose;

const StocksSchema = new Schema({
  symbol: { type: String, required: true, unique: true },
  name: { type: String },
    
  currentPrice: { type: Number, default: null },
  lastUpdatedPriceAt: { type: Date, default: Date.now },

  // --- ML Fields ---
  mlRecommendation: { type: String, enum: ['BUY', 'SELL', 'HOLD'], default: 'HOLD' },
  confidence: { type: Number, default: null },
  sentimentScore: { type: Number, default: null },
  lastPredictedAt: { type: Date, default: Date.now },
  reasoning: { type: String, default: null },
  meetsThreshold: { type: Boolean, default: false },

  // modelVersion: { type: String, default: "v1" }
  // triggerThreshold: { type: Number, default: 0.7 },

  autoTradeEnabled: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = { StocksSchema };
