import express from "express";
import { auth } from "../middleware/auth.js";
import Expense from "../models/Expense.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.get("/ml-suggestions", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0, 23, 59, 59);

    const expenses = await Expense.find({
      user: userId,
      date: { $gte: monthStart, $lte: monthEnd }
    });

    const totalSpend = expenses.reduce((sum, e) => sum + e.amount, 0);
    const numTransactions = expenses.length;

    const categorySpend = {};
    for (const e of expenses) {
      categorySpend[e.category] = (categorySpend[e.category] || 0) + e.amount;
    }

    const featurePayload = {
      total_spend_M: totalSpend,
      num_transactions_M: numTransactions,
      spend_food_M: categorySpend["Food"] || 0,
      spend_rent_M: categorySpend["Rent"] || 0,
      spend_travel_M: categorySpend["Travel"] || 0,
      spend_shopping_M: categorySpend["Shopping"] || 0,
      month_number: month + 1
    };

    const mlRes = await axios.post(
      `${process.env.ML_SERVICE_URL}/predict/next-month-spend`,
      featurePayload
    );

    const predicted = mlRes.data.predicted_next_month_spend;
    const suggestedBudget = Math.round(predicted * 0.9);

    res.json({
      currentMonthSpend: totalSpend,
      predictedNextMonthSpend: Math.round(predicted),
      suggestedBudget,
      message: `Based on your current month spending, next month you may spend around ₹${Math.round(
        predicted
      )}. Try to keep a budget of ₹${suggestedBudget} to save ~10%.`
    });
  } catch (err) {
    console.error("ML suggestion error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
