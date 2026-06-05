import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { LayoutDashboard, ShoppingBag, Package, PlusCircle, TrendingUp, DollarSign, Layers, CheckCircle } from "lucide-react";
import AdminLogin from "../components/AdminLogin";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/admin.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [genderFilter, setGenderFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");

  const loadData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        axios.get("http://localhost:8080/products"),
        axios.get("http://localhost:8080/orders")
      ]);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading dashboard data", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const adminSession = localStorage.getItem("isAdminLoggedIn") === "true";
    setIsAdmin(adminSession);
    if (adminSession) {
      loadData();
    }
  }, []);

  if (!isAdmin) {
    return (
      <AdminLogin
        onSuccess={() => {
          setIsAdmin(true);
          loadData();
        }}
      />
    );
  }

  // 1. Correlate orders with actual product details
  const ordersWithProducts = orders.map((order) => {
    const product = products.find((p) => p.id === order.productId);
    return {
      ...order,
      product
    };
  });

  // 2. Extract unique categories from products catalog dynamically
  const uniqueCategories = [
    ...new Set(products.map((p) => p.category).filter(Boolean))
  ];

  // 3. Filter orders reactively based on active state variables
  const filteredOrders = ordersWithProducts.filter((item) => {
    const matchGender = genderFilter === "All" || item.product?.gender === genderFilter;
    const matchCategory = categoryFilter === "All" || item.product?.category === categoryFilter;
    const matchStatus = statusFilter === "All" || item.status === statusFilter;
    
    let matchPayment = true;
    if (paymentFilter !== "All") {
      if (paymentFilter === "Card") {
        matchPayment = item.paymentMethod?.toLowerCase().includes("card") || false;
      } else if (paymentFilter === "UPI") {
        matchPayment = item.paymentMethod?.toLowerCase().includes("upi") || false;
      } else if (paymentFilter === "COD") {
        matchPayment = item.paymentMethod?.toLowerCase().includes("cod") || item.paymentMethod?.toLowerCase().includes("delivery") || false;
      }
    }

    return matchGender && matchCategory && matchStatus && matchPayment;
  });

  // 4. Calculate Sales Reports metrics based on filtered subset
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalItemsSold = filteredOrders.reduce((sum, order) => sum + order.quantity, 0);
  const totalOrdersCount = filteredOrders.length;
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  // 5. Calculate Department-wise overall metrics (retaining current filters except gender itself)
  const getDeptSales = (gender) => {
    const deptOrders = ordersWithProducts.filter((item) => {
      const matchCategory = categoryFilter === "All" || item.product?.category === categoryFilter;
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      let matchPayment = true;
      if (paymentFilter !== "All") {
        if (paymentFilter === "Card") matchPayment = item.paymentMethod?.toLowerCase().includes("card") || false;
        else if (paymentFilter === "UPI") matchPayment = item.paymentMethod?.toLowerCase().includes("upi") || false;
        else if (paymentFilter === "COD") matchPayment = item.paymentMethod?.toLowerCase().includes("cod") || item.paymentMethod?.toLowerCase().includes("delivery") || false;
      }
      return item.product?.gender === gender && matchCategory && matchStatus && matchPayment;
    });
    return deptOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  };

  const menSales = getDeptSales("Men");
  const womenSales = getDeptSales("Women");
  const kidsSales = getDeptSales("Kids");
  const overallDeptSales = menSales + womenSales + kidsSales;

  const menPercent = overallDeptSales > 0 ? Math.round((menSales / overallDeptSales) * 100) : 0;
  const womenPercent = overallDeptSales > 0 ? Math.round((womenSales / overallDeptSales) * 100) : 0;
  const kidsPercent = overallDeptSales > 0 ? Math.round((kidsSales / overallDeptSales) * 100) : 0;

  // 6. Calculate Top-Selling products list based on active filter
  const productSalesMap = {};
  filteredOrders.forEach((order) => {
    const pId = order.productId;
    if (pId) {
      if (!productSalesMap[pId]) {
        productSalesMap[pId] = {
          product: order.product,
          quantity: 0,
          revenue: 0
        };
      }
      productSalesMap[pId].quantity += order.quantity;
      productSalesMap[pId].revenue += order.totalPrice;
    }
  });

  const topSellingProducts = Object.values(productSalesMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

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

        {/* Main Console Content */}
        <main className="admin-content">
          <h1>
            <span>Dashboard Overview</span>
            <span style={{ fontSize: "0.85rem", fontWeight: 400, color: "var(--text-light)" }}>Real-Time Sales Report</span>
          </h1>

          {loading ? (
            <p>Loading sales statistics details...</p>
          ) : (
            <>
              {/* Dynamic Filtering Panel */}
              <div className="admin-dashboard-controls">
                <div className="admin-filter-bar">
                  <button
                    type="button"
                    className={`filter-btn ${genderFilter === "All" ? "active" : ""}`}
                    onClick={() => setGenderFilter("All")}
                  >
                    All Departments
                  </button>
                  <button
                    type="button"
                    className={`filter-btn ${genderFilter === "Men" ? "active" : ""}`}
                    onClick={() => setGenderFilter("Men")}
                  >
                    Men
                  </button>
                  <button
                    type="button"
                    className={`filter-btn ${genderFilter === "Women" ? "active" : ""}`}
                    onClick={() => setGenderFilter("Women")}
                  >
                    Women
                  </button>
                  <button
                    type="button"
                    className={`filter-btn ${genderFilter === "Kids" ? "active" : ""}`}
                    onClick={() => setGenderFilter("Kids")}
                  >
                    Kids
                  </button>
                </div>

                <div className="admin-dropdowns-group">
                  {/* Category Filter */}
                  <select
                    className="admin-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    aria-label="Category"
                  >
                    <option value="All">All Categories</option>
                    {uniqueCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  {/* Payment Method Filter */}
                  <select
                    className="admin-select"
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    aria-label="Payment Mode"
                  >
                    <option value="All">All Payments</option>
                    <option value="Card">Card Payments</option>
                    <option value="UPI">UPI Payments</option>
                    <option value="COD">COD Payments</option>
                  </select>

                  {/* Order Status Filter */}
                  <select
                    className="admin-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    aria-label="Order Status"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Stats Cards Grid */}
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <h3>Gross Revenue</h3>
                  <div className="admin-stat-value">₹ {totalRevenue.toLocaleString("en-IN")}</div>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-light)", marginTop: "4px" }}>
                    Total revenue generated
                  </p>
                </div>
                <div className="admin-stat-card">
                  <h3>Units Sold</h3>
                  <div className="admin-stat-value">{totalItemsSold}</div>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-light)", marginTop: "4px" }}>
                    Total item quantities purchased
                  </p>
                </div>
                <div className="admin-stat-card">
                  <h3>Total Orders</h3>
                  <div className="admin-stat-value">{totalOrdersCount}</div>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-light)", marginTop: "4px" }}>
                    Volume of checkout requests
                  </p>
                </div>
                <div className="admin-stat-card">
                  <h3>Avg Order Value</h3>
                  <div className="admin-stat-value">₹ {averageOrderValue.toLocaleString("en-IN")}</div>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-light)", marginTop: "4px" }}>
                    Average spend per customer
                  </p>
                </div>
              </div>

              {/* Graphical distribution and Top selling lists */}
              <div className="admin-dashboard-grid-split">
                
                {/* Department distribution progress bars */}
                <div className="admin-panel-card">
                  <h3>
                    <span>Sales Distribution</span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-light)", fontWeight: 400 }}>By Department</span>
                  </h3>
                  
                  <div className="dist-item">
                    <div className="dist-labels">
                      <span>Men's Department</span>
                      <strong>₹ {menSales.toLocaleString("en-IN")} ({menPercent}%)</strong>
                    </div>
                    <div className="dist-bar-track">
                      <div className="dist-bar-fill" style={{ width: `${menPercent}%`, backgroundColor: "#4f46e5" }}></div>
                    </div>
                  </div>

                  <div className="dist-item">
                    <div className="dist-labels">
                      <span>Women's Department</span>
                      <strong>₹ {womenSales.toLocaleString("en-IN")} ({womenPercent}%)</strong>
                    </div>
                    <div className="dist-bar-track">
                      <div className="dist-bar-fill" style={{ width: `${womenPercent}%`, backgroundColor: "#ec4899" }}></div>
                    </div>
                  </div>

                  <div className="dist-item">
                    <div className="dist-labels">
                      <span>Kids' Department</span>
                      <strong>₹ {kidsSales.toLocaleString("en-IN")} ({kidsPercent}%)</strong>
                    </div>
                    <div className="dist-bar-track">
                      <div className="dist-bar-fill" style={{ width: `${kidsPercent}%`, backgroundColor: "#10b981" }}></div>
                    </div>
                  </div>

                  <div style={{ marginTop: "25px", fontSize: "0.78rem", color: "var(--text-light)", borderTop: "1px dashed var(--border)", paddingTop: "15px" }}>
                    💡 Percentages show the sales volume share matching the current Category, Payment, and Status filter settings.
                  </div>
                </div>

                {/* Top-Selling Products list */}
                <div className="admin-panel-card">
                  <h3>Top Selling Products</h3>
                  <div className="top-selling-list">
                    {topSellingProducts.length === 0 ? (
                      <p style={{ color: "var(--text-light)", fontSize: "0.9rem" }}>No items sold under active filter parameters.</p>
                    ) : (
                      topSellingProducts.map((item, idx) => (
                        <div className="top-product-item" key={idx}>
                          <img
                            src={item.product?.image || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=50&q=80"}
                            alt={item.product?.name || "Product"}
                            className="top-product-img"
                          />
                          <div className="top-product-info">
                            <div className="top-product-name">{item.product?.name || `Product ID: ${item.product?.id}`}</div>
                            <div className="top-product-stats">
                              Qty: <strong>{item.quantity}</strong> sold | {item.product?.gender} • {item.product?.category}
                            </div>
                          </div>
                          <div className="top-product-revenue">
                            ₹ {item.revenue.toLocaleString("en-IN")}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Recent Transactions Ledger */}
              <div className="admin-panel-card" style={{ marginBottom: "20px" }}>
                <h3 style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Customer Transaction Ledger</span>
                  <Link to="/admin/orders" className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    Manage Statuses <ArrowRight size={12} />
                  </Link>
                </h3>

                {filteredOrders.length === 0 ? (
                  <p style={{ color: "var(--text-light)", padding: "15px 0", fontSize: "0.9rem" }}>No customer transactions match your filter requirements.</p>
                ) : (
                  <div className="admin-table-wrapper">
                    <table className="admin-table" style={{ width: "100%" }}>
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Product Details</th>
                          <th>Qty</th>
                          <th>Revenue</th>
                          <th>Payment Mode</th>
                          <th>Ship Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => {
                          const product = order.product;
                          const shipClass = `badge badge-${order.status ? order.status.toLowerCase() : "pending"}`;
                          const payClass = order.paymentStatus === "Paid" ? "admin-table-status badge-delivered" : "admin-table-status badge-pending";
                          
                          return (
                            <tr key={order.id}>
                              <td style={{ fontWeight: 600 }}>#{order.id}</td>
                              <td>
                                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                  <img
                                    src={product?.image || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=50&q=80"}
                                    alt={product?.name || "Product"}
                                  />
                                  <div>
                                    <div style={{ fontWeight: 600, color: "var(--secondary)" }}>
                                      {product?.name || `Product ID: ${order.productId}`}
                                    </div>
                                    <div style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>
                                      {product?.gender} • {product?.category} {order.size && `• Size: ${order.size}`}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>{order.quantity}</td>
                              <td style={{ fontWeight: 700 }}>₹ {order.totalPrice.toLocaleString("en-IN")}</td>
                              <td>
                                <div style={{ fontSize: "0.82rem", fontWeight: 500 }}>{order.paymentMethod || "COD"}</div>
                                <div className={payClass} style={{ fontSize: "0.62rem", padding: "1px 5px", marginTop: "2px" }}>
                                  {order.paymentStatus || "Pending"}
                                </div>
                              </td>
                              <td>
                                <span className={shipClass} style={{ fontSize: "0.68rem" }}>
                                  {order.status || "Pending"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

// Add a helper icon because we aren't using the ArrowRight directly from local package if not imported.
// ArrowRight was imported in lucide-react above.
const ArrowRight = ({ size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

export default AdminDashboard;