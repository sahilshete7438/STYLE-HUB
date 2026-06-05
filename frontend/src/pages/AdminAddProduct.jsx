import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { LayoutDashboard, ShoppingBag, Package, PlusCircle } from "lucide-react";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/admin.css";

function AdminAddProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
    gender: "Men",
    stock: ""
  });

  useEffect(() => {
    const adminSession = localStorage.getItem("isAdminLoggedIn") === "true";
    if (!adminSession) {
      navigate("/admin");
    } else {
      setIsAdmin(true);
      
      // Check if we came here from editing a product
      if (location.state && location.state.editProduct) {
        const p = location.state.editProduct;
        setProduct({
          name: p.name,
          price: p.price.toString(),
          description: p.description || "",
          image: p.image || "",
          category: p.category || "",
          gender: p.gender,
          stock: p.stock.toString()
        });
        setIsEditing(true);
        setEditId(p.id);
      }
    }
  }, [navigate, location.state]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!product.name || !product.price || !product.gender) {
      alert("Please fill out required fields (Name, Price, Gender).");
      return;
    }

    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:8080/products/${editId}`,
          {
            ...product,
            price: parseFloat(product.price),
            stock: parseInt(product.stock) || 0
          }
        );
        alert("Product updated successfully!");
        navigate("/admin/products");
      } else {
        await axios.post(
          "http://localhost:8080/products",
          {
            ...product,
            price: parseFloat(product.price),
            stock: parseInt(product.stock) || 0
          }
        );
        alert("Product added successfully!");
        resetForm();
      }
    } catch (err) {
      console.error("Error saving product", err);
      alert(isEditing ? "Failed to update product." : "Failed to add product.");
    }
  };

  const resetForm = () => {
    setProduct({
      name: "",
      price: "",
      description: "",
      image: "",
      category: "",
      gender: "Men",
      stock: ""
    });
    setIsEditing(false);
    setEditId(null);
    if (isEditing) {
      navigate("/admin/products");
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center", color: "var(--text-light)" }}>
        <h2>Redirecting to admin portal...</h2>
      </div>
    );
  }

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
          <h1>{isEditing ? "Edit Product" : "Add Product"}</h1>

          {/* Add Product Form Box */}
          <div className="admin-form-card">
            <h2>{isEditing ? `Edit Product #${editId}` : "Add New Product"}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="admin-form-grid">
                <div className="admin-input-group">
                  <label htmlFor="prod-name">Product Name *</label>
                  <input
                    id="prod-name"
                    placeholder="e.g. Premium Cotton Tee"
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-input-group">
                  <label htmlFor="prod-price">Price (INR) *</label>
                  <input
                    id="prod-price"
                    type="number"
                    placeholder="e.g. 799"
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-input-group full-width">
                  <label htmlFor="prod-desc">Description</label>
                  <textarea
                    id="prod-desc"
                    rows="3"
                    placeholder="Tell customers about the fabric, fit, styling notes..."
                    value={product.description}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border)",
                      outline: "none",
                      fontFamily: "inherit",
                      resize: "vertical"
                    }}
                  />
                </div>

                <div className="admin-input-group">
                  <label htmlFor="prod-img">Image URL</label>
                  <input
                    id="prod-img"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={product.image}
                    onChange={(e) => setProduct({ ...product, image: e.target.value })}
                  />
                </div>

                <div className="admin-input-group">
                  <label htmlFor="prod-cat">Category</label>
                  <input
                    id="prod-cat"
                    placeholder="e.g. T-Shirts, Jeans, Outerwear"
                    value={product.category}
                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                  />
                </div>

                <div className="admin-input-group">
                  <label htmlFor="prod-gender">Gender Target *</label>
                  <select
                    id="prod-gender"
                    value={product.gender}
                    onChange={(e) => setProduct({ ...product, gender: e.target.value })}
                    required
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>

                <div className="admin-input-group">
                  <label htmlFor="prod-stock">Stock Units</label>
                  <input
                    id="prod-stock"
                    type="number"
                    placeholder="e.g. 50"
                    value={product.stock}
                    onChange={(e) => setProduct({ ...product, stock: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" className="btn btn-success">
                  {isEditing ? "Save Changes" : "Add Product Catalog"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  {isEditing ? "Cancel Edit" : "Clear Form"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminAddProduct;
