# CryptoX — Frontend

React frontend for the CryptoX crypto trading platform. Built with Vite, Redux Toolkit, Tailwind CSS v4, and Recharts, featuring a dark glassmorphism theme with a gamified landing page.

Backend repo: https://github.com/PriyaMhapralkar/cryptox-trading-platform

## Tech Stack
- React 19 (Vite)
- Redux Toolkit + React Redux
- React Router DOM
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Recharts (price charts, admin analytics)
- Axios

## Features
- Auth flows: login (with 2FA OTP step), register, forgot password
- Home dashboard: live market table (All/Top 50/Gainers/Losers), pagination, coin search
- Coin details: price chart (1D/1W/1M), buy/sell trade panel, watchlist, live news + AI-generated price-movement insight
- Wallet: balance, Razorpay top-up, peer transfer, withdrawal requests
- Portfolio, watchlist, trading activity, payment details, withdrawal history, profile with 2FA toggle
- Floating AI chatbot (visible only when logged in)
- Role-based admin dashboard: overview stats, user management, withdrawal approvals, transactions, wallet monitoring, activity logs
- Gamified landing page with a live "Bull or Bear" price-prediction mini-game using real BTC data
- Protected routing with automatic logout on expired/invalid sessions

## Setup

### Prerequisites
- Node.js 18+
- The backend running locally on `http://localhost:8080` (see backend README)

### Environment Variables
Create a `.env` file in the project root: