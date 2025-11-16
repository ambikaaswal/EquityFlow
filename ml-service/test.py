import yfinance as yf

# The long historical fetch (used in retrain)
df1 = yf.download("ADANIPORTS.NS", period="5y")
print(df1.tail(2))

# The short recent fetch (used in predict/update)
df2 = yf.download("ADANIPORTS.NS", period="5d")
print(df2.tail(2))
