import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { LayoutDashboard, ShoppingBag, Package, Truck, Check, PlusCircle } from "lucide-react";
import AdminLogin from "../components/AdminLogin";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/admin.css";

function AdminOrders() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        axios.get("http://localhost:8080/orders"),
        axios.get("http://localhost:8080/products")
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading admin orders/products", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const adminSession = localStorage.getItem("isAdminLoggedIn") === "true";
    if (!adminSession) {
      navigate("/admin");
    } else {
      setIsAdmin(true);
      loadData();
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

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8080/orders/${id}/${status}`);
      loadData();
    } catch (err) {
      console.error("Error updating order status", err);
      alert("Failed to update status.");
    }
  };

  // Correlate order productId with actual products
  const ordersWithProducts = orders.map((order) => {
    const product = products.find((p) => p.id === order.productId);
    return {
      ...order,
      product
    };
  });

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
        <h1>Customer Orders</h1>

        {loading ? (
          <p>Loading orders details...</p>
        ) : ordersWithProducts.length === 0 ? (
          <p style={{ color: "var(--text-light)", padding: "20px 0" }}>No customer orders placed yet.</p>
        ) : (
          <div className="admin-orders-list">
            {ordersWithProducts.map((order) => {
              const product = order.product;
              const statusClass = `badge badge-${order.status ? order.status.toLowerCase() : "pending"}`;

              return (
                <div key={order.id} className="admin-order-item">
                  <div className="admin-order-row">
                    {/* Order Meta details */}
                    <div>
                      <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--secondary)", marginBottom: "4px" }}>
                        Order ID: #{order.id}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>
                        User ID: #{order.userId}
                      </div>
                    </div>

                    {/* Order status badge */}
                    <div>
                      <span className={statusClass}>
                        {order.status || "Pending"}
                      </span>
                    </div>

                    {/* Order total info */}
                    <div>
                      <strong style={{ fontSize: "1.1rem" }}>Total: ₹ {order.totalPrice}</strong>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-light)", marginTop: "4px" }}>
                        {order.paymentMethod || "COD (Legacy)"} - <span className={`badge ${order.paymentStatus === "Paid" ? "badge-delivered" : "badge-pending"}`} style={{ padding: "2px 6px", fontSize: "0.6rem", textTransform: "none" }}>{order.paymentStatus || "Pending"}</span>
                      </div>
                    </div>

                    {/* Actions buttons */}
                    <div className="admin-order-actions">
                      <button
                        className="btn btn-secondary"
                        onClick={() => updateStatus(order.id, "Shipped")}
                        disabled={order.status === "Shipped" || order.status === "Delivered"}
                        style={{ 
                          opacity: (order.status === "Shipped" || order.status === "Delivered") ? 0.5 : 1,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          height: "32px",
                          boxSizing: "border-box",
                          padding: "6px 12px",
                          fontSize: "0.8rem"
                        }}
                      >
                        <Truck size={14} /> Ship
                      </button>

                      <button
                        className="btn btn-success"
                        onClick={() => updateStatus(order.id, "Delivered")}
                        disabled={order.status === "Delivered"}
                        style={{ 
                          opacity: order.status === "Delivered" ? 0.5 : 1,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          height: "32px",
                          boxSizing: "border-box",
                          padding: "6px 12px",
                          fontSize: "0.8rem",
                          border: "2px solid transparent"
                        }}
                      >
                        <Check size={14} /> Deliver
                      </button>
                    </div>
                  </div>

                  <hr style={{ margin: "15px 0" }} />

                  {/* Product Details row */}
                  <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                    <img
                      src={product?.image || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=60&q=80"}
                      alt={product?.name || "Product"}
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "var(--radius-sm)",
                        objectFit: "cover",
                        backgroundColor: "#f1f5f9"
                      }}
                    />
                    <div>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--secondary)" }}>
                        {product?.name || `Product ID: ${order.productId}`}
                      </h4>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-light)", marginTop: "2px" }}>
                        Unit Price: ₹ {product?.price || 0} | Quantity: {order.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
    </div>
  );
}

export default AdminOrders;