const {model} = require("mongoose");

const {PositionsSchema} = require('../Schemas/PositionsSchema');
PositionsModel = model("position",PositionsSchema);

module.exports = {PositionsModel};