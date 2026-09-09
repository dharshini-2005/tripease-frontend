import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import BASE_URL from "./config";

const Budget = () => {
  const [location, setLocation] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [savedBudgets, setSavedBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/budgets`)
      .then((res) => setSavedBudgets(res.data))
      .catch(() => showToast("Could not load budgets.", "error"))
      .finally(() => setLoading(false));
  }, []);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalBudget ? parseFloat(totalBudget) - totalSpent : 0;
  const progressPct = totalBudget ? Math.min((totalSpent / parseFloat(totalBudget)) * 100, 100) : 0;
  const isOver = totalBudget && totalSpent > parseFloat(totalBudget);

  const addExpense = (e) => {
    e.preventDefault();
    if (!expenseName.trim() || !expenseAmount || parseFloat(expenseAmount) <= 0) {
      showToast("Enter a valid expense name and amount.", "error");
      return;
    }
    setExpenses([...expenses, { name: expenseName.trim(), amount: parseFloat(expenseAmount) }]);
    setExpenseName("");
    setExpenseAmount("");
    showToast("Expense added.");
  };

  const removeExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const saveBudget = async () => {
    if (!location.trim() || !totalBudget || expenses.length === 0) {
      showToast("Fill in location, total budget and at least one expense.", "error");
      return;
    }
    setSaving(true);
    const budgetData = { location: location.trim(), totalBudget: parseFloat(totalBudget), expenses };
    try {
      const response = await axios.post(`${BASE_URL}/budgets`, budgetData);
      setSavedBudgets([response.data.newBudget || budgetData, ...savedBudgets]);
      setLocation("");
      setTotalBudget("");
      setExpenses([]);
      showToast("Budget saved! 💰");
    } catch {
      showToast("Failed to save budget.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="content-page">
      <Navbar />
      <div className="content-inner">
        <div className="page-header">
          <h2>💰 Budget Tracker</h2>
          <p>Track trip expenses and stay on top of your spending.</p>
        </div>

        {/* Budget Summary Bar */}
        {totalBudget && (
          <div className="budget-summary-bar">
            <h3>Total Budget — {location || "New Trip"}</h3>
            <div className="budget-amount">₹{parseFloat(totalBudget).toLocaleString("en-IN")}</div>
            <div className="budget-progress-wrap">
              <div className="budget-progress-label">
                <span>Spent: ₹{totalSpent.toLocaleString("en-IN")}</span>
                <span style={{ color: isOver ? "#FF6584" : "#fff" }}>
                  {isOver ? `Over by ₹${Math.abs(remaining).toLocaleString("en-IN")}` : `Left: ₹${remaining.toLocaleString("en-IN")}`}
                </span>
              </div>
              <div className="budget-progress-track">
                <div
                  className={`budget-progress-fill${isOver ? " over" : ""}`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Setup Card */}
        <div className="card">
          <div className="card-title">🏖️ Trip Setup</div>
          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                placeholder="e.g. Manali"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Total Budget (₹)</label>
              <input
                type="number"
                placeholder="e.g. 15000"
                value={totalBudget}
                min="1"
                onChange={(e) => setTotalBudget(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Add Expense */}
        <div className="card">
          <div className="card-title">➕ Add Expense</div>
          <form onSubmit={addExpense}>
            <div className="form-row">
              <div className="form-group">
                <label>Expense Name</label>
                <input
                  type="text"
                  placeholder="e.g. Hotel stay"
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 2500"
                  value={expenseAmount}
                  min="1"
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-outline">
              ➕ Add Expense
            </button>
          </form>

          {expenses.length > 0 && (
            <>
              <div className="divider" />
              <div style={{ marginBottom: "0.5rem" }}>
                {expenses.map((exp, i) => (
                  <div className="expense-item" key={i}>
                    <span className="expense-name">{exp.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                      <span className="expense-amount">₹{exp.amount.toLocaleString("en-IN")}</span>
                      <button className="btn btn-danger btn-sm" onClick={() => removeExpense(i)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "right", fontWeight: 700, color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Total: ₹{totalSpent.toLocaleString("en-IN")}
              </div>
              <div className="divider" />
              <button className="btn btn-filled btn-full" onClick={saveBudget} disabled={saving}>
                {saving ? "Saving..." : "💾 Save Budget"}
              </button>
            </>
          )}
        </div>

        {/* Saved Budgets */}
        <div className="card">
          <div className="card-title">
            📁 Saved Budgets
            <span className="badge badge-primary" style={{ marginLeft: "auto" }}>{savedBudgets.length}</span>
          </div>
          {loading ? (
            <div className="loading-wrap"><div className="spinner" /></div>
          ) : savedBudgets.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💸</div>
              <p>No saved budgets yet. Save your first trip budget!</p>
            </div>
          ) : (
            savedBudgets.map((b, i) => (
              <div className="saved-budget-item" key={i}>
                <div>
                  <div className="saved-budget-loc">📍 {b.location}</div>
                  <div className="saved-budget-meta">
                    {b.expenses?.length || 0} expense{b.expenses?.length !== 1 ? "s" : ""}
                    {b.expenses?.length > 0 && (
                      <> · Spent: ₹{b.expenses.reduce((s, e) => s + e.amount, 0).toLocaleString("en-IN")}</>
                    )}
                  </div>
                </div>
                <div className="saved-budget-amount">₹{b.totalBudget?.toLocaleString("en-IN")}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === "success" ? "✅" : "❌"} {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
