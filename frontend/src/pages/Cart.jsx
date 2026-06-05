import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShoppingCart, Trash2 } from "lucide-react";
import "../styles/cart.css";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const userId = parseInt(localStorage.getItem("userId")) || 1;
    try {
      const [cartRes, productsRes] = await Promise.all([
        axios.get(`http://localhost:8080/cart/${userId}`),
        axios.get("http://localhost:8080/products")
      ]);
      setCartItems(cartRes.data);
      setProducts(productsRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading cart/products data", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const removeItem = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/cart/${id}`);
      loadData();
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error("Error removing cart item", err);
    }
  };

  // Map cart items to actual product details
  const cartWithProducts = cartItems.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      ...item,
      product
    };
  });

  // Calculate pricing breakdown
  const subtotal = cartWithProducts.reduce((sum, item) => {
    const price = item.product ? item.product.price : 0;
    return sum + (price * item.quantity);
  }, 0);

  const tax = Math.round(subtotal * 0.05); // 5% Tax
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99; // Free shipping over 999
  const total = subtotal + tax + shipping;

  // Navigation to checkout handled via button click below

  if (loading) {
    return (
      <div className="cart-container fade-in" style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Loading your cart...</h2>
      </div>
    );
  }

  return (
    <div className="cart-container fade-in">
      <h1 className="cart-title">My Cart</h1>

      {cartWithProducts.length === 0 ? (
        <div className="cart-empty-state">
          <div className="cart-empty-icon" style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
            <ShoppingCart size={64} style={{ color: "var(--text-light)" }} />
          </div>
          <h3>Your cart is empty</h3>
          <p>It looks like you haven't added any products to your cart yet. Let's find some amazing style gear!</p>
          <Link to="/" className="btn">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Cart items list */}
          <div className="cart-items-list">
            {cartWithProducts.map((item) => {
              const product = item.product;
              return (
                <div key={item.id} className="cart-item-card">
                  <img
                    className="cart-item-img"
                    src={product?.image || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=150&q=80"}
                    alt={product?.name || "Product"}
                  />
                  
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{product?.name || `Product ID: ${item.productId}`}</h3>
                    <p className="cart-item-meta">{product?.description || "High quality apparel style description."}</p>
                    <div className="cart-item-price">₹ {product?.price || 0}</div>
                  </div>

                  <div className="cart-item-qty">
                    Qty: <strong>{item.quantity}</strong>
                  </div>

                  <button 
                    className="btn-remove" 
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Checkout summary panel */}
          <div className="cart-summary-card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              Subtotal: <span>₹ {subtotal}</span>
            </div>
            <div className="summary-row">
              Est. Tax (5%): <span>₹ {tax}</span>
            </div>
            <div className="summary-row">
              Shipping: <span>{shipping === 0 ? "FREE" : `₹ ${shipping}`}</span>
            </div>
            {shipping > 0 && (
              <p style={{ fontSize: "0.75rem", color: "var(--text-light)", marginTop: "-10px", marginBottom: "15px" }}>
                Add ₹{999 - subtotal} more for free shipping!
              </p>
            )}
            
            <div className="summary-row total">
              Total: <span>₹ {total}</span>
            </div>

            <button className="btn checkout-btn" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;