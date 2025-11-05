const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

const cookieParser = require("cookie-parser");
const cors = require('cors');

const AuthRoute = require("./Routes/AuthRoute");
const Stocks = require("./Routes/Stocks");

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

// function main(){
//     mongoose.connect(DB_URL);
// }
// main()
// .then(()=>{
//     console.log("connected to db");
// }).catch(err=>{
//     console.log(err);
// });

const {HoldingsModel} = require("./models/HoldingsModel");

//sending data (holdings collection) added to atlas db:
// app.get("/addHoldings",async(req,res)=>{
//     let tempHoldings = [
//   {
//     name: "BHARTIARTL",
//     quantity: 2,
//     avg_price: 538.05,
//     price: 541.15,
//     net: 6.2,
//     day: 32.4,
//     isLoss: false,

//     mlSuggestion: null,
//     riskScore: null,
//     performancePrediction: null,
//     autoRebalance: false,
//   },
//   {
//     name: "HDFCBANK",
//     quantity: 2,
//     avg_price: 1383.4,
//     price: 1522.35,
//     net: 277.9,
//     day: 3.05,
//     isLoss: false,

//     mlSuggestion: null,
//     riskScore: null,
//     performancePrediction: null,
//     autoRebalance: false,
//   },
//   {
//     name: "HINDUNILVR",
//     quantity: 1,
//     avg_price: 2335.85,
//     price: 2417.4,
//     net: 81.55,
//     day: 5.08,
//     isLoss: false,

//     mlSuggestion: null,
//     riskScore: null,
//     performancePrediction: null,
//     autoRebalance: false,
//   },
//   {
//     name: "INFY",
//     quantity: 1,
//     avg_price: 1350.5,
//     price: 1555.45,
//     net: 204.95,
//     day: -25.2,
//     isLoss: true,

//     mlSuggestion: null,
//     riskScore: null,
//     performancePrediction: null,
//     autoRebalance: false,
//   },
//   {
//     name: "ITC",
//     quantity: 5,
//     avg_price: 202.0,
//     price: 207.9,
//     net: 29.5,
//     day: 8.32,
//     isLoss: false,

//     mlSuggestion: null,
//     riskScore: null,
//     performancePrediction: null,
//     autoRebalance: false,
//   },
//   {
//     name: "KPITTECH",
//     quantity: 5,
//     avg_price: 250.3,
//     price: 266.45,
//     net: 80.75,
//     day: 44.36,
//     isLoss: false,

//     mlSuggestion: null,
//     riskScore: null,
//     performancePrediction: null,
//     autoRebalance: false,
//   },
//   {
//     name: "M&M",
//     quantity: 2,
//     avg_price: 809.9,
//     price: 779.8,
//     net: -60.2,
//     day: -0.16,
//     isLoss: true,

//     mlSuggestion: null,
//     riskScore: null,
//     performancePrediction: null,
//     autoRebalance: false,
//   },
//   {
//     name: "RELIANCE",
//     quantity: 1,
//     avg_price: 2193.7,
//     price: 2112.4,
//     net: -81.3,
//     day: 30.42,
//     isLoss: false,

//     mlSuggestion: null,
//     riskScore: null,
//     performancePrediction: null,
//     autoRebalance: false,
//   },
//   {
//     name: "SBIN",
//     quantity: 4,
//     avg_price: 324.35,
//     price: 430.2,
//     net: 423.4,
//     day: -5.86,
//     isLoss: true,

//     mlSuggestion: null,
//     riskScore: null,
//     performancePrediction: null,
//     autoRebalance: false,
//   },
//   {
//     name: "SGBMAY29",
//     quantity: 2,
//     avg_price: 4727.0,
//     price: 4719.0,
//     net: -16.0,
//     day: 14.22,
//     isLoss: false,

//     mlSuggestion: null,
//     riskScore: null,
//     performancePrediction: null,
//     autoRebalance: false,
//   },
//   {
//     name: "TATAPOWER",
//     quantity: 5,
//     avg_price: 104.2,
//     price: 124.15,
//     net: 99.75,
//     day: -1.49,
//     isLoss: true,

//     mlSuggestion: null,
//     riskScore: null,
//     performancePrediction: null,
//     autoRebalance: false,
//   },
//   {
//     name: "TCS",
//     quantity: 1,
//     avg_price: 3041.7,
//     price: 3194.8,
//     net: 153.1,
//     day: -8.04,
//     isLoss: true,

//     mlSuggestion: null,
//     riskScore: null,
//     performancePrediction: null,
//     autoRebalance: false,
//   },
//   {
//     name: "WIPRO",
//     quantity: 4,
//     avg_price: 489.3,
//     price: 577.75,
//     net: 353.8,
//     day: 7.4,
//     isLoss: false,

//     mlSuggestion: null,
//     riskScore: null,
//     performancePrediction: null,
//     autoRebalance: false,
//   },
// ];
//     tempHoldings.forEach((item)=>{
//         let newHolding = new HoldingsModel({
//             name: item.name,
//             quantity: item.quantity,
//             avg_price: item.avg_price,
//             price: item.price,
//             net: item.net,
//             day: item.day,
//             isLoss: item.isLoss,

//             mlSuggestion: item.mlSuggestion,
//             riskScore: item.riskScore,
//             performancePrediction: item.performancePrediction,
//             confidence: item.confidence,
//             autoRebalance: item.autoRebalance,
//             lastMLUpdate: item.lastMLUpdate,
//             mlVersion: item.mlVersion
//         });
//         newHolding.save();
//     });
//     res.send("done!");
// });

const { PositionsModel } = require("./models/PositionsModel");

//sending data (positions collection) added to atlas db:
// app.get("/addPositions", async (req, res) => {
//   let tempPositions = [
//     {
//       product: "CNC",
//       name: "EVEREADY",
//       quantity: 2,
//       avg_price: 316.27,
//       price: 308.65,
//       net: -7.84,
//       day: -7.84,
//       isLoss: true,

//       // ML fields populated
//       isAutomated: true, // This was an AI trade
//       exitStrategy: "Stop loss at 300 or target at 340",
//       stopLoss: 300.0,
//       targetPrice: 340.0,
//       mlTriggered: true,
//     },
//     {
//       product: "CNC",
//       name: "JUBLFOOD",
//       quantity: 1,
//       avg_price: 3124.75,
//       price: 3082.65,
//       net: 10.04,
//       day: -1.35,
//       isLoss: true,

//       // ML fields populated
//       isAutomated: true, // This was an AI trade
//       exitStrategy: "idk",
//       stopLoss: 3000.0,
//       targetPrice: 3400.0,
//       mlTriggered: true,
//     },
//   ];

//   tempPositions.forEach((item) => {
//     let newPosition = new PositionsModel({
//       product: item.product,
//       name: item.name,
//       quantity: item.quantity,
//       avg_price: item.avg_price,
//       price: item.price,
//       net: item.net,
//       day: item.day,
//       isLoss: item.isLoss,

//       // ML fields populated
//       isAutomated: item.isAutomated, // This was an AI trade
//       exitStrategy: item.exitStrategy,
//       stopLoss: item.stopLoss,
//       targetPrice: item.targetPrice,
//       mlTriggered: item.mlTriggered,
//       confidence: item.confidence,
//       openedAt: item.openedAt,
//       lastUpdated: item.lastUpdated,
//     });
//     newPosition.save();
//   });
//   res.send("done! positions");
// });

app.get("/allHoldings",async(req,res)=>{
    let allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
});

app.get("/allPositions",async(req,res)=>{
    let allPositions = await PositionsModel.find({});
    res.json(allPositions);
});

//to get new order:
const {OrdersModel}  = require('./models/OrdersModel');
app.post('/newOrder', async(req,res)=>{
    let newOrder = new OrdersModel({
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,
        action: req.body.action
    });
    // console.log(newOrder);
    await newOrder.save();
    const {name, quantity, price, action} = req.body;
    //find the holding
    const existingHolding = await HoldingsModel.findOne({name});
    if(action === "BUY")
    {
        //if holding already exists
        if(existingHolding)
        {
            const newQuantity = existingHolding.quantity + quantity;
            const newCost = (existingHolding.avg_price * existingHolding.quantity) + (price*quantity);
            const newAvg_price = newCost/newQuantity;

            existingHolding.quantity = newQuantity;
            existingHolding.avg_price = newAvg_price;
            existingHolding.price = price;
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
                isLoss:false
            });
            await newHolding.save();
        }
    }
    if(action=="SELL")
    {
        if(existingHolding){
            const newQuantity = existingHolding.quantity - quantity;
            if(newQuantity>0)
            {
                existingHolding.quantity = newQuantity;
                existingHolding.price = price;
                await existingHolding.save();
            }
            else
            {
                await HoldingsModel.deleteOne({name});
            }
        }
    }
    res.send("order saved");
});


app.get("/api/stocks/most-active",Stocks);

app.use("/", AuthRoute);

// to handle invalid requests:
// app.use("/",async(req,res)=>{
//     res.send("bad request");
// });

// app.listen(PORT, () => {
//   console.log("app is listening on port",PORT);
//   mongoose.connect(DB_URL)
//   .then(()=> console.log("connected to db") )
//   .catch((err)=>{
//     console.log("Failed to connect to database:",err);
//     process.exit(1);
//   });
// });

mongoose
  .connect(DB_URL)
  .then(() => console.log("DB is connected successfully"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});