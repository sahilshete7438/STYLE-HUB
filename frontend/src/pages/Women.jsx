import { useEffect, useState } from "react";
import { getWomenProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import "../styles/product.css";

function Women() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWomenProducts()
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="fade-in">
      <div className="category-header-banner">
        <h1>Women's Collection</h1>
        <p>Explore elegant dresses, casual wear, and premium fabrics tailored for the modern woman.</p>
      </div>

      <div className="product-grid">
        {loading ? (
          <div style={{ gridColumn: "1/-1", padding: "40px", color: "var(--text-light)" }}>
            <h3>Loading products...</h3>
          </div>
        ) : products.length > 0 ? (
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

export default Women;