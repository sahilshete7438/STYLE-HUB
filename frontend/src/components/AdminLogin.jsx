import { useState } from "react";
import { Key } from "lucide-react";
import "../styles/login.css";

function AdminLogin({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (
      (email === "admin@stylehub.com" && password === "admin1234") ||
      (isLocalhost && email === "admin@test.com" && password === "test123")
    ) {
      localStorage.setItem("isAdminLoggedIn", "true");
      onSuccess();
    } else {
      alert("Access Denied: Invalid Administrative Credentials.");
    }
  };

  return (
    <div className="auth-wrapper fade-in" style={{ minHeight: "75vh" }}>
      <div className="auth-card" style={{ borderTop: "4px solid var(--primary)", margin: "0 auto" }}>
        <div className="auth-header">
          <h1 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <Key size={24} /> Admin Portal
          </h1>
          <p>This section is restricted. Enter your administrative credentials.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="admin-email">Admin Email Address</label>
            <input
              id="admin-email"
              type="email"
              placeholder="admin@test.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-pass">Password</label>
            <input
              id="admin-pass"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn auth-btn" style={{ background: "var(--secondary)" }}>
            Verify & Enter
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
