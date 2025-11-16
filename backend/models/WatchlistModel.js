const {model} = require("mongoose");

const {WatchlistSchema} = require('../Schemas/WatchlistSchema');

const WatchlistModel = model("watchlist",WatchlistSchema);

module.exports = {WatchlistModel};