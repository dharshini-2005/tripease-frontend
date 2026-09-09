import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Navbar from "./Navbar";
import axios from "axios";

// Fix Leaflet default marker icon broken in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const CATEGORIES = [
  { key: "attractions", label: "🏛️ Attractions" },
  { key: "hotels", label: "🏨 Hotels" },
  { key: "restaurants", label: "🍽️ Restaurants" },
  { key: "activities", label: "🎯 Activities" },
];

// Fetch Wikipedia summary + coordinates
const fetchWikiSummary = async (query) => {
  try {
    const res = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
    );
    return res.data;
  } catch {
    return null;
  }
};

// Picsum for card images
const getPlaceImg = (index) => `https://picsum.photos/seed/place${index}/400/260`;

const generatePlaces = (destination) => {
  const d = destination.trim();
  return {
    attractions: [
      { name: `${d} Old Town`, type: "Historic Site", rating: 4.7, reviews: 2341, desc: "A beautifully preserved historic district with centuries of culture and architecture.", img: getPlaceImg(10) },
      { name: `${d} National Museum`, type: "Museum", rating: 4.5, reviews: 1892, desc: "Explore the rich history and culture of the region through exhibits and artifacts.", img: getPlaceImg(20) },
      { name: `${d} Central Park`, type: "Park & Nature", rating: 4.6, reviews: 3120, desc: "A vast green space perfect for relaxing, picnics, and morning walks.", img: getPlaceImg(30) },
      { name: `${d} Viewpoint`, type: "Scenic Spot", rating: 4.8, reviews: 987, desc: "Stunning panoramic views of the city skyline and surrounding landscape.", img: getPlaceImg(40) },
      { name: `${d} Art Gallery`, type: "Art & Culture", rating: 4.4, reviews: 756, desc: "Contemporary and classical art collections from local and international artists.", img: getPlaceImg(50) },
      { name: `${d} Temple`, type: "Religious Site", rating: 4.9, reviews: 4200, desc: "An iconic spiritual landmark and one of the most photographed spots in the city.", img: getPlaceImg(60) },
    ],
    hotels: [
      { name: `The Grand ${d}`, type: "5-Star Luxury", rating: 4.9, reviews: 1230, price: "₹8,500/night", desc: "World-class amenities, rooftop pool, and breathtaking city views.", img: getPlaceImg(70) },
      { name: `${d} Boutique Inn`, type: "Boutique Hotel", rating: 4.6, reviews: 834, price: "₹3,200/night", desc: "Charming boutique property with personalised service in the heart of the city.", img: getPlaceImg(80) },
      { name: `${d} Heritage Stay`, type: "Heritage Hotel", rating: 4.7, reviews: 612, price: "₹5,400/night", desc: "Stay in a restored heritage building with antique décor and modern comforts.", img: getPlaceImg(90) },
      { name: `Comfort Stay ${d}`, type: "3-Star", rating: 4.3, reviews: 2100, price: "₹1,800/night", desc: "Clean, comfortable rooms at an affordable price. Great for budget travellers.", img: getPlaceImg(100) },
      { name: `${d} Resort & Spa`, type: "Resort", rating: 4.8, reviews: 445, price: "₹12,000/night", desc: "Luxury resort with spa, multiple pools, and fine dining restaurants.", img: getPlaceImg(110) },
    ],
    restaurants: [
      { name: `${d} Kitchen`, type: "Local Cuisine", rating: 4.8, reviews: 3420, price: "₹400–800", desc: "Authentic local dishes prepared with fresh ingredients. A must-visit for foodies.", img: getPlaceImg(120) },
      { name: `Spice Route ${d}`, type: "Indian & Asian", rating: 4.6, reviews: 1876, price: "₹600–1,200", desc: "A vibrant dining experience with bold spices and traditional recipes.", img: getPlaceImg(130) },
      { name: `The ${d} Bistro`, type: "Continental", rating: 4.5, reviews: 987, price: "₹800–1,500", desc: "Cozy European-style bistro known for its wood-fired pizzas and pasta.", img: getPlaceImg(140) },
      { name: `Café ${d}`, type: "Café & Bakery", rating: 4.7, reviews: 2340, price: "₹200–500", desc: "Artisan coffee, freshly baked pastries, and a calm ambiance for a relaxed morning.", img: getPlaceImg(150) },
      { name: `${d} Rooftop Grill`, type: "Rooftop Dining", rating: 4.9, reviews: 567, price: "₹1,200–2,500", desc: "Dinner with a view — grilled specialties under the stars.", img: getPlaceImg(160) },
    ],
    activities: [
      { name: `${d} City Tour`, type: "Guided Tour", rating: 4.7, reviews: 4120, price: "₹799/person", desc: "A comprehensive guided tour covering all major landmarks and hidden gems.", img: getPlaceImg(170) },
      { name: `${d} Trekking Trail`, type: "Adventure", rating: 4.8, reviews: 1230, price: "₹1,200/person", desc: "Scenic trekking routes for all fitness levels with experienced local guides.", img: getPlaceImg(180) },
      { name: `${d} Cooking Class`, type: "Cultural Experience", rating: 4.9, reviews: 678, price: "₹1,500/person", desc: "Learn to cook authentic local dishes from expert chefs in a fun setting.", img: getPlaceImg(190) },
      { name: `${d} River Cruise`, type: "Leisure", rating: 4.6, reviews: 890, price: "₹950/person", desc: "A relaxing boat cruise along the river with scenic views and refreshments.", img: getPlaceImg(200) },
      { name: `${d} Photography Walk`, type: "Experience", rating: 4.7, reviews: 345, price: "₹600/person", desc: "Explore the city's most photogenic spots with a professional photographer.", img: getPlaceImg(210) },
    ],
  };
};

// Re-centers map when coordinates change
const MapUpdater = ({ lat, lon }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) map.setView([lat, lon], 12, { animate: true });
  }, [lat, lon, map]);
  return null;
};

const StarDisplay = ({ rating }) => (
  <span style={{ color: "#f7b731", fontSize: "0.85rem" }}>
    {"★".repeat(Math.floor(rating))}
    {"☆".repeat(5 - Math.floor(rating))}
    <span style={{ color: "#6b7280", marginLeft: "0.3rem" }}>{rating}</span>
  </span>
);

const PlaceCard = ({ place, color }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div
      style={{
        background: "#fff", borderRadius: "16px", overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb",
        transition: "all 0.22s ease",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.13)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"; }}
    >
      <div style={{ position: "relative", height: "180px", background: "#f3f4f6", overflow: "hidden" }}>
        {!imgError ? (
          <img src={place.img} alt={place.name} onError={() => setImgError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg,${color}22,${color}44)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>🌍</div>
        )}
        <div style={{ position: "absolute", top: "0.6rem", left: "0.6rem", background: color, color: "#fff", padding: "0.2rem 0.7rem", borderRadius: "50px", fontSize: "0.75rem", fontWeight: 700 }}>
          {place.type}
        </div>
      </div>
      <div style={{ padding: "1rem" }}>
        <div style={{ fontWeight: 800, fontSize: "1rem", color: "#1a1a2e", marginBottom: "0.3rem" }}>{place.name}</div>
        <StarDisplay rating={place.rating} />
        <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "0.5rem" }}>({place.reviews.toLocaleString()} reviews)</div>
        <div style={{ fontSize: "0.88rem", color: "#6b7280", lineHeight: 1.5, marginBottom: "0.5rem" }}>{place.desc}</div>
        {place.price && <div style={{ fontWeight: 700, color: color, fontSize: "0.9rem" }}>💰 {place.price}</div>}
      </div>
    </div>
  );
};

const tabColor = { attractions: "#6C63FF", hotels: "#f7b731", restaurants: "#FF6584", activities: "#43d787" };

const Destination = () => {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState("");
  const [wikiData, setWikiData] = useState(null);
  const [places, setPlaces] = useState(null);
  const [coords, setCoords] = useState(null); // { lat, lon }
  const [activeTab, setActiveTab] = useState("attractions");
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setWikiData(null);
    setPlaces(null);
    setCoords(null);
    setImgError(false);

    const trimmed = query.trim();
    const wiki = await fetchWikiSummary(trimmed);

    if (!wiki || wiki.type === "disambiguation") {
      showToast(`Could not find "${trimmed}". Try a more specific name.`);
      setLoading(false);
      return;
    }

    // Extract coordinates from Wikipedia response
    if (wiki.coordinates) {
      setCoords({ lat: wiki.coordinates.lat, lon: wiki.coordinates.lon });
    }

    setWikiData(wiki);
    setPlaces(generatePlaces(trimmed));
    setSearched(trimmed);
    setActiveTab("attractions");
    setLoading(false);
  };

  const handlePopularClick = (dest) => {
    setQuery(dest);
  };

  // Submit search when popular tag sets query
  useEffect(() => {
    if (query && !loading) {
      // only auto-search if user clicked a popular tag (not typing)
    }
  }, [query]);

  const currentColor = tabColor[activeTab];

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb", paddingTop: "64px" }}>
      <Navbar />
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.9rem", fontWeight: 800, color: "#1a1a2e", display: "flex", alignItems: "center", gap: "0.6rem" }}>
            🔍 Destination Search
          </h2>
          <p style={{ color: "#6b7280", marginTop: "0.3rem" }}>
            Search any city or country to explore attractions, hotels, restaurants, activities and its location on the map.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 4px 24px rgba(108,99,255,0.10)", border: "1px solid #e5e7eb", marginBottom: "2rem" }}>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.75rem" }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a city — e.g. Paris, Goa, Tokyo, Bali..."
              style={{ flex: 1, padding: "0.8rem 1.1rem", border: "1.5px solid #e5e7eb", borderRadius: "10px", fontSize: "1rem", color: "#1a1a2e", outline: "none", fontFamily: "inherit", transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = "#6C63FF"}
              onBlur={e => e.target.style.borderColor = "#e5e7eb"}
            />
            <button type="submit" disabled={loading} style={{ padding: "0.8rem 1.8rem", background: "#6C63FF", color: "#fff", border: "none", borderRadius: "10px", fontSize: "1rem", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", opacity: loading ? 0.7 : 1, height: "auto", width: "auto", boxShadow: "none" }}>
              {loading ? "Searching..." : "🔍 Search"}
            </button>
          </form>

          {/* Popular tags */}
          <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.82rem", color: "#9ca3af", fontWeight: 600 }}>Popular:</span>
            {["Paris", "Goa", "Tokyo", "Bali", "New York", "Rajasthan", "Dubai", "London", "Rome"].map((d) => (
              <button key={d} onClick={() => handlePopularClick(d)}
                style={{ padding: "0.25rem 0.8rem", background: "#ede9ff", color: "#6C63FF", border: "none", borderRadius: "50px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", height: "auto", width: "auto", boxShadow: "none" }}
                onMouseEnter={e => e.target.style.background = "#d4ceff"}
                onMouseLeave={e => e.target.style.background = "#ede9ff"}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ width: "48px", height: "48px", border: "4px solid #ede9ff", borderTopColor: "#6C63FF", borderRadius: "50%", animation: "spin 0.75s linear infinite", margin: "0 auto 1rem" }} />
            <p style={{ color: "#6b7280" }}>Searching for {query}...</p>
          </div>
        )}

        {/* Results */}
        {wikiData && !loading && (
          <>
            {/* Destination Info Card */}
            <div style={{ background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 24px rgba(108,99,255,0.10)", border: "1px solid #e5e7eb", marginBottom: "2rem", display: "flex", flexWrap: "wrap" }}>
              {/* Wikipedia thumbnail */}
              <div style={{ width: "clamp(200px, 35%, 300px)", minHeight: "220px", background: "#f3f4f6", overflow: "hidden" }}>
                {!imgError ? (
                  <img
                    src={wikiData.thumbnail?.source || `https://picsum.photos/seed/${encodeURIComponent(searched)}/600/400`}
                    alt={searched}
                    onError={() => setImgError(true)}
                    style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: "220px" }}
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", minHeight: "220px", background: "linear-gradient(135deg,#ede9ff,#6C63FF22)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem" }}>🌍</div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, padding: "1.8rem", minWidth: "240px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.8rem", flexWrap: "wrap" }}>
                  <h2 style={{ fontSize: "1.7rem", fontWeight: 900, color: "#1a1a2e" }}>{wikiData.title}</h2>
                  <span style={{ background: "#ede9ff", color: "#6C63FF", padding: "0.2rem 0.8rem", borderRadius: "50px", fontSize: "0.8rem", fontWeight: 700 }}>📍 Destination</span>
                </div>
                <p style={{ color: "#6b7280", lineHeight: 1.7, fontSize: "0.95rem", marginBottom: "1rem" }}>
                  {wikiData.extract?.slice(0, 300)}{wikiData.extract?.length > 300 ? "..." : ""}
                </p>
                {coords && (
                  <div style={{ fontSize: "0.82rem", color: "#9ca3af", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    🗺️ {coords.lat.toFixed(4)}°N, {coords.lon.toFixed(4)}°E
                  </div>
                )}
                <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginTop: "1rem" }}>
                  {[["🏛️", `${places.attractions.length} Attractions`], ["🏨", `${places.hotels.length} Hotels`], ["🍽️", `${places.restaurants.length} Restaurants`], ["🎯", `${places.activities.length} Activities`]].map(([icon, label]) => (
                    <div key={label} style={{ background: "#f4f6fb", padding: "0.4rem 0.9rem", borderRadius: "8px", textAlign: "center" }}>
                      <div style={{ fontSize: "1.1rem" }}>{icon}</div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: 600 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== MAP ===== */}
            {coords && (
              <div style={{ background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 24px rgba(108,99,255,0.10)", border: "1px solid #e5e7eb", marginBottom: "2rem" }}>
                <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.1rem" }}>🗺️</span>
                  <span style={{ fontWeight: 700, color: "#1a1a2e", fontSize: "1rem" }}>Map — {wikiData.title}</span>
                  <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "#9ca3af" }}>OpenStreetMap</span>
                </div>
                <div style={{ height: "420px", width: "100%" }}>
                  <MapContainer
                    center={[coords.lat, coords.lon]}
                    zoom={12}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapUpdater lat={coords.lat} lon={coords.lon} />
                    <Marker position={[coords.lat, coords.lon]}>
                      <Popup>
                        <div style={{ textAlign: "center", minWidth: "140px" }}>
                          <strong style={{ fontSize: "1rem" }}>{wikiData.title}</strong><br />
                          <span style={{ fontSize: "0.82rem", color: "#6b7280" }}>
                            {coords.lat.toFixed(4)}°N, {coords.lon.toFixed(4)}°E
                          </span>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            )}

            {/* Category Tabs */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              {CATEGORIES.map((cat) => (
                <button key={cat.key} onClick={() => setActiveTab(cat.key)}
                  style={{
                    padding: "0.55rem 1.3rem",
                    background: activeTab === cat.key ? tabColor[cat.key] : "#fff",
                    color: activeTab === cat.key ? "#fff" : "#6b7280",
                    border: `1.5px solid ${activeTab === cat.key ? tabColor[cat.key] : "#e5e7eb"}`,
                    borderRadius: "50px", fontSize: "0.92rem", fontWeight: 700,
                    cursor: "pointer", transition: "all 0.2s",
                    height: "auto", width: "auto",
                    boxShadow: activeTab === cat.key ? `0 4px 14px ${tabColor[cat.key]}44` : "none",
                  }}>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Place Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.2rem", marginBottom: "2rem" }}>
              {places[activeTab].map((place, i) => (
                <PlaceCard key={i} place={place} color={currentColor} />
              ))}
            </div>
          </>
        )}

        {/* Empty state */}
        {!wikiData && !loading && (
          <div style={{ textAlign: "center", padding: "4rem 1rem", color: "#9ca3af" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🌍</div>
            <h3 style={{ fontSize: "1.2rem", color: "#6b7280", marginBottom: "0.5rem" }}>Start exploring</h3>
            <p>Search any city or country above to see its location on the map, plus attractions, hotels, restaurants and activities.</p>
          </div>
        )}
      </div>

      {toast && (
        <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 9999 }}>
          <div style={{ background: "#1a1a2e", color: "#fff", padding: "0.8rem 1.3rem", borderRadius: "10px", fontSize: "0.92rem", fontWeight: 500, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", borderLeft: `4px solid ${toast.type === "error" ? "#fc5c65" : "#43d787"}`, display: "flex", alignItems: "center", gap: "0.6rem" }}>
            {toast.type === "error" ? "❌" : "✅"} {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
};

export default Destination;
