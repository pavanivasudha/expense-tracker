Expense Tracker
A minimal full-stack Expense Tracker that allows users to record, view, filter, and summarize personal expenses.
Built with Vue 3 and Node.js, focusing on correctness, reliability, and real-world usage.

Features
Add expenses (amount, category, description, date)
View all expenses
Filter by category
Sort by date (newest first)
Display total of visible expenses
Retry-safe API (prevents duplicate entries)
Refresh-safe persistence

Tech Stack
Frontend: Vue 3 + Vite
Backend: Node.js + Express
Storage: JSON file

API Endpoints
POST /expenses – Create expense (idempotent)
GET /expenses?category=&sort=date_desc – List expenses

Local Setup
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run dev

Notes
Amounts are stored in paise (₹ × 100) to avoid precision issues
API uses a clientRequestId to safely handle retries

Author
Pavani vasudha Naramamidi
