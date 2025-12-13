import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    category: {
      type: String,
      enum: ["Food", "Rent", "Travel", "Shopping", "Bills", "Other"],
      default: "Other"
    },
    date: { type: Date, default: Date.now },
    note: { type: String, default: "" },
    paymentMethod: { type: String, default: "UPI" }
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
