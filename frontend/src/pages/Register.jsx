import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  });

  const registerUser = async (e) => {
    e.preventDefault(); // Prevent page refresh if form is submitted

    if (!user.name || !user.email || !user.password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/users/register",
        user
      );

      alert("Registration Successful! You can now log in.");
      navigate("/login");
    } catch (err) {
      console.error("Register request error", err);
      alert("Registration failed. Please check details or network.");
    }
  };

  return (
    <div className="auth-wrapper fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join STYLEHUB and discover exclusive fashion updates</p>
        </div>

        <form onSubmit={registerUser}>
          <div className="form-group">
            <label htmlFor="reg-name">Full Name</label>
            <input
              id="reg-name"
              placeholder="John Doe"
              value={user.name}
              onChange={(e) =>
                setUser({ ...user, name: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
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
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
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
            Register
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;