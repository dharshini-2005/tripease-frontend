import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import BASE_URL from "./config";

const StarRating = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star${star <= (hovered || value) ? " active" : ""}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const ratingLabel = (r) => {
  const labels = { 1: "😞 Poor", 2: "😐 Fair", 3: "🙂 Good", 4: "😊 Great", 5: "🤩 Excellent" };
  return labels[r] || "";
};

const renderStars = (r) => "★".repeat(r || 0) + "☆".repeat(5 - (r || 0));

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [place, setPlace] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/feedbacks`)
      .then((res) => setFeedbacks(res.data))
      .catch(() => showToast("Could not load feedbacks.", "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!place.trim() || !feedback.trim()) {
      showToast("Fill in place and feedback.", "error");
      return;
    }
    if (rating === 0) {
      showToast("Please select a rating.", "error");
      return;
    }
    setSubmitting(true);
    const newFeedback = { place: place.trim(), feedback: feedback.trim(), rating };
    try {
      await axios.post(`${BASE_URL}/feedbacks`, newFeedback);
      setFeedbacks([newFeedback, ...feedbacks]);
      setPlace("");
      setFeedback("");
      setRating(0);
      showToast("Feedback submitted! ⭐");
    } catch {
      showToast("Failed to submit feedback.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating =
    feedbacks.length > 0
      ? (feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length).toFixed(1)
      : null;

  const filtered =
    filter === "all"
      ? feedbacks
      : feedbacks.filter((f) => f.rating === parseInt(filter));

  return (
    <div className="content-page">
      <Navbar />
      <div className="content-inner">
        <div className="page-header">
          <h2>⭐ Travel Feedback</h2>
          <p>Rate places you've visited and share your experience with fellow travellers.</p>
        </div>

        {/* Stats */}
        {feedbacks.length > 0 && (
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <div className="card" style={{ flex: 1, minWidth: "140px", textAlign: "center", padding: "1.2rem" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary)" }}>{feedbacks.length}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>Total Reviews</div>
            </div>
            <div className="card" style={{ flex: 1, minWidth: "140px", textAlign: "center", padding: "1.2rem" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--warning)" }}>{avgRating} ★</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>Average Rating</div>
            </div>
          </div>
        )}

        {/* Submit Feedback */}
        <div className="card">
          <div className="card-title">✍️ Write a Review</div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Place Visited</label>
              <input
                type="text"
                placeholder="e.g. Taj Mahal, Agra"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Your Rating</label>
              <StarRating value={rating} onChange={setRating} />
              {rating > 0 && (
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
                  {ratingLabel(rating)}
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Your Experience</label>
              <textarea
                placeholder="Tell others about your experience at this place..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-filled btn-full" disabled={submitting}>
              {submitting ? "Submitting..." : "🚀 Submit Review"}
            </button>
          </form>
        </div>

        {/* Filter + Reviews */}
        <div className="card">
          <div className="card-title" style={{ flexWrap: "wrap", gap: "0.6rem" }}>
            🗣️ Reviews
            <span className="badge badge-primary" style={{ marginLeft: "auto" }}>{filtered.length}</span>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            {["all", "5", "4", "3", "2", "1"].map((f) => (
              <button
                key={f}
                className={`btn btn-sm ${filter === f ? "btn-filled" : "btn-outline"}`}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "All" : `${f} ★`}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-wrap"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <p>No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            filtered.map((entry, index) => (
              <div className="feedback-item" key={index}>
                <div className="feedback-item-place">
                  📍 {entry.place}
                </div>
                {entry.rating && (
                  <div className="feedback-item-stars">
                    {renderStars(entry.rating)}{" "}
                    <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                      {ratingLabel(entry.rating)}
                    </span>
                  </div>
                )}
                <div className="feedback-item-text">{entry.feedback}</div>
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

export default Feedback;
