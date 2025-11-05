const {Schema} = require("mongoose");

const PositionsSchema = new Schema({
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
    exitStrategy: String,
    stopLoss: Number,
    targetPrice: Number,
    mlTriggered: Boolean,
    confidence: { type: Number, min: 0, max: 1, default: null },

    openedAt: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    // openedAt: When position was created
    // lastUpdated: Track price updates

    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Users",
    //     required: true,
    // },
});

module.exports = {PositionsSchema}