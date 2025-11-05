const {model} = require("mongoose");

const {HoldingsSchema} = require('../Schemas/HoldingSchema');

const HoldingsModel = model("holding",HoldingsSchema);

module.exports = {HoldingsModel};