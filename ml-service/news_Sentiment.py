# news_sentiment.py - IMPROVED VERSION
from dotenv import load_dotenv
load_dotenv()
import os
import time
import requests
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from datetime import datetime, timedelta
from functools import lru_cache
import hashlib

# Choose a FinBERT model from Hugging Face
FINBERT_MODEL = os.getenv("FINBERT_MODEL", "yiyanghkust/finbert-tone")
NEWS_PROVIDER = os.getenv("NEWS_PROVIDER", "NEWSAPI")
FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY", "")
NEWSAPI_KEY = os.getenv("NEWSAPI_KEY", "")

# load pipeline (cached in-memory)
@lru_cache(maxsize=1)
def get_finbert_pipeline(model_name=FINBERT_MODEL):
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name)
    return pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)

def deduplicate_headlines(headlines):
    """
    Remove duplicate/similar headlines using text hashing.
    Keeps the most recent version of similar articles.
    """
    seen_hashes = set()
    unique_headlines = []
    
    for h in headlines:
        # Create hash of first 100 characters (ignore minor differences)
        text = h["text"][:100].lower().strip()
        text_hash = hashlib.md5(text.encode()).hexdigest()
        
        if text_hash not in seen_hashes:
            seen_hashes.add(text_hash)
            unique_headlines.append(h)
    
    print(f"📊 Deduplication: {len(headlines)} → {len(unique_headlines)} unique articles")
    return unique_headlines

def fetch_finnhub_company_news(symbol="RELIANCE.NS", days=2):
    end = datetime.utcnow().date()
    start = end - timedelta(days=days)
    
    # Remove .NS suffix for Finnhub
    base_symbol = symbol.replace(".NS", "").replace(".BO", "")
    
    url = f"https://finnhub.io/api/v1/company-news?symbol={base_symbol}&from={start}&to={end}&token={FINNHUB_API_KEY}"
    
    try:
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        print(f"⚠️ Finnhub API error: {e}")
        return []

def fetch_newsapi_headlines(query="Reliance", days=2, page_size=50):  # Increased to 50
    end = datetime.utcnow().date()
    start = (end - timedelta(days=days)).isoformat()
    
    # Better query: search in title and include stock market context
    enhanced_query = f'"{query}" AND (stock OR share OR market OR trading)'
    
    url = f"https://newsapi.org/v2/everything?q={enhanced_query}&from={start}&sortBy=publishedAt&pageSize={page_size}&language=en&apiKey={NEWSAPI_KEY}"
    
    try:
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        items = resp.json().get("articles", [])
        return items
    except Exception as e:
        print(f"⚠️ NewsAPI error: {e}")
        return []

def score_headlines_with_finbert(headlines):
    """
    Score headlines with FinBERT sentiment model.
    Handles empty headlines gracefully.
    """
    if not headlines:
        return []
    
    nlp = get_finbert_pipeline()
    results = []
    batch_size = 8
    
    for i in range(0, len(headlines), batch_size):
        batch = headlines[i:i+batch_size]
        # Filter out empty texts
        texts = [h["text"] for h in batch if h["text"].strip()]
        
        if not texts:
            continue
        
        try:
            preds = nlp(texts, truncation=True, max_length=256)
            
            for h, p in zip(batch, preds):
                results.append({
                    "text": h["text"][:200],  # Truncate for readability
                    "label": p["label"],
                    "score": float(p["score"]),
                    "datetime": h.get("datetime") or h.get("publishedAt")
                })
        except Exception as e:
            print(f"⚠️ FinBERT scoring error: {e}")
            continue
    
    return results

def map_label_to_numeric(label, score):
    """Map sentiment labels to numeric values with confidence."""
    lab = label.lower()
    if "pos" in lab or "positive" in lab:
        return 1 * score
    if "neg" in lab or "negative" in lab:
        return -1 * score
    # neutral or other
    return 0.0

def aggregate_sentiment(scored_articles, decay_seconds=48*3600):
    """
    Returns aggregated sentiment in range [-1, +1].
    Uses recency weighting: more recent => higher weight.
    """
    if not scored_articles:
        return 0.0
    
    total_w = 0.0
    total_s = 0.0
    now_ts = time.time()
    
    for item in scored_articles:
        ts = item.get("datetime")
        
        # Parse datetime to timestamp
        try:
            if isinstance(ts, str):
                ts_val = datetime.fromisoformat(ts.replace("Z", "+00:00")).timestamp()
            else:
                ts_val = float(ts)
        except Exception:
            ts_val = now_ts
        
        age = max(0.0, now_ts - ts_val)
        
        # Recency weight: exponential decay
        import math
        weight = math.exp(-age / decay_seconds)
        
        numeric = map_label_to_numeric(item["label"], item["score"])
        total_w += weight
        total_s += weight * numeric
    
    if total_w == 0:
        return 0.0
    
    agg = total_s / total_w
    return max(-1.0, min(1.0, agg))

def get_company_sentiment(symbol="RELIANCE.NS", provider="NEWSAPI", days=2):
    """
    Get aggregated sentiment for a company.
    Returns (sentiment_score, scored_articles)
    """
    headlines = []
    base_name = symbol.split(".")[0]  # e.g., "RELIANCE"
    
    # Company name mapping for better search
    company_names = {
        "RELIANCE": "Reliance Industries",
        "TCS": "Tata Consultancy Services",
        "INFY": "Infosys",
        "HDFCBANK": "HDFC Bank",
        "ICICIBANK": "ICICI Bank",
        "SBIN": "State Bank India",
        "BHARTIARTL": "Bharti Airtel",
        "ITC": "ITC Limited",
        "WIPRO": "Wipro",
        "HINDUNILVR": "Hindustan Unilever"
        # Add more as needed
    }
    
    # Use full company name if available, otherwise use symbol
    search_query = company_names.get(base_name, base_name)
    
    print(f"📰 Fetching sentiment for {search_query}...")
    
    # Try NewsAPI first
    if NEWSAPI_KEY:
        raw = fetch_newsapi_headlines(search_query, days=days, page_size=50)
        for r in raw:
            title = r.get("title", "")
            description = r.get("description") or ""
            text = f"{title}. {description}".strip()
            
            # Filter out empty or very short texts
            if len(text) > 20:
                headlines.append({
                    "text": text,
                    "datetime": r.get("publishedAt")
                })
    
    # Fallback to Finnhub if NewsAPI fails
    elif FINNHUB_API_KEY:
        print(f"📰 Trying Finnhub for {base_name}...")
        raw = fetch_finnhub_company_news(symbol, days=days)
        for r in raw:
            text = r.get("headline") or r.get("summary", "")
            if len(text) > 20:
                headlines.append({
                    "text": text,
                    "datetime": r.get("datetime")
                })
    else:
        print("⚠️ No API keys configured!")
        return 0.0, []
    
    if not headlines:
        print(f"⚠️ No news found for {symbol}")
        return 0.0, []
    
    # DEDUPLICATE before scoring
    headlines = deduplicate_headlines(headlines)
    
    # Score with FinBERT
    scored = score_headlines_with_finbert(headlines)
    
    if not scored:
        print(f"⚠️ No articles scored successfully")
        return 0.0, []
    
    # Aggregate sentiment
    agg = aggregate_sentiment(scored)
    
    print(f"✅ Sentiment: {agg:.3f} from {len(scored)} articles")
    
    return agg, scored