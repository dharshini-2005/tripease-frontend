import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import BASE_URL from "./config";

const Checklist = () => {
  const [location, setLocation] = useState("");
  const [itemInput, setItemInput] = useState("");
  const [checklist, setChecklist] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load saved items on mount
  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/checklists`);
        const data = response.data;
        const grouped = {};
        data.forEach((entry) => {
          if (!grouped[entry.location]) grouped[entry.location] = [];
          grouped[entry.location].push(entry.items);
        });
        setChecklist(grouped);
      } catch {
        showToast("Could not load checklist.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchChecklists();
  }, []);

  const addItem = async (e) => {
    e.preventDefault();
    if (!location.trim() || !itemInput.trim()) {
      showToast("Enter both a location and an item.", "error");
      return;
    }

    const trimmedLocation = location.trim();
    const trimmedItem = itemInput.trim();

    setChecklist((prev) => ({
      ...prev,
      [trimmedLocation]: [...(prev[trimmedLocation] || []), trimmedItem],
    }));
    setItemInput("");

    try {
      await axios.post(`${BASE_URL}/checklists`, { location: trimmedLocation, items: trimmedItem });
      showToast("Item added to checklist. ✅");
    } catch {
      showToast("Saved locally but server sync failed.", "info");
    }
  };

  const removeItem = (loc, index) => {
    setChecklist((prev) => {
      const updated = prev[loc].filter((_, i) => i !== index);
      if (updated.length === 0) {
        const { [loc]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [loc]: updated };
    });
    setCheckedItems((prev) => {
      const key = `${loc}-${index}`;
      const { [key]: _, ...rest } = prev;
      return rest;
    });
    showToast("Item removed.");
  };

  const toggleCheck = (loc, index) => {
    const key = `${loc}-${index}`;
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalItems = Object.values(checklist).reduce((sum, arr) => sum + arr.length, 0);
  const totalChecked = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="content-page">
      <Navbar />
      <div className="content-inner">
        <div className="page-header">
          <h2>✅ Packing Checklist</h2>
          <p>Organise packing lists by trip destination. Never forget a thing.</p>
        </div>

        {/* Progress Summary */}
        {totalItems > 0 && (
          <div className="card" style={{ background: "var(--primary)", color: "#fff", border: "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "0.85rem", opacity: 0.85, marginBottom: "0.2rem" }}>Overall Progress</div>
                <div style={{ fontSize: "1.6rem", fontWeight: 800 }}>{totalChecked} / {totalItems} packed</div>
              </div>
              <div style={{ fontSize: "2.5rem" }}>
                {totalChecked === totalItems && totalItems > 0 ? "🎉" : "🧳"}
              </div>
            </div>
            <div style={{ marginTop: "0.8rem", background: "rgba(255,255,255,0.25)", borderRadius: "50px", height: "8px", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                background: "#fff",
                borderRadius: "50px",
                width: `${totalItems > 0 ? (totalChecked / totalItems) * 100 : 0}%`,
                transition: "width 0.4s ease"
              }} />
            </div>
          </div>
        )}

        {/* Add Item Form */}
        <div className="card">
          <div className="card-title">➕ Add Item</div>
          <form onSubmit={addItem}>
            <div className="form-row">
              <div className="form-group">
                <label>Trip Location</label>
                <input
                  type="text"
                  placeholder="e.g. Shimla"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Item to Pack</label>
                <input
                  type="text"
                  placeholder="e.g. Warm jacket"
                  value={itemInput}
                  onChange={(e) => setItemInput(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-filled">
              ➕ Add to List
            </button>
          </form>
        </div>

        {/* Checklist Display */}
        {loading ? (
          <div className="loading-wrap"><div className="spinner" /></div>
        ) : Object.keys(checklist).length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <p>No items yet. Start adding your packing essentials above.</p>
            </div>
          </div>
        ) : (
          Object.keys(checklist).map((loc) => {
            const items = checklist[loc];
            const checkedCount = items.filter((_, i) => checkedItems[`${loc}-${i}`]).length;
            return (
              <div className="card" key={loc}>
                <div className="card-title">
                  <span>📍 {loc}</span>
                  <span className="badge badge-primary" style={{ marginLeft: "auto" }}>
                    {checkedCount}/{items.length}
                  </span>
                </div>
                <div className="checklist-group">
                  {items.map((item, index) => {
                    const isChecked = !!checkedItems[`${loc}-${index}`];
                    return (
                      <div className={`checklist-item${isChecked ? " checked" : ""}`} key={index}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <input
                            type="checkbox"
                            className="checkbox-custom"
                            checked={isChecked}
                            onChange={() => toggleCheck(loc, index)}
                          />
                          <span>{item}</span>
                        </div>
                        <div className="item-actions">
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => removeItem(loc, index)}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === "success" ? "✅" : toast.type === "error" ? "❌" : "ℹ️"} {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default Checklist;
