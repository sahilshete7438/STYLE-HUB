import { useState } from "react";
import axios from "axios";
import { ShoppingBag, X, Star, Plus, Minus } from "lucide-react";
import "../styles/product.css";

function ProductCard({ product }) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  // Modal state variables
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const handleOpenModal = async () => {
    setIsModalOpen(true);
    setQuantity(1);
    setLoadingReviews(true);
    try {
      const res = await axios.get(`http://localhost:8080/reviews/product/${product.id}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Quick Add (direct click on card button, quantity = 1)
  const handleQuickAdd = async (e) => {
    e.stopPropagation(); // Prevent opening the details modal
    
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      alert("Please log in to add items to your cart!");
      return;
    }

    const userId = parseInt(localStorage.getItem("userId")) || 1;

    try {
      await axios.post("http://localhost:8080/cart", {
        userId: userId,
        productId: product.id,
        quantity: 1
      });
      
      // Notify navbar to refresh count
      window.dispatchEvent(new Event("cart-updated"));
      
      // Trigger toast
      setToastMessage(`${product.name} added to cart!`);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2500);

    } catch (err) {
      console.error("Error adding product to cart", err);
      alert("Failed to add product to cart");
    }
  };

  // Modal Add (custom quantity & size selection)
  const handleModalAdd = async () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      alert("Please log in to add items to your cart!");
      return;
    }

    const userId = parseInt(localStorage.getItem("userId")) || 1;

    try {
      await axios.post("http://localhost:8080/cart", {
        userId: userId,
        productId: product.id,
        quantity: quantity
      });
      
      // Notify navbar to refresh count
      window.dispatchEvent(new Event("cart-updated"));
      
      // Close modal
      setIsModalOpen(false);

      // Trigger toast
      setToastMessage(`${quantity} × ${product.name} (${selectedSize}) added to cart!`);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2500);

    } catch (err) {
      console.error("Error adding product to cart", err);
      alert("Failed to add product to cart");
    }
  };

  const incrementQty = () => {
    if (quantity < (product.stock || 99)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Pre-configured custom mock reviews
  const mockReviews = [
    { author: "Aarav S.", rating: 5, comment: "Fits like a glove! The organic cotton fabric is incredibly soft and breathable. Highly recommend!" },
    { author: "Neha K.", rating: 4, comment: "Really nice colors and holds up well after multiple washes. I suggest sizing up if you like a loose fit." },
    { author: "Vikram R.", rating: 5, comment: "Exceeded my expectations. The tailoring detail and sleeve design feels very high-end." }
  ];

  const reviewsToDisplay = reviews && reviews.length > 0 ? reviews : mockReviews;
  const totalReviewsCount = reviewsToDisplay.length;
  const averageRating = totalReviewsCount > 0
    ? (reviewsToDisplay.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount).toFixed(1)
    : "0.0";

  return (
    <>
      {/* Product Grid Card */}
      <div className="product-card fade-in" onClick={handleOpenModal}>
        {/* Product Tag Badge */}
        {product.gender && (
          <span className="product-badge">{product.gender}</span>
        )}

        {/* Image zoom wrapper */}
        <div className="product-img-wrapper">
          <img
            src={product.image || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80"}
            alt={product.name}
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80";
            }}
          />
        </div>

        <div className="product-info">
          <h3>{product.name}</h3>
          <p>{product.description || "No description available."}</p>

          <div className="product-price-row">
            <h4>₹ {product.price}</h4>
            <button onClick={handleQuickAdd}>
              Add To Cart
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Modal Overlay */}
      {isModalOpen && (
        <div className="product-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="product-modal-card" onClick={(e) => e.stopPropagation()}>
            
            {/* Close Button */}
            <button className="product-modal-close" onClick={() => setIsModalOpen(false)} aria-label="Close modal">
              <X size={18} />
            </button>

            {/* Left Panel: Image */}
            <div className="product-modal-image-panel">
              <img
                src={product.image || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=500&q=80"}
                alt={product.name}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=500&q=80";
                }}
              />
              <span className="product-badge" style={{ top: "25px", left: "25px" }}>{product.gender}</span>
            </div>

            {/* Right Panel: Content Details */}
            <div className="product-modal-details-panel">
              <div className="product-modal-category">{product.category || "Apparel"}</div>
              <h2 className="product-modal-title">{product.name}</h2>
              
              {/* Stars & Reviews summary */}
              <div className="product-modal-rating">
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      fill={parseFloat(averageRating) >= star ? "var(--accent)" : "none"}
                      stroke="var(--accent)"
                    />
                  ))}
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-light)" }}>
                  {averageRating} ({totalReviewsCount} verified review{totalReviewsCount !== 1 ? "s" : ""})
                </span>
              </div>

              <div className="product-modal-price">₹ {product.price}</div>
              
              <p className="product-modal-desc">
                {product.description || "Indulge in premium quality crafted with premium blended thread patterns, offering maximum flexibility and durable fits. Designed for style, comfort, and regular daily use."}
              </p>

              {/* Size Selectors */}
              <div className="size-selection-section">
                <h4>Select Size</h4>
                <div className="sizes-grid">
                  {["S", "M", "L", "XL"].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      className={`size-option-btn ${selectedSize === sz ? "active" : ""}`}
                      onClick={() => setSelectedSize(sz)}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specifications Table */}
              <div className="specs-section">
                <h4>Product Details</h4>
                <table className="specs-table">
                  <tbody>
                    <tr>
                      <td>Fabric</td>
                      <td>85% Soft Cotton, 15% Organic Viscose</td>
                    </tr>
                    <tr>
                      <td>Fit / Style</td>
                      <td>Regular Comfort Fit</td>
                    </tr>
                    <tr>
                      <td>Availability</td>
                      <td>
                        {product.stock > 0 ? (
                          <span style={{ color: "var(--success)", fontWeight: 600 }}>In Stock</span>
                        ) : (
                          <span style={{ color: "var(--danger)", fontWeight: 600 }}>Out of Stock</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Actions row: Qty Selector + Add Button */}
              <div className="modal-action-row">
                <div className="quantity-stepper">
                  <button type="button" onClick={decrementQty} aria-label="Decrease quantity">
                    <Minus size={16} />
                  </button>
                  <span>{quantity}</span>
                  <button type="button" onClick={incrementQty} aria-label="Increase quantity">
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  type="button"
                  className="btn modal-add-btn"
                  onClick={handleModalAdd}
                  disabled={product.stock <= 0}
                  style={{ opacity: product.stock <= 0 ? 0.6 : 1 }}
                >
                  Add To Cart <ShoppingBag size={16} />
                </button>
              </div>

              {/* Reviews List */}
              <div className="reviews-section">
                <h4>Customer Reviews</h4>
                {loadingReviews ? (
                  <p style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>Loading reviews...</p>
                ) : (
                  <div className="reviews-scroller">
                    {reviewsToDisplay.map((rev, idx) => (
                      <div className="review-item" key={idx}>
                        <div className="review-header">
                          <span className="review-author">{rev.author}</span>
                          <div className="rating-stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={11}
                                fill={rev.rating >= star ? "var(--accent)" : "none"}
                                stroke={rev.rating >= star ? "none" : "var(--border)"}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="review-comment">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Toast Notification Container */}
      {showToast && (
        <div className="toast-notification" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ShoppingBag size={18} />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}

export default ProductCard;