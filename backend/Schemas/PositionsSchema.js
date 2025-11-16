const mongoose = require("mongoose");
const { Schema } = mongoose;

const PositionsSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref:"User", required: false},
    product: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    avg_price: { type: Number, required: true },
    price: { type: Number, required: true },
    net: Number,
    day: Number,
    isLoss: { type: Boolean, default: false },

    // ML fields populated
    isAutomated: Boolean, // This was an AI trade
    // exitStrategy: String,
    // stopLoss: Number,
    // targetPrice: Number,
    // mlTriggered: Boolean,
    // confidence: { type: Number, min: 0, max: 1, default: null },

}, {timestamps: true});

module.exports = {PositionsSchema}