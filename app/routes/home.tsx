import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { supabase } from "../utils/supabase";
import { Link } from "react-router";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [notification, setNotification] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🩷 Fetch first 10 products from Supabase
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name", { ascending: true })
        .limit(10);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setNotification("Failed to load products 😢");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      setNotification(`${product.name} is out of stock! 😢`);
      setTimeout(() => setNotification(""), 3000);
      return;
    }

    addToCart(product);
    setNotification(`${product.name} added to cart! 🎀`);
    setTimeout(() => setNotification(""), 3000);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fff0f5" }}>
      <Navbar />

      {/* 🔔 Notification */}
      {notification && (
        <div
          className="fixed top-20 right-8 px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce"
          style={{ backgroundColor: "#ff69b4", color: "white" }}
        >
          {notification}
        </div>
      )}

      <main className="flex-grow">
        {/* 🌸 Hero Section */}
        <section className="flex flex-col items-center justify-center text-center py-20 px-6">
          <h2 className="text-5xl font-bold mb-4" style={{ color: "#ff69b4" }}>
            Discover Your Perfect Style 💖
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-xl">
            Explore our exclusive pink-inspired collection that brings out your
            confidence and charm.
          </p>
          <Link
            to="/products"
            className="px-8 py-3 rounded-full shadow-lg transition-all inline-block"
            style={{ backgroundColor: "#ff69b4", color: "white" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#ff4fa1")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#ff69b4")
            }
          >
            Shop Now
          </Link>
        </section>

        {/* ✨ Featured Products Section */}
        <section className="px-8 py-12 " id="products">
          <h3
            className="text-3xl font-semibold text-center mb-10"
            style={{ color: "#ff69b4" }}
          >
            Featured Products ✨
          </h3>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card fade-in">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/400x400/ffb6c1/ffffff?text=No+Image";
                    }}
                  />

                  <h3>{product.name}</h3>
                  <p>{product.category}</p>
                  <p>£{product.price.toFixed(2)}£</p>
                  <p>{product.description}</p>
                  {product.stock > 0 ? (
                    <button onClick={() => handleAddToCart(product)}>
                      🛒 Add to Cart
                    </button>
                  ) : (
                    <button disabled>😢 Out of Stock</button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 👇 زر يظهر فقط لو فيه منتجات */}
          {products.length > 0 && (
            <div className="text-center mt-12">
              <Link
                to="/products"
                className="px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                style={{
                  backgroundColor: "#ff69b4",
                  color: "white",
                  boxShadow: "0 4px 12px rgba(255, 105, 180, 0.3)",
                }}
              >
                View All Products 💕
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
