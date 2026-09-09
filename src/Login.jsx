import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import BASE_URL from "./config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      if (isRegister) {
        const response = await axios.post(`${BASE_URL}/register`, { username, email, password });
        if (response.status === 201) {
          setSuccessMessage("Account created! Please log in.");
          setIsRegister(false);
          setEmail("");
          setPassword("");
          setUsername("");
        }
      } else {
        const response = await axios.post(`${BASE_URL}/login`, { email, password });
        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
          navigate("/options");
        } else {
          setErrorMessage("Invalid email or password.");
        }
      }
    } catch (error) {
      const msg = error.response?.data?.error || (isRegister ? "Registration failed." : "Invalid email or password.");
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero-section">
      <Navbar />
      <div className="hero-bg" />
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-badge">🌍 Travel Smarter</div>
        <h1 className="hero-title">
          Trip<span className="highlight">Ease</span>
        </h1>
        <p className="hero-slogan">Your Journey, Your Story — Plan it beautifully.</p>

        <div className="auth-card">
          <h2 className="auth-title">{isRegister ? "Create Account" : "Welcome Back"}</h2>

          {errorMessage && <div className="error-banner">{errorMessage}</div>}
          {successMessage && <div className="success-banner">{successMessage}</div>}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="auth-field">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="auth-switch">
            {isRegister ? (
              <>Already have an account?{" "}<span onClick={toggleForm}>Sign in</span></>
            ) : (
              <>Don't have an account?{" "}<span onClick={toggleForm}>Register</span></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
