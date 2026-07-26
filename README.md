# EquityFlow - ML-Powered Stock Investment Platform

An intelligent stock investment platform that combines traditional investing with machine learning-assisted investing. Users can invest manually or choose to let the platform automatically invest a user-defined portion of their available balance, capped at **30%**, using machine learning price prediction and financial sentiment analysis.

The platform follows a microservice architecture consisting of two React applications, a Node.js/Express backend, a Python FastAPI ML microservice, and MongoDB.

---

## Features

- User authentication and authorization
- Manual stock investing
- ML-assisted automated investing
- User-configurable automated investment allocation (up to 30%)
- Portfolio dashboard
- Watchlist management
- Transaction history
- Live market data
- Automated model retraining using Cron jobs
- RESTful API architecture

---

## ML-Assisted Investing

Users decide how much of their available balance should participate in automated investing, with a maximum allocation of **30%**.

Investment confidence is calculated by combining:

- Random Forest price prediction trained on historical market data
- FinBERT financial news sentiment analysis
- Weighted confidence scoring

The generated confidence score is stored in MongoDB and used by the backend while executing the user's selected automated investment strategy.

---

## Machine Learning Pipeline

The FastAPI ML microservice is responsible for:

- Fetching historical stock market data
- Feature engineering
- Training Random Forest models
- Performing FinBERT sentiment analysis on financial news
- Combining prediction and sentiment scores
- Saving confidence scores to MongoDB
- Periodic model retraining using Cron jobs

---

## System Architecture

```text
               +----------------------+
               |    React Website     |
               | Login & Landing Page |
               +----------+-----------+
                          |
                          |
               +----------v-----------+
               |   Express Backend    |
               |      REST API        |
               +----------+-----------+
                          |
          +---------------+---------------+
          |                               |
          |                               |
+---------v---------+          +----------v----------+
|     MongoDB       |          | FastAPI ML Service  |
| Users             |          | Random Forest       |
| Portfolio         |          | FinBERT             |
| Transactions      |          | Cron Jobs           |
| Confidence Scores |          +----------+----------+
+-------------------+                     |
                                          |
                               Updates Confidence Scores
```

---

## Project Structure

```text
EquityFlow
│
├── backend/        # Express REST API
├── frontend/       # Public website
├── dashboard/      # Investment dashboard
├── ml-service/     # FastAPI ML microservice
└── README.md
```

---

## Backend

Built using **Node.js** and **Express.js**.

Responsibilities include:

- User authentication
- Portfolio management
- Investment execution
- Watchlist management
- Transaction management
- REST API development
- Database operations
- Communication with the ML microservice

---

## Frontend

### Website

The public-facing React application.

Features:

- User registration
- Login
- Landing page
- Platform information
- User onboarding

### Dashboard

A dedicated React application for authenticated users.

Features:

- Portfolio overview
- Holdings
- Manual investing
- Automated investment settings
- Watchlist
- Investment performance
- Transaction history

---

## ML Microservice

Built with **Python** using **FastAPI**.

Responsibilities include:

- Historical market data collection
- Feature engineering
- Random Forest model training
- FinBERT sentiment analysis
- Confidence score generation
- Scheduled model retraining
- MongoDB updates

---

## Tech Stack

### Frontend

- React
- React Router
- Axios
- Chart.js

### Backend

- Node.js
- Express.js
- JWT Authentication
- MongoDB
- Mongoose

### ML Microservice

- Python
- FastAPI
- Scikit-learn
- Random Forest Classifier
- FinBERT
- Pandas
- NumPy

### Database

- MongoDB

---

## Investment Workflow

```text
                    User
                      |
        +-------------+-------------+
        |                           |
        |                           |
Manual Investment      Automated Investment
                           (0% - 30%)
        |                           |
        +-------------+-------------+
                      |
                      v
              Express Backend
                      |
                      v
            FastAPI ML Service
          +-----------+-----------+
          |                       |
          |                       |
          v                       v
  Random Forest Model     FinBERT Sentiment
          |                       |
          +-----------+-----------+
                      |
                      v
        Combined Confidence Score
                      |
                      v
                   MongoDB
                      |
                      v
              Express Backend
                      |
                      v
           Investment Execution
```

---

## Installation

Clone the repository.

```bash
git clone <repository-url>
```

### Backend

```bash
cd backend
npm install
npm start
```

### Website

```bash
cd frontend
npm install
npm run dev
```

### Dashboard

```bash
cd dashboard
npm install
npm run dev
```

### ML Microservice

```bash
cd ml-service
pip install -r requirements.txt
python main.py
```

---

## Future Improvements

- Real-time market updates using WebSockets
- Additional ML models (XGBoost, LSTM)
- Explainable ML predictions
- Portfolio risk optimisation
- Paper trading mode
- Multi-market support
- Docker deployment
- CI/CD pipeline
- Cloud deployment
- Notification system

---

## License

This project is intended for educational and portfolio purposes.
