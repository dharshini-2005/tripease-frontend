import { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const Checklist = () => {
  const [location, setLocation] = useState("");
  const [items, setItem] = useState("");
  const [checklist, setChecklist] = useState({});

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleItemChange = (e) => {
    setItem(e.target.value);
  };

  const addItem = async (e) => {
    e.preventDefault();

    if (location.trim() !== "" && items.trim() !== "") {
      const updatedChecklist = {
        ...checklist,
        [location]: [...(checklist[location] || []), items],
      };

      setChecklist(updatedChecklist);
      setItem("");
const check={location,items};
      try {
        const response = await axios.post(`${API_BASE_URL}/checklists`, check);
        console.log(response);
      } catch (error) {
        alert("Items not added.");
      }
    }
  };

  const removeItem = (locationName, index) => {
    setChecklist((prevChecklist) => {
      const updatedLocationItems = prevChecklist[locationName].filter((_, i) => i !== index);
      if (updatedLocationItems.length === 0) {
        const { [locationName]: _, ...remainingChecklist } = prevChecklist; // Remove location if no items left
        return remainingChecklist;
      }

      return {
        ...prevChecklist,
        [locationName]: updatedLocationItems,
      };
    });
  };

  const backgroundImageStyle = {
    backgroundImage: 'url("https://img.freepik.com/premium-photo/outfit-traveler-black-background-travel-concept_146508-661.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100vw",
  };

  return (
    <div className="checkkk" style={backgroundImageStyle}>
      <div className="checklist-container">
        <h2 className="checklist-title">Packing Checklist</h2>

        <div className="location-section">
          <label htmlFor="location">Trip Location:</label>
          <input
            type="text"
            id="location"
            placeholder="Enter your trip location"
            value={location}
            onChange={handleLocationChange}
            required
          />
        </div>

        <form onSubmit={addItem} className="add-item-form">
          <label htmlFor="item">Add Item:</label>
          <input
            type="text"
            id="item" 
            placeholder="Enter an item"
            value={items}
            onChange={handleItemChange}
            required
          />
          <button type="submit" className="add-button">Add</button>
        </form>

        <div className="checklist">
          <h3>Checklist:</h3>
          {Object.keys(checklist).length > 0 ? (
            Object.keys(checklist).map((locationName) => (
              <div key={locationName} className="location-group">
                <h4>For {locationName}:</h4>
                <ul>
                  {checklist[locationName].map((item, index) => (
                    <li key={index}>
                      {item}
                      <button onClick={() => removeItem(locationName, index)} className="remove-button">Remove</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>No items added yet. Start by adding items above.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checklist;