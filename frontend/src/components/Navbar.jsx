import { useState, useEffect } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Package, ShoppingCart, X } from "lucide-react";
import "../styles/navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        const res = await axios.get(`http://localhost:8080/cart/${userId}`);
        const totalItems = res.data.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalItems);
      } catch (err) {
        console.error("Error fetching cart count", err);
      }
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    // Check login state whenever route changes
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    setUserEmail(localStorage.getItem("userEmail") || "");
    
    if (loggedIn) {
      fetchCartCount();
    } else {
      setCartCount(0);
    }

    // Auto-close drawers on navigation
    setIsOpen(false);
    setIsAccountOpen(false);
  }, [location]);

  useEffect(() => {
    // Real-time update listener for cart modifications
    const handleCartUpdate = () => {
      fetchCartCount();
    };
    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setIsAccountOpen(false);
    navigate("/");
  };

  return (
    <>
      <header className="navbar-container">
        <div className="navbar">
          {/* Brand Name */}
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            STYLEHUB
          </Link>

          {/* Hamburger Toggle Button for Mobile */}
          <button 
            className={`mobile-toggle ${isOpen ? "active" : ""}`} 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Menu Wrapper (Slide-in on mobile) */}
          <div className={`nav-menu-wrapper ${isOpen ? "active" : ""}`}>
            <nav className="nav-links">
              <NavLink 
                to="/" 
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                onClick={closeMenu}
                end
              >
                Home
              </NavLink>
              <NavLink 
                to="/men" 
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                onClick={closeMenu}
              >
                Men
              </NavLink>
              <NavLink 
                to="/women" 
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                onClick={closeMenu}
              >
                Women
              </NavLink>
              <NavLink 
                to="/kids" 
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                onClick={closeMenu}
              >
                Kids
              </NavLink>
            </nav>

            <div className="nav-actions" style={{ display: "flex", alignItems: "center" }}>
              {isLoggedIn ? (
                <>
                  {/* Cart Icon & Badge */}
                  <Link 
                    to="/cart" 
                    className="cart-icon-btn" 
                    aria-label="Shopping Cart"
                    onClick={closeMenu}
                  >
                    <ShoppingCart size={22} />
                    {cartCount > 0 && (
                      <span className="cart-badge">{cartCount}</span>
                    )}
                  </Link>

                  {/* Account Button */}
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setIsAccountOpen(true)}
                    style={{ display: "flex", alignItems: "center", gap: "6px" }}
                  >
                    <User size={16} /> Account
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-secondary" onClick={closeMenu}>
                    Login
                  </Link>
                  <Link to="/register" className="btn" onClick={closeMenu}>
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Account Drawer Overlay */}
      <div 
        className={`account-drawer-overlay ${isAccountOpen ? "active" : ""}`}
        onClick={() => setIsAccountOpen(false)}
      ></div>

      {/* Account Sidebar Drawer */}
      <div className={`account-drawer ${isAccountOpen ? "active" : ""}`}>
        <div className="account-drawer-header">
          <h2>My Profile</h2>
          <button className="btn-close-drawer" onClick={() => setIsAccountOpen(false)} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={20} />
          </button>
        </div>

        <div className="account-profile-info">
          <div className="account-avatar">
            {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
          </div>
          <p style={{ fontWeight: 600, color: "var(--secondary)" }}>Active Member</p>
          <div className="account-email">{userEmail || "user@example.com"}</div>
        </div>

        <div className="account-drawer-links">
          <Link to="/orders" className="account-drawer-link" onClick={() => setIsAccountOpen(false)}>
            <Package size={18} /> My Orders
          </Link>
          <Link to="/cart" className="account-drawer-link" onClick={() => setIsAccountOpen(false)}>
            <ShoppingCart size={18} /> Shopping Cart
          </Link>
        </div>

        <button className="btn btn-logout" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </>
  );
}

export default Navbar;