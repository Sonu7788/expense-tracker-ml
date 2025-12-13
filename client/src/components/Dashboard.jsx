import { useEffect, useState } from "react";
import { api } from "../api";
import "./Dashboard.css"; // ❤️ Import CSS

export default function Dashboard({ user, onLogout }) {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [note, setNote] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const loadExpenses = async () => {
    const { data } = await api.get("/expenses");
    setExpenses(data);
  };

  const loadSuggestions = async () => {
    const { data } = await api.get("/analytics/ml-suggestions");
    setSuggestions(data);
  };

  useEffect(() => {
    loadExpenses();
    loadSuggestions();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!amount) return;
    const { data } = await api.post("/expenses", {
      amount: Number(amount),
      category,
      note
    });
    setExpenses((prev) => [data, ...prev]);
    setAmount("");
    setNote("");
    loadSuggestions();
  };

  // 🎙 Voice input
  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      parseVoiceText(text);
    };

    recognition.start();
  };

  const parseVoiceText = (text) => {
    const lower = text.toLowerCase();
    const amountMatch = lower.match(/(\d+(\.\d+)?)/);
    if (amountMatch) setAmount(amountMatch[1]);

    const categories = ["food", "rent", "travel", "shopping", "bills"];
    for (const cat of categories) {
      if (lower.includes(cat)) {
        setCategory(cat[0].toUpperCase() + cat.slice(1));
        break;
      }
    }
    setNote(text);
  };

  return (
    <div className={`dashboard ${darkMode ? "dark" : ""}`}>
      <header className="header">
        <h2>Hello, {user.name}</h2>

        <div className="header-buttons">
          <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "🌙 Night" : "🌞 Day"}
          </button>

          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Suggestions */}
      <section className="card animate">
        <h3>Smart ML Suggestions</h3>
        {!suggestions && <p>Loading suggestions...</p>}
        {suggestions && (
          <>
            <p><strong>Current month spend:</strong> ₹{suggestions.currentMonthSpend}</p>
            <p><strong>Predicted next month spend:</strong> ₹{suggestions.predictedNextMonthSpend}</p>
            <p><strong>Suggested budget:</strong> ₹{suggestions.suggestedBudget}</p>
            <p>{suggestions.message}</p>
          </>
        )}
      </section>

      {/* Add Expense */}
      <section className="card animate">
        <h3>Add Expense</h3>

        <form className="form" onSubmit={handleAddExpense}>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            className="input-box"
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <select
            value={category}
            className="input-box"
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option>Food</option>
            <option>Rent</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Other</option>
          </select>

          <input
            type="text"
            placeholder="Note"
            className="input-box"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <button type="submit" className="submit-btn">Add</button>
        </form>

        <button onClick={handleVoiceInput} className="voice-btn">
          {listening ? "🎤 Listening..." : "🎙 Add via Voice"}
        </button>

        {!speechSupported && (
          <p className="error-text">Browser does not support speech recognition.</p>
        )}
      </section>

      {/* Expenses List */}
      <section className="card animate">
        <h3>Recent Expenses</h3>

        {expenses.length === 0 && <p>No expenses yet.</p>}

        <ul className="expense-list">
          {expenses.map((e) => (
            <li className="expense-item" key={e._id}>
              <div>
                <span className="expense-amount">₹{e.amount}</span>
                <span className="expense-category">{e.category}</span>
                <div className="expense-note">{e.note}</div>
              </div>
              <div className="expense-date">
                {new Date(e.date).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
