# train_stock.py - BACK TO ORIGINAL SIMPLE APPROACH
import yfinance as yf
import pandas as pd
import numpy as np
import os, datetime, json, joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.utils import resample
from sklearn.metrics import accuracy_score, classification_report, balanced_accuracy_score
from ta.trend import SMAIndicator, MACD
from ta.momentum import RSIIndicator
from ta.volatility import BollingerBands, AverageTrueRange
import argparse

MODEL_DIR = "models"
os.makedirs(MODEL_DIR, exist_ok=True)


# Add at the top
from nsepython import nsefetch

def fetch_nse_data(symbol, years=5):
    """
    Fetch historical OHLCV data from NSE for the given symbol.
    Returns a DataFrame similar to yfinance format.
    """
    import pandas as pd
    import datetime

    end = datetime.datetime.today()
    start = end - datetime.timedelta(days=years*365)

    url = f"https://www.nseindia.com/api/quote-equity?symbol={symbol.replace('.NS','')}"
    
    try:
        data = nsefetch(url)  # returns dict with historical data
        # The API may need 'historical' endpoint:
        hist_url = f"https://www.nseindia.com/api/historical/cm/equity?symbol={symbol.replace('.NS','')}&series=[\"EQ\"]&from={start.strftime('%d-%m-%Y')}&to={end.strftime('%d-%m-%Y')}"
        hist = nsefetch(hist_url)
        df = pd.DataFrame(hist['data'])
        df.rename(columns={
            'CH_DATE': 'Date',
            'CH_OPENING_PRICE': 'Open',
            'CH_CLOSING_PRICE': 'Close',
            'CH_HIGH_PRICE': 'High',
            'CH_LOW_PRICE': 'Low',
            'CH_TOTTRDQTY': 'Volume'
        }, inplace=True)
        df['Date'] = pd.to_datetime(df['Date'], format='%d-%b-%Y')
        df.set_index('Date', inplace=True)
        df = df[['Open','High','Low','Close','Volume']].sort_index()
        df = df.apply(pd.to_numeric, errors='coerce')
        df.dropna(inplace=True)
        return df
    except Exception as e:
        print(f"⚠️ Failed to fetch NSE data for {symbol}: {e}")
        return None


def cleanup_old_models(symbol_prefix, keep_last=2):
    """Delete older model files"""
    files = [f for f in os.listdir(MODEL_DIR) if f.startswith(symbol_prefix)]
    model_files = sorted([f for f in files if f.endswith(".pkl") and "model" in f], reverse=True)
    scaler_files = sorted([f for f in files if f.endswith(".pkl") and "scaler" in f], reverse=True)
    meta_files = sorted([f for f in files if f.endswith(".json") and "meta" in f], reverse=True)

    def remove_old(file_list):
        for f in file_list[keep_last:]:
            try:
                os.remove(os.path.join(MODEL_DIR, f))
                print(f"🗑️ Deleted old file: {f}")
            except Exception as e:
                print(f"⚠️ Failed to delete {f}: {e}")

    remove_old(model_files)
    remove_old(scaler_files)
    remove_old(meta_files)

def engineer_features(df):
    """
    Simple feature engineering - back to basics
    """
    df = df.copy()

    # Flatten multi-level columns
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = [col[0] if isinstance(col, tuple) else col for col in df.columns]

    # Ensure numeric
    for col in ["Close", "Volume", "High", "Low"]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    # Create series
    close_series = pd.Series(df["Close"].values, index=df.index)
    high_series = pd.Series(df["High"].values, index=df.index)
    low_series = pd.Series(df["Low"].values, index=df.index)
    volume_series = pd.Series(df["Volume"].values, index=df.index)
    
    # Basic returns
    df["pct_change"] = df["Close"].pct_change()
    df["vol_pct_change"] = df["Volume"].pct_change()
    
    # Moving averages
    df["sma_5"] = SMAIndicator(close_series, window=5, fillna=False).sma_indicator()
    df["sma_10"] = SMAIndicator(close_series, window=10, fillna=False).sma_indicator()
    df["sma_20"] = SMAIndicator(close_series, window=20, fillna=False).sma_indicator()
    df["sma_50"] = SMAIndicator(close_series, window=50, fillna=False).sma_indicator()
    
    # RSI
    df["rsi_14"] = RSIIndicator(close_series, window=14, fillna=False).rsi()
    
    # MACD
    macd = MACD(close_series)
    df["macd_diff"] = macd.macd_diff()
    df["macd"] = macd.macd()
    df["macd_signal"] = macd.macd_signal()
    
    # Bollinger Bands
    bb = BollingerBands(close_series, window=20, window_dev=2)
    df["bb_high"] = bb.bollinger_hband()
    df["bb_low"] = bb.bollinger_lband()
    df["bb_width"] = (df["bb_high"] - df["bb_low"]).values
    
    # ATR
    atr = AverageTrueRange(high_series, low_series, close_series, window=14)
    df["atr"] = atr.average_true_range()
    
    # Momentum
    df["momentum_5"] = (close_series - close_series.shift(5)).values
    df["momentum_10"] = (close_series - close_series.shift(10)).values
    
    # Volume
    df["volume_sma"] = volume_series.rolling(window=20).mean().values
    df["volume_ratio"] = (volume_series / (df["volume_sma"] + 1e-10)).values
    
    # Price position
    df["high_low_range"] = (df["High"] - df["Low"]).values
    df["close_position"] = ((df["Close"] - df["Low"]) / (df["high_low_range"] + 1e-10)).values
    
    # ========================================
    # SIMPLE BINARY TARGET - DAILY PREDICTION
    # ========================================
    df["target"] = (df["Close"].shift(-1) > df["Close"]).astype(int)
    
    # Clean up
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    df.dropna(inplace=True)
    
    return df

def train_model(symbol="RELIANCE.NS", years=5):
    """
    Train simple binary classifier for daily predictions
    """
    print(f"\n{'='*60}")
    print(f"Training model for {symbol} ({years} years)")
    print(f"{'='*60}")
    
    # Download data
    end = datetime.datetime.today()
    start = end - datetime.timedelta(days=years * 365)

    # df = yf.download(symbol, start=start, end=end, progress=False)

    # Download data
    df = fetch_nse_data(symbol, years=years)

    # If insufficient, try shorter timeframe
    if df is None or len(df) < 100:
        print(f"Trying shorter timeframe for {symbol}")
        df = fetch_nse_data(symbol, years=2)

    if df is None or len(df) < 100:
        print(f"⚠️  Skipping {symbol}: Not enough data")
        return None

    # Flatten columns
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = [col[0] if isinstance(col, tuple) else col for col in df.columns]

    # If insufficient, try 2 years
    if len(df) < 100:
        print(f"Trying shorter timeframe for {symbol}")
        start = end - datetime.timedelta(days=2*365)
        df = yf.download(symbol, start=start, end=end)

    # If still insufficient, skip
    if len(df) < 100:
        print(f"⚠️  Skipping {symbol}: Not enough data")
        return None

    # Engineer features
    df = engineer_features(df)
    
    # Features list
    features = [
        "Close", "pct_change", "vol_pct_change",
        "sma_5", "sma_10", "sma_20", "sma_50",
        "rsi_14", "macd", "macd_diff", "macd_signal",
        "bb_high", "bb_low", "bb_width",
        "atr", "momentum_5", "momentum_10",
        "volume_ratio", "close_position"
    ]
    
    X = df[features]
    y = df["target"]
    
    if len(X) < 100:
        print(f"⚠️  Skipping {symbol}: not enough samples after feature engineering")
        return None
    
    # Class distribution
    print(f"\n📊 Target distribution:")
    print(y.value_counts())
    print(f"Class balance: {y.value_counts(normalize=True)}")
    
    # Train/test split (70/30)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, stratify=y, random_state=42
    )
    
    print(f"\n📈 Training samples: {len(X_train)}")
    print(f"📉 Testing samples: {len(X_test)}")
    
    # Rebalance training data
    train_df = pd.concat([X_train, y_train], axis=1)
    majority = train_df[train_df['target'] == 0]
    minority = train_df[train_df['target'] == 1]

    if len(minority) > 0:
        minority_upsampled = resample(
            minority,
            replace=True,
            n_samples=len(majority),
            random_state=42
        )
        balanced_df = pd.concat([majority, minority_upsampled])
        X_train = balanced_df.drop('target', axis=1)
        y_train = balanced_df['target']
        print(f"⚖️  Rebalanced training data")
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train RandomForest model
    print(f"\n🤖 Training RandomForest model...")
    model = RandomForestClassifier(
        n_estimators=200,
        class_weight='balanced',
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train_scaled, y_train)
    
    # Predictions
    y_pred = model.predict(X_test_scaled)
    
    # Evaluation
    acc = accuracy_score(y_test, y_pred)
    bal_acc = balanced_accuracy_score(y_test, y_pred)
    
    print(f"\n{'='*60}")
    print(f"📊 EVALUATION RESULTS")
    print(f"{'='*60}")
    print(f"Accuracy: {acc:.3f}")
    print(f"Balanced Accuracy: {bal_acc:.3f}")
    print(f"\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['DOWN', 'UP']))
    
    # Save artifacts
    ts = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    prefix = symbol.split(".")[0].upper()
    model_name = f"{prefix}_model_{ts}.pkl"
    scaler_name = f"{prefix}_scaler_{ts}.pkl"
    meta_name = f"{prefix}_meta_{ts}.json"

    joblib.dump(model, os.path.join(MODEL_DIR, model_name))
    joblib.dump(scaler, os.path.join(MODEL_DIR, scaler_name))
    
    meta = {
        "symbol": symbol,
        "trained_at": ts,
        "features": features,
        "accuracy": float(acc),
        "balanced_accuracy": float(bal_acc),
        "model_type": "RandomForest",
        "prediction_type": "binary_daily",
        "target": "next_day_direction",
        "model_file": model_name,
        "scaler_file": scaler_name
    }
    
    with open(os.path.join(MODEL_DIR, meta_name), "w") as f:
        json.dump(meta, f, indent=2)
    with open(os.path.join(MODEL_DIR, f"{prefix}_latest_meta.json"), "w") as f:
        json.dump(meta, f, indent=2)

    print(f"\n✅ Model saved: {model_name}")
    print(f"📁 Metadata saved: {meta_name}")
    
    cleanup_old_models(prefix, keep_last=2)
    
    return {
        "accuracy": acc,
        "balanced_accuracy": bal_acc,
        "symbol": symbol
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train stock prediction model")
    parser.add_argument("--symbol", type=str, required=True, help="Stock symbol (e.g., RELIANCE.NS)")
    parser.add_argument("--years", type=int, default=5, help="Years of historical data")
    args = parser.parse_args()
    
    result = train_model(args.symbol, args.years)
    
    if result:
        print(f"\n{'='*60}")
        print(f"✅ Training completed for {result['symbol']}")
        print(f"📊 Final Balanced Accuracy: {result['balanced_accuracy']:.1%}")
        print(f"{'='*60}")

