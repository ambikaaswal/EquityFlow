// EquityFlow - Hardcoded Data with ML-Ready Schema
// Phase 1: Use basic fields, Phase 2: Populate ML fields

// WATCHLIST DATA
export const watchlist = [
  {
    name: "INFY",
    price: 1555.45,
    percent: "-1.60%",
    isDown: true,
  },
  {
    name: "ONGC",
    price: 116.8,
    percent: "-0.09%",
    isDown: true,
  },
  {
    name: "TCS",
    price: 3194.8,
    percent: "-0.25%",
    isDown: true,
  },
  {
    name: "KPITTECH",
    price: 266.45,
    percent: "3.54%",
    isDown: false,
  },
  {
    name: "QUICKHEAL",
    price: 308.55,
    percent: "-0.15%",
    isDown: true,
  },
  {
    name: "WIPRO",
    price: 577.75,
    percent: "0.32%",
    isDown: false,
  },
  {
    name: "M&M",
    price: 779.8,
    percent: "-0.01%",
    isDown: true,
  },
  {
    name: "RELIANCE",
    price: 2112.4,
    percent: "1.44%",
    isDown: false,
  },
  {
    name: "HUL",
    price: 512.4,
    percent: "1.04%",
    isDown: false,
  },
];

// HOLDINGS DATA
export const holdings = [
  {
    name: "BHARTIARTL",
    qty: 2,
    avg: 538.05,
    price: 541.15,
    net: 0.58,
    day: 2.99,
  },
  {
    name: "HDFCBANK",
    qty: 2,
    avg: 1383.4,
    price: 1522.35,
    net: 10.04,
    day: 0.11,
  },
  {
    name: "HINDUNILVR",
    qty: 1,
    avg: 2335.85,
    price: 2417.4,
    net: 3.49,
    day: 0.21,
  },
  {
    name: "INFY",
    qty: 1,
    avg: 1350.5,
    price: 1555.45,
    net: 15.18,
    day: -1.60,
    isLoss: true,
  },
  {
    name: "ITC",
    qty: 5,
    avg: 202.0,
    price: 207.9,
    net: 2.92,
    day: 0.80,
  },
  {
    name: "KPITTECH",
    qty: 5,
    avg: 250.3,
    price: 266.45,
    net: 6.45,
    day: 3.54,
  },
  {
    name: "M&M",
    qty: 2,
    avg: 809.9,
    price: 779.8,
    net: -3.72,
    day: -0.01,
    isLoss: true,
  },
  {
    name: "RELIANCE",
    qty: 1,
    avg: 2193.7,
    price: 2112.4,
    net: -3.71,
    day: 1.44,
  },
  {
    name: "SBIN",
    qty: 4,
    avg: 324.35,
    price: 430.2,
    net: 32.63,
    day: -0.34,
    isLoss: true,
  },
  {
    name: "SGBMAY29",
    qty: 2,
    avg: 4727.0,
    price: 4719.0,
    net: -0.17,
    day: 0.15,
  },
  {
    name: "TATAPOWER",
    qty: 5,
    avg: 104.2,
    price: 124.15,
    net: 19.15,
    day: -0.24,
    isLoss: true,
  },
  {
    name: "TCS",
    qty: 1,
    avg: 3041.7,
    price: 3194.8,
    net: 5.03,
    day: -0.25,
    isLoss: true,
  },
  {
    name: "WIPRO",
    qty: 4,
    avg: 489.3,
    price: 577.75,
    net: 18.08,
    day: 0.32,
  },
];

// POSITIONS DATA
export const positions = [
  {
    product: "CNC",
    name: "EVEREADY",
    qty: 2,
    avg: 316.27,
    price: 312.35,
    net: "+0.58%",
    day: "-1.24%",
    isLoss: true,
  },
  {
    product: "CNC",
    name: "JUBLFOOD",
    qty: 1,
    avg: 3124.75,
    price: 3082.65,
    net: "+10.04%",
    day: "-1.35%",
    isLoss: true,
  },
];

// EXAMPLE: How data looks when ML features are added later
export const watchlistWithML = [
  {
    name: "INFY",
    price: 1555.45,
    percent: -1.60,
    isDown: true,
    
    // ML fields populated in Phase 2
    mlRecommendation: "BUY",
    confidence: 0.78,
    predictedPrice: 1620.00,
    aiReason: "Technical indicators show oversold conditions",
    autoTradeEnabled: true
  },
  {
    name: "RELIANCE",
    price: 2112.4,
    percent: 1.44,
    isDown: false,
    
    mlRecommendation: "HOLD",
    confidence: 0.65,
    predictedPrice: 2150.00,
    aiReason: "Moderate bullish sentiment with energy sector growth",
    autoTradeEnabled: false
  },
];

export const holdingsWithML = [
  {
    name: "BHARTIARTL",
    quantity: 2,
    avg_price: 538.05,
    price: 541.15,
    net: 6.20,
    day: 32.40,
    isLoss: false,

    mlSuggestion: null,
    riskScore: null,
    performancePrediction: null,
    autoRebalance: false
  },
  {
    name: "HDFCBANK",
    quantity: 2,
    avg_price: 1383.4,
    price: 1522.35,
    net: 277.90,
    day: 3.05,
    isLoss: false,

    mlSuggestion: null,
    riskScore: null,
    performancePrediction: null,
    autoRebalance: false
  },
  {
    name: "HINDUNILVR",
    quantity: 1,
    avg_price: 2335.85,
    price: 2417.4,
    net: 81.55,
    day: 5.08,
    isLoss: false,

    mlSuggestion: null,
    riskScore: null,
    performancePrediction: null,
    autoRebalance: false
  },
  {
    name: "INFY",
    quantity: 1,
    avg_price: 1350.5,
    price: 1555.45,
    net: 204.95,
    day: -25.20,
    isLoss: true,

    mlSuggestion: null,
    riskScore: null,
    performancePrediction: null,
    autoRebalance: false
  },
  {
    name: "ITC",
    quantity: 5,
    avg_price: 202.0,
    price: 207.9,
    net: 29.50,
    day: 8.32,
    isLoss: false,

    mlSuggestion: null,
    riskScore: null,
    performancePrediction: null,
    autoRebalance: false
  },
  {
    name: "KPITTECH",
    quantity: 5,
    avg_price: 250.3,
    price: 266.45,
    net: 80.75,
    day: 44.36,
    isLoss: false,

    mlSuggestion: null,
    riskScore: null,
    performancePrediction: null,
    autoRebalance: false
  },
  {
    name: "M&M",
    quantity: 2,
    avg_price: 809.9,
    price: 779.8,
    net: -60.20,
    day: -0.16,
    isLoss: true,

    mlSuggestion: null,
    riskScore: null,
    performancePrediction: null,
    autoRebalance: false
  },
  {
    name: "RELIANCE",
    quantity: 1,
    avg_price: 2193.7,
    price: 2112.4,
    net: -81.30,
    day: 30.42,
    isLoss: false,

    mlSuggestion: null,
    riskScore: null,
    performancePrediction: null,
    autoRebalance: false
  },
  {
    name: "SBIN",
    quantity: 4,
    avg_price: 324.35,
    price: 430.2,
    net: 423.40,
    day: -5.86,
    isLoss: true,

    mlSuggestion: null,
    riskScore: null,
    performancePrediction: null,
    autoRebalance: false
  },
  {
    name: "SGBMAY29",
    quantity: 2,
    avg_price: 4727.0,
    price: 4719.0,
    net: -16.00,
    day: 14.22,
    isLoss: false,

    mlSuggestion: null,
    riskScore: null,
    performancePrediction: null,
    autoRebalance: false
  },
  {
    name: "TATAPOWER",
    quantity: 5,
    avg_price: 104.2,
    price: 124.15,
    net: 99.75,
    day: -1.49,
    isLoss: true,

    mlSuggestion: null,
    riskScore: null,
    performancePrediction: null,
    autoRebalance: false
  },
  {
    name: "TCS",
    quantity: 1,
    avg_price: 3041.7,
    price: 3194.8,
    net: 153.10,
    day: -8.04,
    isLoss: true,

    mlSuggestion: null,
    riskScore: null,
    performancePrediction: null,
    autoRebalance: false
  },
  {
    name: "WIPRO",
    quantity: 4,
    avg_price: 489.3,
    price: 577.75,
    net: 353.80,
    day: 7.40,
    isLoss: false,

    mlSuggestion: null,
    riskScore: null,
    performancePrediction: null,
    autoRebalance: false
  }
];

export const positionsWithML = [
  {
    product: "CNC",
    name: "EVEREADY",
    qty: 2,
    avg_price: 316.27,
    net: -7.84,
    day: -7.84,
    isLoss: true,
    
    // ML fields populated
    isAutomated: true, // This was an AI trade
    exitStrategy: "Stop loss at 300 or target at 340",
    stopLoss: 300.00,
    targetPrice: 340.00,
    mlTriggered: true
  }
];