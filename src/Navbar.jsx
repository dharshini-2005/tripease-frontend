import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLogin = location.pathname === "/";

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate(isLogin ? "/" : "/options")} style={{ cursor: "pointer" }}>
        <span className="nav-logo">✈️</span>
        <span>Trip<span>Ease</span></span>
      </div>
      <div className="navbar-actions">
        {!isLogin && location.pathname !== "/options" && (
          <button className="btn-nav btn-nav-ghost" onClick={() => navigate("/options")}>
            🏠 Dashboard
          </button>
        )}
        {!isLogin && (
          <button className="btn-nav btn-nav-danger" onClick={handleLogout}>
            🚪 Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
