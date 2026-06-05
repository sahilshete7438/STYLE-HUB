import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Package } from "lucide-react";
import "../styles/cart.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const userId = parseInt(localStorage.getItem("userId")) || 1;
    try {
      const [ordersRes, productsRes] = await Promise.all([
        axios.get(`http://localhost:8080/orders/user/${userId}`),
        axios.get("http://localhost:8080/products")
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading orders/products", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Correlate orders with actual product details
  const ordersWithProducts = orders.map((order) => {
    const product = products.find((p) => p.id === order.productId);
    return {
      ...order,
      product
    };
  });

  if (loading) {
    return (
      <div className="cart-container fade-in" style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Loading your orders...</h2>
      </div>
    );
  }

  return (
    <div className="cart-container fade-in">
      <h1 className="cart-title">My Orders</h1>

      {ordersWithProducts.length === 0 ? (
        <div className="cart-empty-state">
          <div className="cart-empty-icon" style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
            <Package size={64} style={{ color: "var(--text-light)" }} />
          </div>
          <h3>No orders placed yet</h3>
          <p>It looks like you haven't placed any orders yet. Explore our collections and grab something styled for you!</p>
          <Link to="/" className="btn">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {ordersWithProducts.map((order) => {
            const product = order.product;
            const statusClass = `badge badge-${order.status ? order.status.toLowerCase() : "pending"}`;
            
            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <span className="order-id">Order ID: #{order.id}</span>
                  <span className={statusClass}>
                    {order.status || "Pending"}
                  </span>
                </div>

                <div className="order-details-row">
                  <img
                    src={product?.image || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=150&q=80"}
                    alt={product?.name || "Product"}
                  />
                  <div className="order-info">
                    <h4 className="order-product-name">{product?.name || `Product ID: ${order.productId}`}</h4>
                    <div className="order-meta-info">
                      Unit Price: ₹ {product?.price || 0}
                    </div>
                    <div className="order-price-qty">
                      Total: ₹ {order.totalPrice} <span style={{ fontWeight: 400, fontSize: "0.85rem", color: "var(--text-light)" }}>({order.quantity} item{order.quantity > 1 ? "s" : ""})</span>
                    </div>
                    <div style={{ marginTop: "12px", display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center", borderTop: "1px dashed var(--border)", paddingTop: "10px" }}>
                      <span style={{ fontSize: "0.82rem", color: "var(--text-light)" }}>
                        Method: <strong style={{ color: "var(--secondary)" }}>{order.paymentMethod || "Cash on Delivery (COD)"}</strong>
                      </span>
                      <span style={{ fontSize: "0.82rem", color: "var(--text-light)", display: "flex", alignItems: "center", gap: "5px" }}>
                        Payment: 
                        <span className={`badge ${order.paymentStatus === "Paid" ? "badge-delivered" : "badge-pending"}`} style={{ padding: "2px 8px", fontSize: "0.68rem" }}>
                          {order.paymentStatus || "Pending"}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visual Order status timeline tracker */}
                {(() => {
                  const currentStatus = order.status || "Pending";
                  let stepLevel = 1;
                  if (currentStatus === "Shipped") stepLevel = 2;
                  if (currentStatus === "Delivered") stepLevel = 3;

                  let fillWidth = "0%";
                  if (stepLevel === 2) fillWidth = "50%";
                  if (stepLevel === 3) fillWidth = "100%";

                  return (
                    <div className="order-timeline-container">
                      <div className="order-timeline">
                        {/* Progress line */}
                        <div className="timeline-line-track">
                          <div
                            className={`timeline-line-fill ${stepLevel === 3 ? "completed" : ""}`}
                            style={{ width: fillWidth }}
                          ></div>
                        </div>

                        {/* Step 1: Placed */}
                        <div className={`timeline-step ${stepLevel >= 1 ? "completed" : ""}`}>
                          <div className="timeline-node">
                            {stepLevel >= 1 ? "✓" : "1"}
                          </div>
                        </div>

                        {/* Step 2: Shipped */}
                        <div className={`timeline-step ${stepLevel > 2 ? "completed" : stepLevel === 2 ? "active" : ""}`}>
                          <div className="timeline-node">
                            {stepLevel > 2 ? "✓" : "2"}
                          </div>
                        </div>

                        {/* Step 3: Delivered */}
                        <div className={`timeline-step delivered ${stepLevel === 3 ? "completed" : ""}`}>
                          <div className="timeline-node">
                            {stepLevel === 3 ? "✓" : "3"}
                          </div>
                        </div>
                      </div>

                      {/* Labels Row */}
                      <div className="timeline-labels-row">
                        <div className={`timeline-label-col ${stepLevel >= 1 ? "completed" : ""}`}>
                          Order Placed
                        </div>
                        <div className={`timeline-label-col ${stepLevel > 2 ? "completed" : stepLevel === 2 ? "active" : ""}`}>
                          Shipped
                        </div>
                        <div className={`timeline-label-col ${stepLevel === 3 ? "delivered-completed" : ""}`}>
                          Delivered
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Orders;