# # train_all_nifty50.py
# import os
# import time
# import subprocess

# # --- NIFTY 50 stock tickers (NSE Yahoo Finance symbols) ---
# NIFTY50_TICKERS = [
#     "RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "ICICIBANK.NS",
#     "HINDUNILVR.NS", "ITC.NS", "KOTAKBANK.NS", "LT.NS", "SBIN.NS",
#     "BHARTIARTL.NS", "ASIANPAINT.NS", "MARUTI.NS", "SUNPHARMA.NS",
#     "AXISBANK.NS", "BAJFINANCE.NS", "HCLTECH.NS", "TITAN.NS", "ULTRACEMCO.NS", "NTPC.NS",
#     "POWERGRID.NS", "ONGC.NS", "ADANIENT.NS", "ADANIPORTS.NS", "BAJAJFINSV.NS",
#     "NESTLEIND.NS", "TECHM.NS", "WIPRO.NS", "COALINDIA.NS", "GRASIM.NS",
#     "JSWSTEEL.NS", "TATASTEEL.NS", "CIPLA.NS", "HDFCLIFE.NS", "SBILIFE.NS",
#     "EICHERMOT.NS", "DRREDDY.NS", "BRITANNIA.NS", "BAJAJ-AUTO.NS", "M&M.NS",
#     "DIVISLAB.NS", "HEROMOTOCO.NS", "HINDALCO.NS", "BPCL.NS", "TATAMOTORS.NS",
#     "TATACONSUM.NS", "APOLLOHOSP.NS", "INDUSINDBK.NS", "UPL.NS", "SHRIRAMFIN.NS",
#     "TRENT.NS"
# ]

# # --- Loop and train each model sequentially ---
# for symbol in NIFTY50_TICKERS:
#     print(f"\nTraining model for {symbol} ...")
#     try:
#         subprocess.run(
#             ["python", "train_stock.py", "--symbol", symbol],
#             check=True
#         )
#         print(f"Finished training {symbol}")
#     except subprocess.CalledProcessError as e:
#         print(f"Error training {symbol}: {e}")
#     time.sleep(2)  # avoid hammering Yahoo Finance API

# print("\n All training runs completed! Check your 'models/' folder.")


# train_all_nifty50.py
import os
import time
import subprocess
from nsepython import nsefetch

def get_nifty50_symbols():
    """Dynamically fetch current Nifty 50 stock symbols from NSE"""
    url = "https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050"
    try:
        data = nsefetch(url)
        # Filter out the index itself and get only stock symbols
        symbols = [
            entry["symbol"] + ".NS" 
            for entry in data["data"] 
            if entry["symbol"] != "NIFTY 50"
        ]
        return symbols
    except Exception as e:
        print(f"Error fetching Nifty 50 symbols: {e}")
        print("Falling back to hardcoded list...")
        # Fallback to hardcoded list if API fails
        return [
            "RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "ICICIBANK.NS",
            "HINDUNILVR.NS", "ITC.NS", "KOTAKBANK.NS", "LT.NS", "SBIN.NS",
            "BHARTIARTL.NS", "ASIANPAINT.NS", "MARUTI.NS", "SUNPHARMA.NS",
            "AXISBANK.NS", "BAJFINANCE.NS", "HCLTECH.NS", "TITAN.NS", "ULTRACEMCO.NS", "NTPC.NS",
            "POWERGRID.NS", "ONGC.NS", "ADANIENT.NS", "ADANIPORTS.NS", "BAJAJFINSV.NS",
            "NESTLEIND.NS", "TECHM.NS", "WIPRO.NS", "COALINDIA.NS", "GRASIM.NS",
            "JSWSTEEL.NS", "TATASTEEL.NS", "CIPLA.NS", "HDFCLIFE.NS", "SBILIFE.NS",
            "EICHERMOT.NS", "DRREDDY.NS", "BRITANNIA.NS", "BAJAJ-AUTO.NS", "M&M.NS",
            "DIVISLAB.NS", "HEROMOTOCO.NS", "HINDALCO.NS", "BPCL.NS", "TATAMOTORS.NS",
            "TATACONSUM.NS", "APOLLOHOSP.NS", "INDUSINDBK.NS", "UPL.NS", "SHRIRAMFIN.NS",
            "TRENT.NS"
        ]

# --- Fetch Nifty 50 tickers dynamically ---
print("🔍 Fetching current Nifty 50 stocks from NSE...")
NIFTY50_TICKERS = get_nifty50_symbols()
print(f"Found {len(NIFTY50_TICKERS)} Nifty 50 stocks\n")
print("Stocks to train:", NIFTY50_TICKERS)

# --- Loop and train each model sequentially ---
for i, symbol in enumerate(NIFTY50_TICKERS, 1):
    print(f"\n[{i}/{len(NIFTY50_TICKERS)}] Training model for {symbol} ...")
    try:
        subprocess.run(
            ["python", "train_stock.py", "--symbol", symbol],
            check=True
        )
        print(f"Finished training {symbol}")
    except subprocess.CalledProcessError as e:
        print(f" Error training {symbol}: {e}")
    time.sleep(2)  # avoid hammering Yahoo Finance API

print("\n🎉 All training runs completed! Check your 'models/' folder.")