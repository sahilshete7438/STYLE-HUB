import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Truck, RotateCcw, CreditCard, Star } from "lucide-react";
import "../styles/home.css";

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80",
      tagline: "New Season Arrivals",
      title: "ELEVATE YOUR STYLE",
      description: "Discover the latest fashion collections designed for maximum comfort and style."
    },
    {
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
      tagline: "Exclusive Summer Vibe",
      title: "SUMMER ESSENTIALS",
      description: "Get ready for the sun with breathable materials and vibrant, modern designs."
    },
    {
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
      tagline: "Limited Premium Edition",
      title: "THE LUXURY COLLECTION",
      description: "Uncompromising quality and tailored fits crafted for sophisticated tastes."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="fade-in">
      {/* Hero Banner Carousel */}
      <section className="hero-carousel">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? "active" : ""}`}
            style={{
              backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.45)), url(${slide.image})`
            }}
          >
            <div className="hero-content">
              <p className="hero-tagline">{slide.tagline}</p>
              <h1>{slide.title}</h1>
              <p>{slide.description}</p>
              <a href="#categories" className="hero-btn">
                Shop Collections
              </a>
            </div>
          </div>
        ))}

        {/* Carousel Indicator Dots */}
        <div className="carousel-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-container">
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Truck size={28} />
            </div>
            <h4>Free Shipping</h4>
            <p>On all orders over ₹999</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <RotateCcw size={28} />
            </div>
            <h4>Easy Returns</h4>
            <p>15-day return policy</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CreditCard size={28} />
            </div>
            <h4>Secure Payments</h4>
            <p>100% encrypted checkout</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Star size={28} />
            </div>
            <h4>Premium Quality</h4>
            <p>Handpicked fabrics only</p>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section id="categories" className="home-section">
        <div className="section-header">
          <h2>Shop By Category</h2>
          <p>Explore our premium collections tailored for everyone</p>
        </div>

        <div className="category-grid">
          {/* Men Category */}
          <Link to="/men" className="category-card">
            <img 
              src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80" 
              alt="Men Clothing Collection" 
            />
            <div className="category-overlay">
              <h3>MEN</h3>
              <p>Explore streetwear, formals, and premium everyday wear.</p>
              <div className="category-btn">
                Shop Men <span></span>
              </div>
            </div>
          </Link>

          {/* Women Category */}
          <Link to="/women" className="category-card">
            <img 
              src="https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=800&q=80" 
              alt="Women Clothing Collection" 
            />
            <div className="category-overlay">
              <h3>WOMEN</h3>
              <p>Timeless silhouettes, dresses, and modern chic selections.</p>
              <div className="category-btn">
                Shop Women <span></span>
              </div>
            </div>
          </Link>

          {/* Kids Category */}
          <Link to="/kids" className="category-card">
            <img 
              src="https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80" 
              alt="Kids Clothing Collection" 
            />
            <div className="category-overlay">
              <h3>KIDS</h3>
              <p>Playful styles, vibrant prints, and durable wear.</p>
              <div className="category-btn">
                Shop Kids <span></span>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;