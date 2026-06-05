import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Package, X, Star } from "lucide-react";
import "../styles/cart.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Write Review Modal States
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submittedReviews, setSubmittedReviews] = useState([]); // track order ids reviewed in session

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

  const handleOpenReviewModal = (order) => {
    setSelectedOrder(order);
    setRating(5);
    setComment("");
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setSubmittingReview(true);

    const authorName = localStorage.getItem("userName") || "Verified Customer";

    try {
      await axios.post("http://localhost:8080/reviews", {
        productId: selectedOrder.productId,
        author: authorName,
        rating: rating,
        comment: comment
      });

      alert("Review submitted successfully! Thank you for your feedback.");
      setSubmittedReviews([...submittedReviews, selectedOrder.id]);
      setIsReviewModalOpen(false);
      setSubmittingReview(false);
    } catch (err) {
      console.error("Error submitting review", err);
      alert("Failed to submit review. Try again.");
      setSubmittingReview(false);
    }
  };

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
                    <div className="order-meta-info" style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "4px" }}>
                      <span>Unit Price: ₹ {product?.price || 0}</span>
                      {order.size && (
                        <span>
                          Size: <strong style={{ color: "var(--secondary)" }}>{order.size}</strong>
                        </span>
                      )}
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
                      {order.status === "Delivered" && !submittedReviews.includes(order.id) && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => handleOpenReviewModal(order)}
                          style={{ padding: "6px 12px", fontSize: "0.72rem", marginLeft: "auto", height: "30px", display: "flex", alignItems: "center" }}
                        >
                          Write a Review
                        </button>
                      )}
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

      {/* Write Review Modal Overlay */}
      {isReviewModalOpen && selectedOrder && (
        <div className="product-modal-overlay" onClick={() => setIsReviewModalOpen(false)}>
          <div className="product-modal-card" style={{ maxWidth: "500px", gridTemplateColumns: "1fr" }} onClick={(e) => e.stopPropagation()}>
            <button className="product-modal-close" onClick={() => setIsReviewModalOpen(false)} aria-label="Close modal">
              <X size={18} />
            </button>
            <div className="product-modal-details-panel" style={{ padding: "30px" }}>
              <div className="product-modal-category">WRITE A REVIEW</div>
              <h2 className="product-modal-title" style={{ fontSize: "1.4rem", marginBottom: "8px" }}>
                Review: {selectedOrder.product?.name || `Product ID: ${selectedOrder.productId}`}
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-light)", marginBottom: "20px" }}>
                Your review will be shared publicly on the product's details page.
              </p>

              <form onSubmit={handleSubmitReview} className="review-modal-form">
                {/* Stars selector */}
                <div className="rating-select-container">
                  <label>Your Rating</label>
                  <div className="rating-select-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-select-btn ${rating >= star ? "active" : ""}`}
                        onClick={() => setRating(star)}
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star size={26} fill={rating >= star ? "var(--accent)" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment input */}
                <div className="form-group">
                  <label htmlFor="review-comment" style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--secondary)", marginBottom: "8px", display: "block" }}>
                    Your Review Comment
                  </label>
                  <textarea
                    id="review-comment"
                    rows="4"
                    placeholder="Describe your experience with this apparel. What is the fabric quality, sizing, and styling like?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    style={{ width: "100%", padding: "12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", outline: "none", resize: "vertical", fontFamily: "inherit", fontSize: "0.9rem" }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn"
                  disabled={submittingReview}
                  style={{ width: "100%", padding: "12px", backgroundColor: "var(--primary)" }}
                >
                  {submittingReview ? "Submitting Review..." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;