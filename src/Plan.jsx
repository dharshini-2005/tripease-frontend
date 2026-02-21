import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const Plan = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [plans, setPlans] = useState([]); 


  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/plans`);
        setPlans(response.data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };
    fetchPlans();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!source || !destination || !date) {
      alert("All fields are required!");
      return;
    }


    const newPlan = { source, destination, date };

    try {
      
      const response = await axios.post(`${API_BASE_URL}/plans`, newPlan);
      console.log("Plan saved:", response.data);

    
      setPlans([...plans, newPlan]);


      setSource("");
      setDestination("");
      setDate("");
    } catch (error) {
      console.error("Error saving plan:", error);
      alert("Plan not added. Server issue!");
    }
  };

  
  const backgroundImageStyle = {
    backgroundImage: 'url("https://i.pinimg.com/736x/33/63/21/3363219f117127d8423bc28d88043425.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100vw",
  };
  

  return (
    <div style={backgroundImageStyle}>
    <div style={backgroundImageStyle}>
      <h2 className="plan">Create Travel Plan</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Source:</label>
          <div className="source-btn">
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Enter Source"
              required
            />
          </div>
        </div>

        <label>Destination:</label>
        <div className="destination-btn">
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter Destination"
            required
            className="Destination"
          />
        </div>

        <label>Date:</label>
        <div className="date-btn">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="date"
          />
        </div>

        <div className="submit-place">
          <button type="submit" className="plan-created">Create Plan</button>
        </div>
      </form>

      <h3 className="created">Created Travel Plans</h3>
      <ul>
        {plans.map((plan, index) => (
          <li key={index}>
            <strong>Source:</strong> {plan.source} <br />
            <strong>Destination:</strong> {plan.destination} <br />
            <strong>Date:</strong> {plan.date}
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default Plan;
