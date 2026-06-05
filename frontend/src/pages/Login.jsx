import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const loginUser = async (e) => {
    e.preventDefault(); // Prevent page refresh if form is submitted

    if (!user.email || !user.password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/users/login",
        user
      );
      
      if (response.data && response.data.id) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", response.data.id.toString());
        localStorage.setItem("userEmail", response.data.email);
        localStorage.setItem("userName", response.data.name);
        
        alert(`Welcome back, ${response.data.name}!`);
        navigate("/");
      } else {
        alert("Invalid Email or Password");
      }
    } catch (err) {
      console.error("Login request error", err);
      alert("Login failed. Check your network or credentials.");
    }
  };

  return (
    <div className="auth-wrapper fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Please enter your credentials to access your account</p>
        </div>

        <form onSubmit={loginUser}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={user.email}
              onChange={(e) =>
                setUser({ ...user, email: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={user.password}
              onChange={(e) =>
                setUser({ ...user, password: e.target.value })
              }
              required
            />
          </div>

          <button type="submit" className="btn auth-btn">
            Login
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;