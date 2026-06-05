import { useState } from "react";
import axios from "axios";
import { ShoppingBag } from "lucide-react";
import "../styles/product.css";

function ProductCard({ product }) {
  const [showToast, setShowToast] = useState(false);

  const addToCart = async () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      alert("Please log in to add items to your cart!");
      return;
    }

    const userId = parseInt(localStorage.getItem("userId")) || 1;

    try {
      await axios.post(
        "http://localhost:8080/cart",
        {
          userId: userId,
          productId: product.id,
          quantity: 1
        }
      );
      
      // Notify navbar to refresh count
      window.dispatchEvent(new Event("cart-updated"));
      
      // Trigger soft toast notification
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2500);

    } catch (err) {
      console.error("Error adding product to cart", err);
      alert("Failed to add product to cart");
    }
  };

  return (
    <div className="product-card fade-in">
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
          <button onClick={addToCart}>
            Add To Cart
          </button>
        </div>
      </div>

      {/* Toast Notification Container */}
      {showToast && (
        <div className="toast-notification" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ShoppingBag size={18} />
          <span>{product.name} added to cart!</span>
        </div>
      )}
    </div>
  );
}

export default ProductCard;