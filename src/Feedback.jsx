import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [place, setPlace] = useState("");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/feedbacks`);
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const handlePlaceChange = (e) => setPlace(e.target.value);
  const handleFeedbackChange = (e) => setFeedback(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (place.trim() && feedback.trim()) {
      const newFeedback = { place, feedback };

      try {
        // Send data to backend
        await axios.post(`${API_BASE_URL}/feedbacks`, newFeedback);
        setFeedbacks([...feedbacks, newFeedback]); // Update state
        setPlace("");
        setFeedback("");
      } catch (error) {
        console.error("Error submitting feedback:", error);
        alert("Failed to submit feedback.");
      }
    }
  };

  const backgroundImageStyle = {
    backgroundImage: 'url("https://thumbs.dreamstime.com/b/feedback-direction-chalkboard-concept-arrows-66656367.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100vw",
  };
  return (
    <div style={backgroundImageStyle}>
    <div className="feedback-container">
      <h1>Feedback Page</h1>
      <form onSubmit={handleSubmit} className="feedback-form">
        <label htmlFor="place">Place:</label>
        <input
          type="text"
          id="place"
          placeholder="Enter the place you visited"
          value={place}
          onChange={handlePlaceChange}
          required
        />

        <label htmlFor="feedback">Feedback:</label>
        <textarea
          id="feedback"
          placeholder="Write your feedback about the place"
          value={feedback}
          onChange={handleFeedbackChange}
          required
        ></textarea>

        <button type="submit" className="submit-feedback">
          Submit Feedback
        </button>
      </form>

      <div className="feedback-list">
        <h2>Feedbacks:</h2>
        {feedbacks.length > 0 ? (
          <ul>
            {feedbacks.map((entry, index) => (
              <li key={index}>
                <strong>{entry.place}:</strong> {entry.feedback}
              </li>
            ))}
          </ul>
        ) : (
          <p>No feedbacks submitted yet.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default Feedback;
