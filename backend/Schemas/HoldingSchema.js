const {Schema} = require("mongoose");

const HoldingsSchema = new Schema({

    name: { type: String, required: true },
    quantity: Number,
    avg_price: Number,
    price: Number, // ✅ Good - current market price
    net: Number,
    day: Number,
    isLoss: Boolean,

    mlSuggestion: { 
        type: String, 
        enum: ['HOLD', 'SELL', 'BUY', 'TRACK'],
        default: null 
    },
    riskScore: { type: Number, min: 1, max: 10, default: null },
    performancePrediction: Number, // Expected % return
    confidence: { type: Number, min: 0, max: 1, default: null },
    autoRebalance: { type: Boolean, default: false },
    
    // ML metadata
    lastMLUpdate: { type: Date, default: null },
    mlVersion: { type: String, default: null } 

    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Users",
    //     required: true,
    // },
});
module.exports = {HoldingsSchema};