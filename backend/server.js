import express from "express";
import fs from "fs";
import cors from "cors";
import { v4 as uuid } from "uuid";

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = "./expenses.json";

// Helpers
const readDB = () => JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));

const writeDB = (data) =>
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// POST /expenses (Idempotent)
app.post("/expenses", (req, res) => {
  const { amount, category, description, date, clientRequestId } = req.body;

  if (!amount || amount <= 0 || !category || !date || !clientRequestId) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const db = readDB();

  // Idempotency check
  const existing = db.expenses.find(
    (e) => e.clientRequestId === clientRequestId,
  );

  if (existing) {
    return res.status(200).json(existing);
  }

  const expense = {
    id: uuid(),
    clientRequestId,
    amount: Math.round(amount * 100), // paise
    category,
    description,
    date,
    created_at: new Date().toISOString(),
  };

  db.expenses.push(expense);
  writeDB(db);

  res.status(201).json(expense);
});

// GET /expenses
app.get("/expenses", (req, res) => {
  const { category, sort } = req.query;
  let { expenses } = readDB();

  if (category) {
    expenses = expenses.filter((e) => e.category === category);
  }

  if (sort === "date_desc") {
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  res.json(expenses);
});

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
