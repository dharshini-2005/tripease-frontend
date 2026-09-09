import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const features = [
  {
    icon: "🗺️",
    title: "Travel Plans",
    desc: "Plan your trips with source, destination and travel dates.",
    route: "/plan",
    color: "#6C63FF",
  },
  {
    icon: "💰",
    title: "Budget Tracker",
    desc: "Track your travel expenses and stay within your budget.",
    route: "/budget",
    color: "#f7b731",
  },
  {
    icon: "✅",
    title: "Packing Checklist",
    desc: "Never forget essentials — build custom packing lists.",
    route: "/checklists",
    color: "#43d787",
  },
  {
    icon: "⭐",
    title: "Travel Feedback",
    desc: "Rate places you've visited and share your experience.",
    route: "/feedbacks",
    color: "#FF6584",
  },
  {
    icon: "🔍",
    title: "Destination Search",
    desc: "Explore attractions, hotels, restaurants and more for any city.",
    route: "/destination",
    color: "#00c6ff",
  },
];

const Options = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 55%, #0f3460 100%)",
      paddingTop: "64px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      <Navbar />

      {/* Decorative blobs */}
      <div style={{
        position: "fixed", top: "-120px", right: "-120px",
        width: "420px", height: "420px", borderRadius: "50%",
        background: "rgba(108,99,255,0.18)", filter: "blur(80px)", pointerEvents: "none"
      }} />
      <div style={{
        position: "fixed", bottom: "-100px", left: "-100px",
        width: "350px", height: "350px", borderRadius: "50%",
        background: "rgba(255,101,132,0.13)", filter: "blur(70px)", pointerEvents: "none"
      }} />

      {/* Header */}
      <div style={{ textAlign: "center", padding: "3rem 1rem 2.5rem", color: "#fff" }}>
        <div style={{
          display: "inline-block",
          background: "rgba(108,99,255,0.2)",
          border: "1px solid rgba(108,99,255,0.4)",
          color: "#c4bfff",
          padding: "0.3rem 1.2rem",
          borderRadius: "50px",
          fontSize: "0.8rem",
          fontWeight: 700,
          letterSpacing: "2px",
          textTransform: "uppercase",
          marginBottom: "1rem"
        }}>
          Welcome back ✈️
        </div>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, marginBottom: "0.5rem" }}>
          What would you like to do?
        </h1>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1.05rem" }}>
          Pick a feature to get started on your travel journey.
        </p>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "1.4rem",
        maxWidth: "780px",
        width: "100%",
        padding: "0 1.5rem 3rem",
      }} className="options-cards-grid">
        {features.map((f) => (
          <OptionCard key={f.route} feature={f} onClick={() => navigate(f.route)} />
        ))}
      </div>
    </div>
  );
};

const OptionCard = ({ feature, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "20px",
        padding: "2.2rem 1.8rem",
        cursor: "pointer",
        transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.8rem",
        color: "#fff",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.background = "rgba(255,255,255,0.11)";
        e.currentTarget.style.borderColor = feature.color + "88";
        e.currentTarget.style.boxShadow = `0 16px 40px ${feature.color}33`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Glow blob inside card */}
      <div style={{
        position: "absolute", top: "-30px", right: "-30px",
        width: "100px", height: "100px", borderRadius: "50%",
        background: feature.color + "22", filter: "blur(30px)", pointerEvents: "none"
      }} />

      <div style={{
        fontSize: "3rem",
        background: feature.color + "22",
        width: "72px", height: "72px",
        borderRadius: "18px",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: `1px solid ${feature.color}44`,
        marginBottom: "0.3rem",
      }}>
        {feature.icon}
      </div>

      <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#fff" }}>{feature.title}</h3>
      <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{feature.desc}</p>

      <div style={{
        marginTop: "0.5rem",
        fontSize: "0.82rem",
        color: feature.color,
        fontWeight: 700,
        display: "flex", alignItems: "center", gap: "0.3rem"
      }}>
        Open → 
      </div>
    </div>
  );
};

export default Options;
