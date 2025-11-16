const {model} = require("mongoose");

const {StocksSchema} = require('../Schemas/StocksSchema');

const StocksModel = model("stock",StocksSchema);

module.exports = {StocksModel};