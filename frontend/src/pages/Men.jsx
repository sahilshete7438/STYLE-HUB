import { useEffect, useState } from "react";
import { getMenProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import "../styles/product.css";

function Men() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getMenProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="fade-in">
      <div className="category-header-banner">
        <h1>Men's Collection</h1>
        <p>Discover contemporary style, quality everyday basics, and activewear crafted for men.</p>
      </div>

      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))
        ) : (
          <div style={{ gridColumn: "1/-1", padding: "40px", color: "var(--text-light)" }}>
            <h3>No products found in this category.</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Men;