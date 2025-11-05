const {Schema} = require('mongoose');
const bcrypt = require("bcryptjs");

const UsersSchema = new Schema({
    email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Your username is required"],
  },
  mobile:{
    type: Number,
    required: [true, "Your mobile number is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },

//   holdings: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Holdings",
//     },
//   ],
//   orders: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Orders",
//     },
//   ],
//   watchlist: [
//     {
//       symbol: String,
//       addedAt: {
//         type: Date,
//         default: Date.now,
//       },
//     },
//   ],
//   positions: [
//   {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Positions",
//   },
//   ],


//   // whether auto-trading is enabled
//   autoTradingEnabled: {
//     type: Boolean,
//     default: false,
//   },

 // veto setting: auto/manual/hybrid
//   vetoMode: {
//     type: String,
//     enum: ["AUTO", "HYBRID", "MANUAL"],
//     default: "HYBRID",
//   },

  // Performance & Analytics
  // -------------------
  totalInvested: {
    type: Number,
    default: 0,
  },
  totalCurrentValue: {
    type: Number,
    default: 0,
  },
  totalPnL: {
    type: Number,
    default: 0,
  },
});

UsersSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});
module.exports = {UsersSchema};