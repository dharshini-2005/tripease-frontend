import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import BASE_URL from "./config";

const Plan = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/plans`);
        setPlans(response.data);
      } catch {
        showToast("Could not load plans.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!source.trim() || !destination.trim() || !date) {
      showToast("All fields are required.", "error");
      return;
    }
    setSubmitting(true);
    const newPlan = { source: source.trim(), destination: destination.trim(), date };
    try {
      await axios.post(`${BASE_URL}/plans`, newPlan);
      setPlans([newPlan, ...plans]);
      setSource("");
      setDestination("");
      setDate("");
      showToast("Trip plan created! 🗺️");
    } catch {
      showToast("Failed to save plan. Try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="content-page">
      <Navbar />
      <div className="content-inner">
        <div className="page-header">
          <h2>🗺️ Travel Plans</h2>
          <p>Plan your next adventure with source, destination and travel date.</p>
        </div>

        {/* Create Plan Form */}
        <div className="card">
          <div className="card-title">✏️ Create New Plan</div>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>From</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>To</label>
                <input
                  type="text"
                  placeholder="e.g. Goa"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Travel Date</label>
              <input
                type="date"
                value={date}
                min={today}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-filled btn-full" disabled={submitting}>
              {submitting ? "Saving..." : "✈️ Create Plan"}
            </button>
          </form>
        </div>

        {/* Plans List */}
        <div className="card">
          <div className="card-title">
            📋 Your Plans
            <span className="badge badge-primary" style={{ marginLeft: "auto" }}>{plans.length}</span>
          </div>

          {loading ? (
            <div className="loading-wrap"><div className="spinner" /></div>
          ) : plans.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🧳</div>
              <p>No plans yet. Create your first trip above!</p>
            </div>
          ) : (
            <div className="plan-list">
              {plans.map((plan, index) => (
                <div className="plan-item" key={index}>
                  <div className="plan-item-info">
                    <div className="plan-route">
                      {plan.source}
                      <span style={{ color: "var(--primary)" }}>→</span>
                      {plan.destination}
                    </div>
                    <div className="plan-date">
                      📅{" "}
                      {new Date(plan.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <span className="badge badge-primary">Planned</span>
                </div>
              ))}
            </div>
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

export default Plan;
