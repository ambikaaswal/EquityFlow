const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config({ quiet: true });

const axios = require("axios");
 
const cookieParser = require("cookie-parser");
const cors = require('cors');

const requireAuth = require("./Middlewares/AuthMiddleware")

// useless for now. 
// const Stocks = require("./Routes/Stocks");

const PORT = process.env.PORT || 8000;
const DB_URL = process.env.EQUITYFLOW_DB_URL;

app.use(
  cors({
    // origin: ["http://localhost:5173"],
    origin: [
    "http://localhost:5173",
    "http://localhost:5174"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const {WatchlistModel} = require("./models/WatchlistModel");

const {HoldingsModel} = require("./models/HoldingsModel");

const {PositionsModel} = require("./models/PositionsModel");

const { UsersModel } = require("./models/UsersModel");

const {OrdersModel} = require("./models/OrdersModel");

// 🔁 Run once immediately, intial sync for watchlist and holdings
//update/sync watchlist live from NSE:
const {updateWatchlist} = require("./util/updateWatchlist");
const { syncHoldingsWithLivePrices } = require("./util/syncHoldings");
(async () => {
  try {
    console.log("🚀 Initial holdings sync...");
    await updateWatchlist();
    await syncHoldingsWithLivePrices();
  } catch (err) {
    console.error("Initial sync failed:", err.message);
  }
})();

// scheduled holdings update:
const cron = require("node-cron");
cron.schedule("*/5 * * * *", async () => {
  try {
    console.log("⏱️ Running holdings sync...");
    await updateWatchlist();
    await syncHoldingsWithLivePrices();
  } catch (err) {
    console.error("Cron job failed:", err.message);
  }
});


//manual trigger:
// app.post("/mlservice/autoTrade/run", async (req, res) => {
//   const runAutoTrade = require("./util/runAutoTrade");
//   await runAutoTrade();
//   res.json({ message: "Auto trade executed successfully" });
// });


const getUserPayload = (user)=>({
  id: user._id,
  name: user.username,
  balance: user.balance,
  totalCurrentValue: user.totalCurrentValue,
  totalInvested: user.totalInvested,
  totalPnL: user.totalPnL,
  initialBalance: user.initialBalance,
  autoTradingEnabled: user.autoTradingEnabled,
});

app.get("/user/data", requireAuth, async(req,res)=>{
  res.json({success:true,
  user:getUserPayload(req.user)});
});

app.get("/allHoldings", requireAuth, async(req,res)=>{
    let allHoldings = await HoldingsModel.find({ user: req.user._id });
    res.json({ success: true, allHoldings });
});

app.get("/allPositions", requireAuth, async(req,res)=>{
    let allPositions = await PositionsModel.find({user: req.user._id});
    res.json({success:true, allPositions});
});

app.get("/allOrders", requireAuth, async(req,res)=>{
  let allOrders = await OrdersModel.find({user:req.user._id});
  res.json({success:true, allOrders});
});

//get user for dashboard api
const jwt = require("jsonwebtoken");
app.get("/getuser", requireAuth, async(req,res)=>{
  // const token = req.cookies.token;
  // if(!token) return res.status(401).json({message:"unauthorized access"});
  // try{
  //   const decoded = jwt.verify(token, process.env.TOKEN_KEY);
  //   const user = await UsersModel.findById(decoded.id).select("-password");
  //   res.json({sucess:true, user});
  // }catch(err){
  //   res.status(401).json({message:"Invalid token"});
  // }
  res.json({ success: true, user: req.user });
});


app.get("/watchlist/stocks", async(req, res)=>{
    const watchlist = await WatchlistModel.find({}).sort({percent:-1}).limit(14);
    // const watchlist = await WatchlistModel.find({}).sort({percent:-1});
    res.json(watchlist);
});


//balance allocation:
app.post("/allocateBalance", requireAuth, async (req, res) => {
  const { amount } = req.body;
  const userId = req.user._id;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const user = await UsersModel.findByIdAndUpdate(
    userId,
    { $inc: { balance: amount } },
    { new: true }
  );

  res.json({ message: "Balance updated", balance: user.balance });
});

//to get new order:
app.post('/newOrder', requireAuth, async(req,res)=>{
  const {name, quantity, price, action} = req.body;
  const userId = req.user._id;

    let newOrder = new OrdersModel({
        name: name,
        quantity: quantity,
        price: price,
        action: action,
        user:userId
    });
    // console.log(newOrder);
    await newOrder.save();

    //Push to user's orders array
    await UsersModel.findByIdAndUpdate(userId, {
      $push: { orders: newOrder._id }
    });

    //find the holding
    const existingHolding = await HoldingsModel.findOne({name, user:userId});
    //find user
    const user = await UsersModel.findById(userId);
    if(action === "BUY")
    {
            const totalCost = quantity * price;
            if(user.balance< totalCost)
              return res.status(400).json({success:false, message: "Insufficient Balance"})
            user.balance-=totalCost;
            await user.save();
        //if holding already exists
        if(existingHolding)
        {
            const newQuantity = existingHolding.quantity + quantity;
            const newCost = (existingHolding.avg_price * existingHolding.quantity) + (price*quantity);
            const newAvg_price = newCost/newQuantity;
            const newPnl = (price-newAvg_price)* newQuantity;

            existingHolding.quantity = newQuantity;
            existingHolding.avg_price = newAvg_price;
            existingHolding.price = price;
            existingHolding.pnl = newPnl;
            existingHolding.isLoss = newPnl <0;
            await existingHolding.save();
        }else
        {
            //create new
            const newHolding = new HoldingsModel({
                name,
                quantity,
                avg_price:price,
                price,
                net:0,
                day:0,
                isLoss:false,
                user:userId,
            });
            await newHolding.save();
            await UsersModel.findByIdAndUpdate(userId, {
                $push: { holdings: newHolding._id }
              });
        }
        const holdings = await HoldingsModel.find({user:userId});
        const totalCurrentValue = holdings.reduce((acc, h)=> acc+ h.price * h.quantity, 0);
        const totalInvested = holdings.reduce((acc,h)=> acc + h.avg_price * h.quantity, 0);
        const totalPnl = totalCurrentValue-totalInvested;
        user.totalInvested = totalInvested;
        user.totalCurrentValue = totalCurrentValue;
        user.totalPnL = totalPnl;
        await user.save();
    }
    if(action=="SELL")
    {
        if (!existingHolding || existingHolding.quantity < quantity) {
            return res.status(400).json({ success: false, message: "Not enough quantity to sell" });
          }

        const proceeds = quantity * price;
        user.balance+=proceeds;
        // Recalculate totalInvested and totalCurrentValue
        const holdings = await HoldingsModel.find({ user: userId });
        const totalCurrentValue = holdings.reduce((acc, h) => acc + h.price * h.quantity, 0);
        const totalInvested = holdings.reduce((acc, h) => acc + h.avg_price * h.quantity, 0);
        const totalPnL = totalCurrentValue - totalInvested;

        user.totalInvested = totalInvested;
        user.totalCurrentValue = totalCurrentValue;
        user.totalPnL = totalPnL;
        await user.save();
        if(existingHolding){
            const newQuantity = existingHolding.quantity - quantity;
            if(newQuantity>0)
            {
                existingHolding.quantity = newQuantity;
                existingHolding.price = price;
                const newPnl = (price - existingHolding.avg_price) * newQuantity;
                existingHolding.pnl = newPnl;
                existingHolding.isLoss = newPnl < 0;
                await existingHolding.save();
            }
            else
            {
                await HoldingsModel.deleteOne({name, user:userId});
                await UsersModel.findByIdAndUpdate(userId, {
                  $pull: { holdings: existingHolding._id }
                });
            }
        }
    }
    res.send("order saved");
});

//unused
// app.get("/api/stocks/most-active",Stocks);

app.post("/logout", (req, res) => {
  res.clearCookie("token",{
    httpOnly:true,
    secure:true,
    sameSite: "None",
  });
  res.json({ success: true, message: "Logged out" });
});


const AuthRoute = require("./Routes/AuthRoute");
app.use("/", AuthRoute);


const MLpredictRoute = require("./Routes/MLpredictRoute");
app.use("/mlservice",MLpredictRoute);

const updateStocks = require("./util/updateStocks")
const runAutoTrade = require("./util/runAutoTrade");


//run every hour:
// cron.schedule("0 * * * *", async () => {
//   try {
//     console.log("⏰ Running hourly auto trade...");
//     await runAutoTrade();
//   } catch (err) {
//     console.error("❌ Auto trade cron failed:", err.message);
//   }
// });

// app.post('/autotrade', requireAuth, async(req,res)=>{
//   const userId = req.user._id;
//   const {enabled, limitPercent} = req.body;
//   if( enabled && (limitPercent < 1 || limitPercent > 30)){
//     return res.status(400).json({message: "limit must be  1 and 30"})
//   }
//   try{
//     const updatedUser = await UsersModel.findByIdAndUpdate(
//       userId,
//       {
//         autoTradingEnabled: enabled,
//         autoTradeLimitPercent: enabled ? limitPercent: 0,
//       },
//       {new: true}
//     );

//    if (enabled) {
//       console.log("⚙️ Auto trade enabled — fetching latest stock predictions...");
//       // await updateStocks(); 
//       await runAutoTrade();
//     }
    
//     res.json({
//       success: true,
//       message: enabled
//       ? `Auto trade enabled (${limitPercent}% balance)`
//       : "Auto trade disabled",
//       user: updatedUser,
//     });
//   }catch(err){
//     res.status(500).json({message: "failed to update auto trade status"});
//   }
// });

app.post('/autotrade', requireAuth, async(req,res) => {
  const userId = req.user._id;
  const { enabled, limitPercent } = req.body;

  if (enabled && (limitPercent < 1 || limitPercent > 30)) {
    return res.status(400).json({ message: "limit must be between 1 and 30" });
  }

  try {
    // If disabling auto-trade, move remaining autoTradeFund to balance
    if (!enabled && req.user.autoTradeFund && req.user.autoTradeFund > 0) {
      req.user.balance += req.user.autoTradeFund;
      console.log(`💸 AutoTradeFund of ₹${req.user.autoTradeFund} moved to balance for ${req.user.username}`);
      req.user.autoTradeFund = 0;
    }

    // Update auto-trade settings
    const updatedUser = await UsersModel.findByIdAndUpdate(
      userId,
      {
        autoTradingEnabled: enabled,
        autoTradeLimitPercent: enabled ? limitPercent : 0,
        balance: req.user.balance,
        autoTradeFund: req.user.autoTradeFund,
      },
      { new: true }
    );

    if (enabled) {
      console.log("⚙️ Auto trade enabled — fetching latest stock predictions...");
      await runAutoTrade();
    }

    res.json({
      success: true,
      message: enabled
        ? `Auto trade enabled (${limitPercent}% of balance)`
        : "Auto trade disabled",
      user: updatedUser,
    });

  } catch (err) {
    res.status(500).json({ message: "failed to update auto trade status" });
  }
});


//update stocks:
app.post("/update-stocks", async (req, res) => {
  try {
    console.log("🌀 Manual updateStocks triggered...");
    await updateStocks();
    res.json({ success: true, message: "Stocks updated successfully" });
  } catch (err) {
    console.error("❌ updateStocks failed:", err.message);
    res.status(500).json({ success: false, message: "Failed to update stocks", error: err.message });
  }
});


mongoose
  .connect(DB_URL)
  .then(() => console.log("DB is connected successfully"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
