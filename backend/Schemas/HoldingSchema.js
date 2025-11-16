const mongoose = require("mongoose");
const { Schema } = mongoose;

const HoldingsSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref:"User", required: false},
    name: { type: String, required: true },
    quantity: Number,
    avg_price: Number,
    price: Number, // ✅ Good - current market price
    lastSyncedAt:{type:Date, default: Date.now},
    net: Number,
    day: Number,
    isLoss: Boolean,
    pnl:{type:Number, default:0},
    
    // ML metadata
    isAutoTraded: { type: Boolean, default: false },   
    lastMLUpdate: { type: Date, default: null },
}, {timestamps: true});
module.exports = {HoldingsSchema};