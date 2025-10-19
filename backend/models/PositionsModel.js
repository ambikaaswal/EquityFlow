const {model} = require("mongoose");

const {PositionsSchema} = require('../Schemas/PositionsSchema');
PositionsModel = new model("position",PositionsSchema);

module.exports = {PositionsModel};