const {Schema} = require("mongoose");

const WatchlistSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    percent:{type:Number, required: true},
    isDown: { type: Boolean, default: false },
    updatedAt: {type: Date, default: Date.now}
});

module.exports = {WatchlistSchema};