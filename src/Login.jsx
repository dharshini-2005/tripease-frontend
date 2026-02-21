import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleUsernameChange = (e) => setUsername(e.target.value);

 
  const toggleForm = () => {
    setIsRegister(!isRegister);
    setErrorMessage(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 

    if (isRegister) {
      
      try {
        const response = await axios.post(`${API_BASE_URL}/register`, {
          username,
          email,
          password,
        });
        if (response.status === 201) {
          alert("Registration successful!");
          setIsRegister(false); 
        }
      } catch (error) {
        const message = error.response ? error.response.data.error : "Registration failed! Please try again.";
        setErrorMessage(message); 
      }
    } else {
      
      try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
          email,
          password,
        });

        if (response.data.token) {
         
          localStorage.setItem("authToken", response.data.token);
          alert("Login successful!");
          navigate("/options");
        } else {
          setErrorMessage("Invalid email or password!");
        }
      } catch (error) {
        setErrorMessage("Invalid email or password!"); 
      }
    }
  };

  const backgroundImageStyle = {
    backgroundImage: 'url("https://images.unsplash.com/photo-1627666259356-03a116b7dde9?fm=jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100vw",
  };

  return (
    <div className="login-form" style={backgroundImageStyle}>
      <h1 className="title-main">TripEase</h1>
      <h2 className="slogan">Your Journey Your Story</h2>
      <h2 className="login">{isRegister ? "Register" : "Login"}</h2>

      <form onSubmit={handleSubmit} className="form-elements">
        {isRegister && (
          <div>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </div>
        )}
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit" className="login-button">
          {isRegister ? "Register" : "Login"}
        </button>
      </form>

     
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p onClick={toggleForm} className="toggle-form">
        {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
      </p>
    </div>
  );
};

export default Login;
