const {model} = require("mongoose");

const {UsersSchema} = require('../Schemas/UsersSchema');

const UsersModel = model("user",UsersSchema);

module.exports = {UsersModel};