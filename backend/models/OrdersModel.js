const {model} = require("mongoose");

const {OrdersSchema} = require('../Schemas/OrdersSchema');

const OrdersModel = model("order",OrdersSchema);

module.exports = {OrdersModel};