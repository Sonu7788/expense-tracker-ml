// server/routes/expenses.js
import express from "express";
import Expense from "../models/Expense.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Helper
const VALID_CATEGORIES = ["Food","Rent","Travel","Shopping","Bills","Other"];

// GET
router.get("/", auth, async (req, res) => {
  try {
    console.log("GET /api/expenses - user:", req.user && req.user.id);
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    return res.json(expenses);
  } catch (err) {
    console.error("GET /api/expenses error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST (diagnostic)
router.post("/", auth, async (req, res) => {
  try {
    console.log("POST /api/expenses - body:", req.body);
    console.log("Authenticated user id:", req.user && req.user.id);

    if (!req.user || !req.user.id) {
      console.warn("Unauthorized access to POST /api/expenses");
      return res.status(401).json({ message: "Unauthorized" });
    }

    let { amount, category, date, note, paymentMethod } = req.body;

    // Basic validation
    if (amount === undefined || amount === null || amount === "") {
      return res.status(400).json({ message: "amount is required" });
    }
    amount = Number(amount);
    if (Number.isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "amount must be a positive number" });
    }

    if (!category) category = "Other";
    if (!VALID_CATEGORIES.includes(category)) category = "Other";

    const parsedDate = date ? new Date(date) : new Date();
    if (isNaN(parsedDate.getTime())) return res.status(400).json({ message: "Invalid date" });

    const doc = {
      user: req.user.id,
      amount,
      category,
      date: parsedDate,
      note: note || "",
      paymentMethod: paymentMethod || "UPI"
    };

    console.log("Creating expense doc:", doc);

    const expense = await Expense.create(doc);

    console.log("Expense created. _id:", expense._id);
    return res.status(201).json(expense);
  } catch (err) {
    console.error("POST /api/expenses error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Unauthorized" });
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.amount) updates.amount = Number(updates.amount);
    const expense = await Expense.findOneAndUpdate({ _id: id, user: req.user.id }, updates, { new: true });
    if (!expense) return res.status(404).json({ message: "Not found" });
    return res.json(expense);
  } catch (err) {
    console.error("PUT /api/expenses/:id error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Unauthorized" });
    const { id } = req.params;
    const exp = await Expense.findOneAndDelete({ _id: id, user: req.user.id });
    if (!exp) return res.status(404).json({ message: "Not found" });
    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE /api/expenses/:id error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
