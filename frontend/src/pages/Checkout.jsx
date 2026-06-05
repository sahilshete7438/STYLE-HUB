import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CreditCard, QrCode, Truck, ShieldCheck, MapPin, Check, ArrowRight, Lock } from "lucide-react";
import "../styles/checkout.css";

function Checkout() {
  const navigate = useNavigate();
  
  // Loading and product states
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    pincode: "",
    phone: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("card"); // card, upi, cod
  
  // Card Input States
  const [cardInfo, setCardInfo] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });

  // UPI Simulation Timer
  const [upiTimer, setUpiTimer] = useState(300); // 5 minutes in seconds
  const [upiPaymentScanned, setUpiPaymentScanned] = useState(false);

  // Sandbox Overlay States
  const [showOverlay, setShowOverlay] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0); // 0: Connecting, 1: Authorizing, 2: OTP (Card only), 3: Completing Order, 4: Success Receipt
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [txnId, setTxnId] = useState("");
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  // Load cart data on mount
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

      // Prepopulate shipping name from username if available
      const savedName = localStorage.getItem("userName") || "";
      setShippingInfo((prev) => ({ ...prev, fullName: savedName }));
    } catch (err) {
      console.error("Error loading checkout data", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // UPI countdown timer effect
  useEffect(() => {
    let interval = null;
    if (paymentMethod === "upi" && upiTimer > 0 && !upiPaymentScanned) {
      interval = setInterval(() => {
        setUpiTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [paymentMethod, upiTimer, upiPaymentScanned]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Card formatting helpers
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    // Add space after every 4 digits
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardInfo({ ...cardInfo, number: formattedValue });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardInfo({ ...cardInfo, expiry: value });
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3) value = value.slice(0, 3);
    setCardInfo({ ...cardInfo, cvv: value });
  };

  // Map cart items to products
  const cartWithProducts = cartItems.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return { ...item, product };
  });

  const subtotal = cartWithProducts.reduce((sum, item) => {
    const price = item.product ? item.product.price : 0;
    return sum + price * item.quantity;
  }, 0);

  const tax = Math.round(subtotal * 0.05);
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + tax + shipping;

  // Handle Form Submission / Initiate Sandbox Payment
  const handleCheckoutSubmit = (e) => {
    e.preventDefault();

    if (cartWithProducts.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Validation
    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.city || !shippingInfo.pincode || !shippingInfo.phone) {
      alert("Please complete the shipping address fields.");
      return;
    }

    if (paymentMethod === "card") {
      if (cardInfo.number.replace(/\s/g, "").length !== 16) {
        alert("Please enter a valid 16-digit card number.");
        return;
      }
      if (cardInfo.expiry.length !== 5) {
        alert("Please enter a valid card expiration date (MM/YY).");
        return;
      }
      if (cardInfo.cvv.length !== 3) {
        alert("Please enter a valid 3-digit CVV.");
        return;
      }
    }

    if (paymentMethod === "upi" && !upiPaymentScanned) {
      alert("Please scan the QR code and click 'Simulate App Scan Success' to approve the UPI request.");
      return;
    }

    // Trigger payment sandbox loader overlay
    setTxnId(`TXN${Math.floor(10000000 + Math.random() * 90000000)}`);
    setShowOverlay(true);
    startSandboxFlow();
  };

  // Sandbox micro-interactions simulation logic
  const startSandboxFlow = () => {
    setSimulationStep(0);
    
    // Step 0 -> Step 1 (Connecting -> Authorizing)
    setTimeout(() => {
      setSimulationStep(1);
      
      // Step 1 -> Step 2 or Step 3 (Authorizing -> OTP check or Order save)
      setTimeout(() => {
        if (paymentMethod === "card") {
          setSimulationStep(2); // Show OTP Input panel
        } else {
          saveOrderAndComplete(); // Skip directly to order completion for UPI and COD
        }
      }, 1500);
    }, 1500);
  };

  // OTP Input navigation logic
  const handleOtpChange = (index, value) => {
    const cleanValue = value.replace(/\D/g, "");
    if (!cleanValue) return;

    const newOtp = [...otpValues];
    newOtp[index] = cleanValue.slice(-1);
    setOtpValues(newOtp);

    // Focus next field
    if (index < 5 && cleanValue) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      const newOtp = [...otpValues];
      newOtp[index] = "";
      setOtpValues(newOtp);
      // Focus previous field
      if (index > 0) {
        otpRefs[index - 1].current.focus();
      }
    }
  };

  const handleOtpVerify = () => {
    const enteredOtp = otpValues.join("");
    if (enteredOtp === "123456") {
      setOtpError("");
      saveOrderAndComplete();
    } else {
      setOtpError("Invalid OTP code! Please use the test code 123456.");
    }
  };

  // Save order to Spring Boot and delete items from Cart
  const saveOrderAndComplete = async () => {
    setSimulationStep(3); // Completing Database records...
    const userId = parseInt(localStorage.getItem("userId")) || 1;
    
    let dbPaymentMethod = "Credit/Debit Card";
    let dbPaymentStatus = "Paid";
    
    if (paymentMethod === "upi") {
      dbPaymentMethod = "UPI QR Code";
    } else if (paymentMethod === "cod") {
      dbPaymentMethod = "Cash on Delivery (COD)";
      dbPaymentStatus = "Pending";
    }

    try {
      // 1. Post to order controller for each item
      const orderPromises = cartWithProducts.map((item) => {
        return axios.post("http://localhost:8080/orders", {
          userId: userId,
          productId: item.productId,
          quantity: item.quantity,
          totalPrice: (item.product?.price || 0) * item.quantity,
          status: "Pending",
          paymentMethod: dbPaymentMethod,
          paymentStatus: dbPaymentStatus
        });
      });
      await Promise.all(orderPromises);

      // 2. Clear items from the cart
      const deletePromises = cartItems.map((item) => {
        return axios.delete(`http://localhost:8080/cart/${item.id}`);
      });
      await Promise.all(deletePromises);

      // Trigger update event for Navbar count
      window.dispatchEvent(new Event("cart-updated"));

      // Complete simulation and show final receipt screen
      setTimeout(() => {
        setSimulationStep(4); // Success Receipt
      }, 1000);
    } catch (err) {
      console.error("Order processing error", err);
      alert("Order placement failed in backend database. Check console details.");
      setShowOverlay(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-container fade-in" style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Loading checkout details...</h2>
      </div>
    );
  }

  return (
    <div className="checkout-container fade-in">
      <h1 className="checkout-title">Checkout Securely</h1>

      <form onSubmit={handleCheckoutSubmit} className="checkout-layout">
        
        {/* Left Side Forms */}
        <div className="checkout-forms-section">
          
          {/* Shipping Address */}
          <div className="checkout-section-card">
            <h3><MapPin size={20} /> Shipping Address</h3>
            
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={shippingInfo.fullName}
                onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Delivery Address</label>
              <input
                id="address"
                type="text"
                placeholder="Flat / House No, Building, Street, Area"
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  placeholder="Mumbai"
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="pincode">Pincode</label>
                <input
                  id="pincode"
                  type="text"
                  placeholder="400001"
                  value={shippingInfo.pincode}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, pincode: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Mobile Number</label>
              <input
                id="phone"
                type="tel"
                placeholder="9876543210"
                value={shippingInfo.phone}
                onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="checkout-section-card">
            <h3><ShieldCheck size={20} /> Select Payment Method</h3>
            
            <div className="payment-tabs">
              <button
                type="button"
                className={`payment-tab-btn ${paymentMethod === "card" ? "active" : ""}`}
                onClick={() => setPaymentMethod("card")}
              >
                <CreditCard size={20} />
                Credit/Debit Card
              </button>

              <button
                type="button"
                className={`payment-tab-btn ${paymentMethod === "upi" ? "active" : ""}`}
                onClick={() => setPaymentMethod("upi")}
              >
                <QrCode size={20} />
                UPI / QR Code
              </button>

              <button
                type="button"
                className={`payment-tab-btn ${paymentMethod === "cod" ? "active" : ""}`}
                onClick={() => setPaymentMethod("cod")}
              >
                <Truck size={20} />
                Cash on Delivery
              </button>
            </div>

            {/* Credit/Debit Card Details form */}
            {paymentMethod === "card" && (
              <div className="card-details-panel fade-in">
                {/* Visual card card preview */}
                <div className="card-visual-mockup">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div className="card-chip"></div>
                    <span style={{ fontSize: "1.1rem", fontWeight: 700, fontStyle: "italic", opacity: 0.8 }}>VISA</span>
                  </div>
                  <div className="card-number-display">
                    {cardInfo.number || "•••• •••• •••• ••••"}
                  </div>
                  <div className="card-bottom-row">
                    <div>
                      <span style={{ display: "block", fontSize: "0.6rem", opacity: 0.6 }}>Card Holder</span>
                      <span className="card-holder-name">{cardInfo.name || "YOUR NAME"}</span>
                    </div>
                    <div>
                      <span style={{ display: "block", fontSize: "0.6rem", opacity: 0.6 }}>Expires</span>
                      <span>{cardInfo.expiry || "MM/YY"}</span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="cardName">Cardholder Name</label>
                  <input
                    id="cardName"
                    type="text"
                    placeholder="Enter name on card"
                    value={cardInfo.name}
                    onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value.toUpperCase() })}
                    required={paymentMethod === "card"}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    id="cardNumber"
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    value={cardInfo.number}
                    onChange={handleCardNumberChange}
                    required={paymentMethod === "card"}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cardExpiry">Expiry Date</label>
                    <input
                      id="cardExpiry"
                      type="text"
                      placeholder="MM/YY"
                      value={cardInfo.expiry}
                      onChange={handleExpiryChange}
                      required={paymentMethod === "card"}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cardCvv">CVV</label>
                    <input
                      id="cardCvv"
                      type="password"
                      placeholder="•••"
                      value={cardInfo.cvv}
                      onChange={handleCvvChange}
                      required={paymentMethod === "card"}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* UPI QR Scanner simulation panel */}
            {paymentMethod === "upi" && (
              <div className="upi-qr-panel fade-in">
                <h4>Scan QR Code to Pay</h4>
                <p style={{ color: "var(--text-light)", fontSize: "0.85rem", margin: "5px 0 15px 0" }}>
                  Scan using GPay, PhonePe, Paytm, or any UPI app.
                </p>

                <div className="upi-qr-wrapper">
                  <div className="upi-qr-scanner-line"></div>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=stylehub@icici%26pn=StyleHub%26am=${total}%26cu=INR`}
                    alt="Demo UPI QR Code"
                    style={{ width: "150px", height: "150px" }}
                  />
                </div>

                {upiPaymentScanned ? (
                  <div className="badge badge-delivered" style={{ padding: "8px 16px", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.85rem" }}>
                    <Check size={14} /> Scan Verified successfully!
                  </div>
                ) : (
                  <>
                    <div className="upi-timer">
                      Request expires in: <strong>{formatTime(upiTimer)}</strong>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setUpiPaymentScanned(true)}
                      style={{ marginTop: "10px", padding: "8px 16px", fontSize: "0.85rem" }}
                    >
                      Simulate App Scan Success
                    </button>
                  </>
                )}
              </div>
            )}

            {/* COD Confirmation notice */}
            {paymentMethod === "cod" && (
              <div className="card-details-panel fade-in" style={{ textAlign: "center", padding: "30px 20px" }}>
                <Truck size={36} style={{ color: "var(--primary)", marginBottom: "12px" }} />
                <h4 style={{ color: "var(--secondary)", fontWeight: 600 }}>Doorstep cash/card payment confirmed</h4>
                <p style={{ color: "var(--text-light)", fontSize: "0.88rem", marginTop: "6px", maxWidth: "400px", margin: "6px auto 0 auto" }}>
                  Your order will be packaged and shipped instantly. You can make payment via Cash, UPI QR code, or Debit/Credit card directly to the delivery personnel at your door.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Order Summary */}
        <div className="checkout-summary-section">
          <div className="checkout-summary-card">
            <h3>Order Summary</h3>
            
            {/* List items briefly */}
            <div className="checkout-items-preview">
              {cartWithProducts.map((item) => (
                <div key={item.id} className="checkout-item-preview-row">
                  <div>
                    <span className="checkout-item-preview-name" title={item.product?.name}>
                      {item.product?.name || `Product ID: ${item.productId}`}
                    </span>
                    <span className="checkout-item-preview-qty"> × {item.quantity}</span>
                  </div>
                  <div className="checkout-item-preview-price">
                    ₹ {(item.product?.price || 0) * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <hr style={{ margin: "15px 0" }} />

            <div className="summary-row">
              Subtotal: <span>₹ {subtotal}</span>
            </div>
            
            <div className="summary-row">
              Est. Tax (5%): <span>₹ {tax}</span>
            </div>

            <div className="summary-row">
              Shipping: <span>{shipping === 0 ? "FREE" : `₹ ${shipping}`}</span>
            </div>

            <div className="summary-row total">
              Total: <span>₹ {total}</span>
            </div>

            <button type="submit" className="btn pay-btn">
              {paymentMethod === "cod" ? "Place COD Order" : `Pay ₹ ${total}`} <ArrowRight size={18} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", marginTop: "20px", color: "var(--text-light)", fontSize: "0.78rem" }}>
              <Lock size={12} /> SSL 256-Bit Sandbox Security Protocols Active
            </div>
          </div>
        </div>
      </form>

      {/* Sandbox Transaction Processing Loader Overlay */}
      {showOverlay && (
        <div className="sandbox-overlay">
          <div className="sandbox-modal">
            
            {/* Phase 1: Processing steps & Loader */}
            {simulationStep < 2 && (
              <>
                <div className="sandbox-loader-spinner"></div>
                <h2>STYLEHUB Payment Sandbox</h2>
                <p style={{ color: "var(--text-light)", fontSize: "0.9rem", margin: "5px 0 25px 0" }}>
                  Please do not reload the page or click back. We are routing this request through secure sandbox channels.
                </p>
                
                <div className="sandbox-steps">
                  <div className={`sandbox-step ${simulationStep === 0 ? "active" : "completed"}`}>
                    <div className="sandbox-step-icon">
                      {simulationStep > 0 ? <Check size={12} /> : "1"}
                    </div>
                    <span>Initializing transaction secure tunnels...</span>
                  </div>

                  <div className={`sandbox-step ${simulationStep === 1 ? "active" : ""}`}>
                    <div className="sandbox-step-icon">2</div>
                    <span>Requesting tokenized clearance from gateway...</span>
                  </div>
                </div>
              </>
            )}

            {/* Phase 2: Card OTP Screen */}
            {simulationStep === 2 && (
              <div className="fade-in">
                <div className="otp-header">
                  <ShieldCheck size={40} style={{ color: "var(--primary)", marginBottom: "8px" }} />
                  <h2>3D Secure Verification</h2>
                  <p style={{ color: "var(--text-light)", fontSize: "0.88rem", marginTop: "4px" }}>
                    A sandbox verification SMS was sent to card-linked phone +91 •••••••210. Enter code to authorize:
                  </p>
                </div>

                <div className="otp-inputs-row">
                  {otpValues.map((val, idx) => (
                    <input
                      key={idx}
                      ref={otpRefs[idx]}
                      type="text"
                      maxLength="1"
                      className="otp-input"
                      value={val}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    />
                  ))}
                </div>

                <div className="otp-helper-info">
                  💡 Sandbox Test OTP Code: <strong>123456</strong>
                </div>

                {otpError && (
                  <p style={{ color: "var(--danger)", fontSize: "0.85rem", fontWeight: 600, marginBottom: "20px" }}>
                    ⚠️ {otpError}
                  </p>
                )}

                <div style={{ display: "flex", gap: "15px" }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: "10px" }}
                    onClick={() => setShowOverlay(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn"
                    style={{ flex: 1, padding: "10px", backgroundColor: "var(--primary)" }}
                    onClick={handleOtpVerify}
                  >
                    Verify & Pay
                  </button>
                </div>
              </div>
            )}

            {/* Phase 3: DB Order Storage progress */}
            {simulationStep === 3 && (
              <>
                <div className="sandbox-loader-spinner"></div>
                <h2>Finalizing Transaction...</h2>
                <p style={{ color: "var(--text-light)", fontSize: "0.9rem", margin: "5px 0 25px 0" }}>
                  Clearing items and writing orders database records in backend.
                </p>
                <div className="sandbox-steps">
                  <div className="sandbox-step completed">
                    <div className="sandbox-step-icon"><Check size={12} /></div>
                    <span>Securing transaction tunnels...</span>
                  </div>
                  <div className="sandbox-step completed">
                    <div className="sandbox-step-icon"><Check size={12} /></div>
                    <span>Gateway authorization approved.</span>
                  </div>
                  <div className="sandbox-step active">
                    <div className="sandbox-step-icon">3</div>
                    <span>Creating database orders...</span>
                  </div>
                </div>
              </>
            )}

            {/* Phase 4: Payment Receipt Screen */}
            {simulationStep === 4 && (
              <div className="fade-in">
                <div className="success-icon-container">
                  <Check size={40} />
                </div>
                <h2>Payment Successful!</h2>
                <p style={{ color: "var(--text-light)", fontSize: "0.88rem", marginTop: "4px" }}>
                  Thank you! Your order has been registered securely.
                </p>

                <div className="success-receipt">
                  <div className="receipt-row">
                    <span>Transaction ID:</span>
                    <strong>{txnId}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Payment Method:</span>
                    <span>{paymentMethod === "card" ? "Credit/Debit Card" : paymentMethod === "upi" ? "UPI QR Code" : "Cash on Delivery"}</span>
                  </div>
                  <div className="receipt-row">
                    <span>Customer Name:</span>
                    <span>{shippingInfo.fullName}</span>
                  </div>
                  <div className="receipt-row">
                    <span>Delivery Phone:</span>
                    <span>{shippingInfo.phone}</span>
                  </div>
                  <div className="receipt-row bold">
                    <span>Amount Paid:</span>
                    <span>₹ {total}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn"
                  style={{ width: "100%", padding: "12px", backgroundColor: "var(--success)" }}
                  onClick={() => {
                    setShowOverlay(false);
                    navigate("/orders");
                  }}
                >
                  View My Orders <ArrowRight size={16} />
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default Checkout;
