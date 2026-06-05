import { Link, useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import "../styles/admin.css";

function AdminNavbar() {
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/admin");
  };

  return (
    <nav className="admin-navbar">
      {/* Brand logo */}
      <Link to="/admin" className="admin-nav-brand">
        STYLEHUB <span className="admin-nav-brand-badge">ADMIN</span>
      </Link>

      {/* Admin actions */}
      <div className="admin-nav-actions">
        <Link to="/" className="admin-nav-link">
          <Globe size={16} /> View Store
        </Link>
        <button onClick={handleAdminLogout} className="admin-nav-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;
