const mongoose = require("mongoose");
const { Schema } = mongoose;
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
    type: String,
    required: [true, "Your mobile number is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  holdings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Holdings",
    },
  ],
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Orders",
    },
  ],
  positions: [
  {
    type: Schema.Types.ObjectId,
    ref: "Positions",
  },
  ],
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

//   // whether auto-trading is enabled
  autoTradingEnabled: {
    type: Boolean,
    default: false,
  },

  autoTradeLimitPercent: { type: Number, default: 0 },
  autoTradeBalanceUsed: { type: Number, default: 0 },

  balance: {
  type: Number,
  default: 10000 // or any starting capital
},
  autoTradeFund: {
    type: Number,
    default: 0, // Will be set when enabling auto-trade
},

  initialBalance: {
    type: Number,
    default: 10000
  }
});

UsersSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});
module.exports = {UsersSchema};