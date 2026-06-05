# 🛍️ STYLE-HUB — Full-Stack E-Commerce Platform

A modern, full-stack e-commerce clothing store built with **React** (frontend) and **Spring Boot** (backend), featuring a beautiful UI, custom payment sandbox, admin dashboard, order tracking, and live product review system.

🌐 **Live Demo:** [https://style-hub-umber.vercel.app](https://style-hub-umber.vercel.app)

---

## 📸 Screenshots

| Storefront | Product Details | Admin Dashboard |
|:---:|:---:|:---:|
| Homepage with hero & product grid | Full-screen modal with size selector, reviews | Sales reports, filters, transaction ledger |

---

## ✨ Features

### 🛒 Customer Features
- **Product Browsing** — Browse Men's, Women's, and Kids' clothing collections
- **Product Details Modal** — Full-screen overlay with image, description, size selector (S/M/L/XL), quantity stepper, specifications, and reviews
- **Shopping Cart** — Add to cart with size tracking, view cart with quantity and pricing breakdown
- **Secure Checkout** — Multi-step checkout with shipping address form and 3 payment methods:
  - 💳 Credit/Debit Card (with 3D Secure OTP sandbox — test code: `123456`)
  - 📱 UPI QR Code (simulated scan flow)
  - 🚚 Cash on Delivery (COD)
- **Order Tracking** — Visual stepper timeline: Order Placed → Shipped → Delivered
- **Product Reviews** — Write star ratings and comments for delivered orders, displayed dynamically on product pages
- **User Authentication** — Register & login system with session management

### 🔧 Admin Features
- **Admin Dashboard** — Real-time sales analytics with:
  - Revenue, Units Sold, Total Orders, Average Order Value
  - Department-wise sales distribution progress bars
  - Top-selling products grid
  - Filterable transaction ledger (by gender, category, payment mode, status)
- **Product Management** — Add, edit, and delete products with images
- **Order Management** — View all orders, update status (Ship / Deliver)

### 🎨 UI/UX Highlights
- Modern, premium design with glassmorphism effects
- Smooth micro-animations and hover transitions
- Fully responsive across desktop, tablet, and mobile
- Toast notifications for cart actions
- Custom payment sandbox simulation with step-by-step visual feedback

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library with component-based architecture |
| **Vite 8** | Fast build tool and development server |
| **React Router DOM 7** | Client-side routing and navigation |
| **Axios** | HTTP client for API requests |
| **Lucide React** | Modern icon library |
| **Vanilla CSS** | Custom styling with CSS variables design system |

### Backend
| Technology | Purpose |
|---|---|
| **Java 17** | Programming language |
| **Spring Boot 3.5** | Backend framework with REST API |
| **Spring Data JPA** | ORM and database access layer |
| **Hibernate** | JPA implementation with auto-schema generation |
| **MySQL** | Relational database |
| **Maven** | Build tool and dependency management |
| **Lombok** | Boilerplate code reduction |

### Deployment
| Service | Purpose |
|---|---|
| **Vercel** | Frontend hosting with auto-deploy from GitHub |
| **Render** | Backend hosting (Dockerized Spring Boot) |
| **Aiven** | Cloud-hosted MySQL database |

---

## 📁 Project Structure

```
ecommerce-java/
├── backend/
│   └── ecommerce/
│       ├── src/main/java/com/sahil/ecommerce/
│       │   ├── controller/          # REST API Controllers
│       │   │   ├── CartController.java
│       │   │   ├── OrderController.java
│       │   │   ├── ProductController.java
│       │   │   ├── ReviewController.java
│       │   │   └── UserController.java
│       │   ├── entity/              # JPA Entity Models
│       │   │   ├── Cart.java
│       │   │   ├── OrderItem.java
│       │   │   ├── Product.java
│       │   │   ├── Review.java
│       │   │   └── User.java
│       │   ├── repository/          # Spring Data Repositories
│       │   │   ├── CartRepository.java
│       │   │   ├── OrderRepository.java
│       │   │   ├── ProductRepository.java
│       │   │   ├── ReviewRepository.java
│       │   │   └── UserRepository.java
│       │   └── EcommerceApplication.java
│       ├── src/main/resources/
│       │   └── application.properties
│       ├── Dockerfile
│       ├── pom.xml
│       └── mvnw / mvnw.cmd
│
├── frontend/
│   ├── src/
│   │   ├── components/              # Reusable React Components
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminNavbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── pages/                   # Page-level Components
│   │   │   ├── Home.jsx
│   │   │   ├── Men.jsx
│   │   │   ├── Women.jsx
│   │   │   ├── Kids.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminOrders.jsx
│   │   │   ├── AdminProducts.jsx
│   │   │   └── AdminAddProduct.jsx
│   │   ├── styles/                  # CSS Stylesheets
│   │   │   ├── admin.css
│   │   │   ├── cart.css
│   │   │   ├── checkout.css
│   │   │   ├── home.css
│   │   │   ├── login.css
│   │   │   └── product.css
│   │   ├── services/
│   │   │   └── api.js               # Axios API service layer
│   │   ├── App.jsx                  # Root component with routes
│   │   ├── main.jsx                 # Entry point with Axios interceptor
│   │   └── index.css                # Global CSS design system
│   ├── vercel.json                  # Vercel SPA rewrite config
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 17** or higher — [Download JDK](https://adoptium.net/)
- **Node.js 18+** and **npm** — [Download Node.js](https://nodejs.org/)
- **MySQL 8.0+** — [Download MySQL](https://dev.mysql.com/downloads/) or use a cloud instance

### 1. Clone the Repository

```bash
git clone https://github.com/sahilshete7438/STYLE-HUB.git
cd STYLE-HUB
```

### 2. Set Up the Database

Create a MySQL database:

```sql
CREATE DATABASE ecommerce_db;
```

### 3. Configure Backend

Edit the database credentials in `backend/ecommerce/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080
```

> **Note:** Hibernate will automatically create all required tables (`users`, `products`, `cart`, `orders`, `reviews`) on first startup.

### 4. Start the Backend

```bash
cd backend/ecommerce

# On Windows
.\mvnw.cmd spring-boot:run

# On macOS/Linux
./mvnw spring-boot:run
```

The backend API will be running at: **http://localhost:8080**

### 5. Start the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be running at: **http://localhost:5173**

---

## 🔗 API Endpoints

### Products
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/products` | Get all products |
| `GET` | `/products/men` | Get men's products |
| `GET` | `/products/women` | Get women's products |
| `GET` | `/products/kids` | Get kids' products |
| `POST` | `/products` | Add a new product |
| `PUT` | `/products/{id}` | Update a product |
| `DELETE` | `/products/{id}` | Delete a product |

### Users
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/users/register` | Register a new user |
| `POST` | `/users/login` | Login user |

### Cart
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/cart` | Add item to cart (with size) |
| `GET` | `/cart/{userId}` | Get user's cart items |
| `DELETE` | `/cart/{id}` | Remove cart item |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/orders` | Place a new order |
| `GET` | `/orders` | Get all orders (admin) |
| `GET` | `/orders/user/{userId}` | Get user's orders |
| `PUT` | `/orders/{id}/{status}` | Update order status |

### Reviews
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/reviews` | Submit a product review |
| `GET` | `/reviews/product/{productId}` | Get reviews for a product |

---

## 🔐 Test Credentials

### Customer Account
Register a new account through the UI, or use any account you've created.

### Admin Panel
- **URL:** `/admin`
- **Email:** `admin@stylehub.com`
- **Password:** `admin1234`

### Payment Sandbox
- **Card OTP Code:** `123456`
- **Test Card Number:** Any 16 digits (e.g., `4242 4242 4242 4242`)

---

## 🌐 Deployment

### Frontend → Vercel
1. Push code to GitHub
2. Import the `frontend/` directory in [Vercel](https://vercel.com)
3. Set the environment variable: `VITE_API_URL=https://your-backend-url.onrender.com`
4. Deploy — Vercel auto-rebuilds on every push to `main`

### Backend → Render
1. Push code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set the root directory to `backend/ecommerce`
4. Set environment variables:
   - `DB_URL` — Your MySQL connection URL
   - `DB_USERNAME` — Database username
   - `DB_PASSWORD` — Database password
5. Deploy using the included `Dockerfile`

### Database → Aiven (or any MySQL host)
1. Create a free MySQL instance on [Aiven](https://aiven.io)
2. Use the provided connection URL, username, and password in your backend environment variables

---

## 📊 Database Schema

The following tables are auto-generated by Hibernate:

| Table | Key Columns |
|---|---|
| `users` | id, name, email, password |
| `products` | id, name, description, price, stock, image, category, gender |
| `cart` | id, userId, productId, quantity, size |
| `orders` | id, userId, productId, quantity, totalPrice, status, paymentMethod, paymentStatus, size |
| `reviews` | id, productId, author, rating, comment |

---

## 🛣️ Application Routes

| Route | Page | Access |
|---|---|---|
| `/` | Homepage with hero banner & featured products | Public |
| `/men` | Men's clothing collection | Public |
| `/women` | Women's clothing collection | Public |
| `/kids` | Kids' clothing collection | Public |
| `/login` | User login | Public |
| `/register` | User registration | Public |
| `/cart` | Shopping cart | Logged-in users |
| `/checkout` | Checkout with payment | Logged-in users |
| `/orders` | My Orders with tracking timeline | Logged-in users |
| `/admin` | Admin Dashboard with analytics | Admin only |
| `/admin/products` | Manage Products (CRUD) | Admin only |
| `/admin/add-product` | Add New Product form | Admin only |
| `/admin/orders` | Manage Customer Orders | Admin only |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Sahil Shete**
- GitHub: [@sahilshete7438](https://github.com/sahilshete7438)

---

> Built with ❤️ using React, Spring Boot, and MySQL
