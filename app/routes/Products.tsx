import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { supabase } from "../utils/supabase";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [notification, setNotification] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ✅ الأنيميشن
  const [animate, setAnimate] = useState(false);

  // ✅ بدل ما تكون ثابتة، أصبحت ديناميكية
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setProducts(data || []);

      // ✅ استخراج التصنيفات بدون تكرار
      if (data) {
        const uniqueCategories = Array.from(
          new Set(data.map((item) => item.category))
        );
        setCategories(["All", ...uniqueCategories]);
      }
    } catch (error: any) {
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

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 10);
    return () => clearTimeout(t);
  }, [selectedCategory]);

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

      <main className="w-full max-w-[1300px] mx-auto px-6 py-12">
        {/* 🌸 Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 title-gradient">
            Our Collection 💕
          </h1>
          <p className="text-gray-600 text-lg">
            Discover our exclusive pink-inspired products
          </p>
        </div>

        {/* 🏷️ Categories Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 font-medium"
              style={{
                backgroundColor:
                  selectedCategory === category ? "#ff69b4" : "white",
                color: selectedCategory === category ? "white" : "#ff69b4",
                border: "2px solid #ff69b4",
                boxShadow:
                  selectedCategory === category
                    ? "0 4px 12px rgba(255, 105, 180, 0.3)"
                    : "none",
              }}
            >
              {category === "All" && "🌸 "}
              {category}
            </button>
          ))}
        </div>

        {/* 🌀 Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {/* Count */}
            <p className="text-center text-gray-500 mb-8 text-sm">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"} available
            </p>

            {/* 🧩 Product Grid */}
<div
  key={selectedCategory} // ✅ دا المفتاح السحري
  className="products-grid fade-in"
>

              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
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
                  <p>{product.price.toFixed(2)}£</p>
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

            {/* ❌ Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">😢</div>
                <p className="text-gray-500 text-xl mb-6">
                  No products found in this category
                </p>
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                  style={{
                    backgroundColor: "#ff69b4",
                    color: "white",
                    boxShadow: "0 4px 12px rgba(255, 105, 180, 0.3)",
                  }}
                >
                  View All Products
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
