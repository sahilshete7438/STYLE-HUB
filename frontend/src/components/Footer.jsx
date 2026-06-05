import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer style={{
      backgroundColor: "var(--secondary)",
      color: "rgba(255, 255, 255, 0.7)",
      padding: "60px 20px 20px",
      marginTop: "auto",
      borderTop: "1px solid rgba(255, 255, 255, 0.05)"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "40px",
        textAlign: "left",
        marginBottom: "40px"
      }}>
        {/* Brand Column */}
        <div>
          <h3 style={{ color: "white", fontSize: "1.5rem", marginBottom: "15px", letterSpacing: "0.1em" }}>STYLEHUB</h3>
          <p style={{ fontSize: "0.9rem", lineHeight: "1.6", marginBottom: "20px" }}>
            Express your unique style with our curated collections. Quality fabrics, contemporary designs, and timeless appeal.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: "white", fontSize: "1.1rem", marginBottom: "15px" }}>Shop Collections</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: "10px" }}>
              <Link to="/men" style={{ fontSize: "0.9rem", color: "inherit", transition: "var(--transition)" }} onMouseOver={(e) => e.target.style.color = "white"} onMouseOut={(e) => e.target.style.color = "inherit"}>Men's Apparel</Link>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <Link to="/women" style={{ fontSize: "0.9rem", color: "inherit", transition: "var(--transition)" }} onMouseOver={(e) => e.target.style.color = "white"} onMouseOut={(e) => e.target.style.color = "inherit"}>Women's Apparel</Link>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <Link to="/kids" style={{ fontSize: "0.9rem", color: "inherit", transition: "var(--transition)" }} onMouseOver={(e) => e.target.style.color = "white"} onMouseOut={(e) => e.target.style.color = "inherit"}>Kids' Apparel</Link>
            </li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h4 style={{ color: "white", fontSize: "1.1rem", marginBottom: "15px" }}>Customer Care</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: "10px", fontSize: "0.9rem" }}>Track Orders</li>
            <li style={{ marginBottom: "10px", fontSize: "0.9rem" }}>Shipping Policy</li>
            <li style={{ marginBottom: "10px", fontSize: "0.9rem" }}>Returns & Exchanges</li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 style={{ color: "white", fontSize: "1.1rem", marginBottom: "15px" }}>Stay Updated</h4>
          <p style={{ fontSize: "0.9rem", marginBottom: "15px" }}>Subscribe to our newsletter to receive styling tips and special discount offers!</p>
          <div style={{ display: "flex", gap: "8px" }}>
            <input 
              type="email" 
              placeholder="Your email address" 
              style={{
                padding: "8px 12px",
                fontSize: "0.85rem",
                borderRadius: "4px",
                border: "none",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
                outline: "none"
              }} 
            />
            <button style={{
              padding: "8px 16px",
              fontSize: "0.85rem",
              borderRadius: "4px",
              backgroundColor: "var(--primary)",
              color: "white",
              border: "none",
              cursor: "pointer"
            }}>Join</button>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        paddingTop: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "15px",
        fontSize: "0.85rem"
      }}>
        <p>&copy; {new Date().getFullYear()} STYLEHUB. All rights reserved.</p>
        <p>Created for style-conscious individuals.</p>
      </div>
    </footer>
  );
}

export default Footer;