const {Schema} = require("mongoose");

const OrdersSchema = new Schema({
    
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    action:{ 
        type: String, 
        enum: ['BUY', 'SELL', 'HOLD'],
        default: null 
    },
    // user: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "Users",
    // required: true,
    // },
});
// const OrdersSchema = new Schema({
//     name: { type: String, required: true }, // Stock symbol
//     price: { type: Number, required: true },
//     percent: { type: Number, required: true }, // % change
//     isDown: { type: Boolean, default: false },

//     // ML fields (use null defaults, not hardcoded values!)
//     mlRecommendation: { 
//         type: String, 
//         enum: ['BUY', 'SELL', 'HOLD'],
//         default: null 
//     },
//     confidence: { type: Number, min: 0, max: 1, default: null },
//     predictedPrice: { type: Number, default: null },
//     aiReason: { type: String, default: null },
//     autoTradeEnabled: { type: Boolean, default: false },
    
//     // Metadata
//     // addedAt: { type: Date, default: Date.now },
//     // lastUpdated: { type: Date, default: Date.now }
// });

module.exports = {OrdersSchema};