
# app.py - SIMPLE BINARY PREDICTIONS WITH SENTIMENT

print("STEP 1: imports starting")
from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
import joblib
import json
import os
import pandas as pd
import yfinance as yf
from typing import Optional
import datetime
from train_stock import engineer_features, train_model
from news_Sentiment import get_company_sentiment

print("STEP 2: imports finished")
app = FastAPI(title="EquityFlow ML Service")
print("STEP 3: creating FastAPI app")
MODEL_DIR = "models"

# Simple thresholds
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", 0.55))  # 55% confidence
SENTIMENT_WEIGHT = float(os.getenv("SENTIMENT_WEIGHT", 0.20))  # 20% weight for sentiment

class PredictRequest(BaseModel):
    symbol: str
    include_sentiment: Optional[bool] = True

def load_latest_artifacts(symbol: str):
    """Load most recent model artifacts"""
    print("STEP 5: loading models")
    prefix = symbol.split(".")[0].upper()
    metas = [f for f in os.listdir(MODEL_DIR) 
             if f.endswith(".json") and prefix in f.upper() and "latest" not in f]
    
    if not metas:
        raise HTTPException(
            status_code=404, 
            detail=f"No trained model found for {symbol}. Train the model first."
        )
    
    metas.sort(reverse=True)
    meta_file = metas[0]
    
    with open(os.path.join(MODEL_DIR, meta_file)) as f:
        meta = json.load(f)
    
    model = joblib.load(os.path.join(MODEL_DIR, meta["model_file"]))
    scaler = joblib.load(os.path.join(MODEL_DIR, meta["scaler_file"]))
    
    return {"model": model, "scaler": scaler, "meta": meta}

def is_model_stale(meta, days_threshold=7):
    """Check if model needs retraining"""
    try:
        trained = datetime.datetime.strptime(meta["trained_at"], "%Y%m%dT%H%M%SZ").replace(tzinfo=datetime.timezone.utc)
        now = datetime.datetime.now(datetime.timezone.utc)
        age = (now - trained).days
        return age > days_threshold
    except Exception as e:
        print(f"  Error checking staleness: {e}")
        return False

@app.post("/predict")
def predict(payload: PredictRequest, background_tasks: BackgroundTasks):
    """
    Simple binary prediction: Will stock go UP or DOWN tomorrow?
    """
    symbol = payload.symbol.upper()
    
    # Load model
    try:
        artifacts = load_latest_artifacts(symbol)
    except HTTPException:
        print(f" No model for {symbol}. Training now...")
        try:
            train_model(symbol, years=5)
            artifacts = load_latest_artifacts(symbol)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to train model: {str(e)}")
    
    model, scaler, meta = artifacts["model"], artifacts["scaler"], artifacts["meta"]
    
    # Check staleness
    if is_model_stale(meta):
        print(f"  Model is stale, scheduling retraining...")
        background_tasks.add_task(train_model, symbol)
    
    # Fetch recent data
    end = datetime.datetime.today()
    start = end - datetime.timedelta(days=120)
    df = yf.download(symbol, start=start, end=end, progress=False, auto_adjust=False)
    
    if df.empty:
        raise HTTPException(status_code=400, detail=f"No recent data for {symbol}")
    
    # Engineer features
    df = engineer_features(df)
    
    if df.empty:
        raise HTTPException(status_code=400, detail=f"Insufficient data after feature engineering")
    
    # Get latest data point
    latest = df.iloc[-1:]
    features = meta["features"]
    X = latest[features]
    X_scaled = scaler.transform(X)
    
    # ========================================
    # PRICE PREDICTION (From Model - No Sentiment)
    # ========================================
    pred_proba = model.predict_proba(X_scaled)[0]
    prob_up = float(pred_proba[1])  # Probability of price going UP
    prob_down = float(pred_proba[0])  # Probability of price going DOWN
    
    price_signal = "UP" if prob_up > 0.5 else "DOWN"
    price_confidence = max(prob_up, prob_down)
    

    # SENTIMENT ANALYSIS (Separate from Model)
  
    sentiment_value = 0.0
    sentiment_articles = []
    sentiment_adjustment = 0.0
    
    if payload.include_sentiment:
        try:
            sentiment_value, sentiment_articles = get_company_sentiment(
                symbol=symbol, provider="NEWSAPI", days=2
            )
            # Adjust confidence based on sentiment
            sentiment_adjustment = sentiment_value * SENTIMENT_WEIGHT
            print(f"📰 Sentiment: {sentiment_value:.3f}, Adjustment: {sentiment_adjustment:+.3f}")
        except Exception as e:
            print(f"⚠️  Sentiment analysis failed: {e}")
    
    # ========================================
    # COMBINE: Price Model + Sentiment
    # ========================================
    adjusted_confidence = min(1.0, max(0.0, price_confidence + sentiment_adjustment))
    
    # Determine final action
    if price_signal == "UP" and adjusted_confidence >= CONFIDENCE_THRESHOLD:
        action = "BUY"
        position_size = int((adjusted_confidence - CONFIDENCE_THRESHOLD) / (1 - CONFIDENCE_THRESHOLD) * 25)  # 0-25%
        position_size = max(5, min(25, position_size))  # Between 5-25%
    elif price_signal == "DOWN" and adjusted_confidence >= CONFIDENCE_THRESHOLD:
        action = "SELL"
        position_size = 100  # Sell full position
    else:
        action = "HOLD"
        position_size = 0
    
    # Build response
    response = {
        "symbol": symbol,
        "timestamp": datetime.datetime.now(datetime.UTC).isoformat(),
        
        # Core prediction (from model)
        "price_prediction": {
            "signal": price_signal,
            "probability_up": round(prob_up, 3),
            "probability_down": round(prob_down, 3),
            "confidence": round(price_confidence, 3)
        },
        
        # Sentiment boost
        "sentiment": {
            "score": round(sentiment_value, 3),
            "adjustment": round(sentiment_adjustment, 3),
            "sample_headlines": [
                {
                    "text": a["text"][:80] + "...",
                    "sentiment": a["label"],
                    "confidence": round(a["score"], 2)
                }
                for a in sentiment_articles[:3]
            ] if sentiment_articles else []
        },
        
        # Final decision
        "recommendation": {
            "action": action,
            "final_confidence": round(adjusted_confidence, 3),
            "position_size_percent": position_size,
            "reasoning": f"{price_signal} signal from model ({price_confidence:.1%}) " + 
                        (f"boosted by {sentiment_adjustment:+.1%} sentiment" if sentiment_adjustment != 0 else ""),
            "meets_threshold": adjusted_confidence >= CONFIDENCE_THRESHOLD
        },
        
        # Model info
        "model_info": {
            "trained_at": meta["trained_at"],
            "model_type": meta.get("model_type", "RandomForest"),
            "balanced_accuracy": round(meta.get("balanced_accuracy", 0), 3),
            "prediction_type": "binary_daily",
            "is_stale": is_model_stale(meta)
        }
    }
    
    return response

@app.post("/retrain_all")
def retrain_all(background_tasks: BackgroundTasks):
    """Retrain all Nifty 50 models"""
    def run_script():
        os.system("python train_all_nifty50.py")
    
    background_tasks.add_task(run_script)
    return {"message": "Started retraining all Nifty50 models in background"}

@app.get("/")
def home():
    return {
        "message": "EquityFlow ML API - Simple Binary Predictions",
        "version": "1.0",
        "approach": "Price Model (Technical) + Sentiment Analysis (News)",
        "features": [
            "Daily binary predictions (UP/DOWN)",
            "RandomForest with 19 technical features",
            "FinBERT sentiment analysis",
            "Confidence-based position sizing",
            "Automatic model retraining"
        ],
        "config": {
            "confidence_threshold": CONFIDENCE_THRESHOLD,
            "sentiment_weight": SENTIMENT_WEIGHT
        }
    }

@app.get("/health")
def health_check():
    """System health check"""
    models = [f for f in os.listdir(MODEL_DIR) if f.endswith("_latest_meta.json")]
    return {
        "status": "healthy",
        "models_trained": len(models),
        "model_directory": MODEL_DIR
    }