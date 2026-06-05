import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { LayoutDashboard, ShoppingBag, Package, Trash2, Pencil, PlusCircle } from "lucide-react";
import AdminLogin from "../components/AdminLogin";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/admin.css";

function AdminProducts() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [filterGender, setFilterGender] = useState("All");

  const loadProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error loading products catalog", err);
    }
  };

  useEffect(() => {
    const adminSession = localStorage.getItem("isAdminLoggedIn") === "true";
    if (!adminSession) {
      navigate("/admin");
    } else {
      setIsAdmin(true);
      loadProducts();
    }
  }, [navigate]);

  const handleAdminLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    setIsAdmin(false);
    navigate("/");
  };

  if (!isAdmin) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center", color: "var(--text-light)" }}>
        <h2>Redirecting to admin portal...</h2>
      </div>
    );
  }

  const startEdit = (p) => {
    navigate("/admin/add-product", { state: { editProduct: p } });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`http://localhost:8080/products/${id}`);
      loadProducts();
    } catch (err) {
      console.error("Error deleting product", err);
      alert("Failed to delete product.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <AdminNavbar />
      <div className="admin-container fade-in">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-title">Admin Console</div>
        <NavLink to="/admin" className={({ isActive }) => `admin-sidebar-link ${isActive ? "active" : ""}`} end style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <LayoutDashboard size={16} /> Dashboard
        </NavLink>
        <NavLink to="/admin/add-product" className={({ isActive }) => `admin-sidebar-link ${isActive ? "active" : ""}`} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <PlusCircle size={16} /> Add Product
        </NavLink>
        <NavLink to="/admin/products" className={({ isActive }) => `admin-sidebar-link ${isActive ? "active" : ""}`} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ShoppingBag size={16} /> Manage Products
        </NavLink>
        <NavLink to="/admin/orders" className={({ isActive }) => `admin-sidebar-link ${isActive ? "active" : ""}`} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Package size={16} /> Manage Orders
        </NavLink>
      </aside>

      {/* Main Content Area */}
      <main className="admin-content">
        <h1>Product Management</h1>

        {/* Filters Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px", margin: "25px 0 15px" }}>
          <h2>Inventory Catalog ({products.filter(p => filterGender === "All" || p.gender === filterGender).length} Products)</h2>
          
          <div className="admin-filter-bar">
            {["All", "Men", "Women", "Kids"].map((g) => (
              <button
                key={g}
                type="button"
                className={`filter-btn ${filterGender === g ? "active" : ""}`}
                onClick={() => setFilterGender(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-table-wrapper">
          {products.length === 0 ? (
            <p style={{ color: "var(--text-light)", padding: "20px 0" }}>No products in stock yet.</p>
          ) : products.filter(p => filterGender === "All" || p.gender === filterGender).length === 0 ? (
            <p style={{ color: "var(--text-light)", padding: "20px 0" }}>No products found for category: {filterGender}.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products
                  .filter(p => filterGender === "All" || p.gender === filterGender)
                  .map((p) => (
                    <tr key={p.id}>
                      <td>
                        <img
                          src={p.image || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=80&q=80"}
                          alt={p.name}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=80&q=80";
                          }}
                        />
                      </td>
                      <td>#{p.id}</td>
                      <td style={{ fontWeight: 600 }}>{p.name}</td>
                      <td>
                        <span className="badge" style={{ backgroundColor: "#e2e8f0", color: "#475569" }}>
                          {p.gender}
                        </span>
                      </td>
                      <td>₹ {p.price}</td>
                      <td>{p.stock} units</td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="btn btn-secondary"
                          style={{ 
                            padding: "6px 12px", 
                            fontSize: "0.8rem", 
                            display: "inline-flex", 
                            alignItems: "center", 
                            gap: "4px", 
                            marginRight: "8px",
                            height: "32px",
                            boxSizing: "border-box"
                          }}
                          onClick={() => startEdit(p)}
                        >
                          <Pencil size={12} /> Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ 
                            padding: "6px 12px", 
                            fontSize: "0.8rem", 
                            display: "inline-flex", 
                            alignItems: "center", 
                            gap: "4px",
                            height: "32px",
                            boxSizing: "border-box",
                            border: "2px solid transparent"
                          }}
                          onClick={() => deleteProduct(p.id)}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
    </div>
  );
}

export default AdminProducts;