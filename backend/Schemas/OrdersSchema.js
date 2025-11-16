const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrdersSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref:"User", required: false},
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    action:{ 
        type: String, 
        enum: ['BUY', 'SELL', 'HOLD'],
        default: null 
    },

    //ML fields
    mlRecommendation: { 
        type: String, 
        enum: ['BUY', 'SELL', 'HOLD'],
        default: null 
    },
    confidence: { type: Number, min: 0, max: 1, default: null },
    predictedPrice: { type: Number, default: null },
    aiReason: { type: String, default: null },   

    //Automation:
    autoTradeEnabled: { type: Boolean, default: false },
    autoTradeLimitPercent: { type: Number, default: 30 }, // user can change this
    autoTradeBalanceUsed: { type: Number, default: 0 },
    executed: { type: Boolean, default: false },// Whether it was executed in autotrade

    // Order life-cycle (optional)
    status: { type: String, enum: ['PENDING', 'EXECUTED', 'FAILED', 'CANCELLED'], default: 'PENDING' }
}, {timestamps: true});

module.exports = {OrdersSchema};