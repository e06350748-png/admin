import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { supabase } from "../utils/supabase";
import { createPortal } from "react-dom";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

export default function ManageProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image_url: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else {
      setProducts(data || []);
      const uniqueCategories = Array.from(
        new Set(data.map((item) => item.category))
      );
      setCategories(["All", ...uniqueCategories]);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  const handleEdit = (product: Product) => {
    console.log("Editing product:", product);
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      image_url: product.image_url,
    });
  };

  const handleUpdate = async () => {
    if (!editingProduct) return;
    const { error } = await supabase
      .from("products")
      .update({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        image_url: formData.image_url,
      })
      .eq("id", editingProduct.id);

    if (error) alert("Update failed!");
    else {
      setEditingProduct(null);
      fetchProducts();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const result = await res.json();
      setFormData({ ...formData, image_url: result.secure_url });
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fff0f5" }}>
      <Navbar />

      <main className="w-full max-w-[1300px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-pink-600 mb-3">
            Manage Products 🛍️
          </h1>
          <p className="text-gray-600">
            Edit or delete products from your store
          </p>
        </div>

        {/* Category Filter */}
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

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-pink-500">Loading...</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 fade-in">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-pink-200 transition-all"
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://via.placeholder.com/400x400/ffb6c1/ffffff?text=No+Image")
                  }
                />
                <h2 className="font-bold text-xl text-gray-800">
                  {product.name}
                </h2>
                <p className="text-gray-500 mb-1">{product.category}</p>
                <p className="text-pink-600 font-semibold mb-2">
                  £{product.price.toFixed(2)}
                </p>

                <div className="flex justify-center gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-20 text-gray-500 text-lg">
            No products found 😢
          </div>
        )}
      </main>

      {/* ✅ Edit Modal via React Portal */}
      {editingProduct &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md relative">
              <button
                onClick={() => setEditingProduct(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✖
              </button>

              <h2 className="text-2xl font-bold text-pink-600 mb-4 text-center">
                Edit Product
              </h2>

              <div className="space-y-3">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Product name"
                  className="w-full border border-pink-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400"
                />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="Price"
                  className="w-full border border-pink-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400"
                />
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="Category"
                  className="w-full border border-pink-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400"
                />
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  placeholder="Stock quantity"
                  className="w-full border border-pink-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400"
                />

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Product Image
                  </label>
                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      alt="preview"
                      className="w-full h-40 object-cover rounded-lg mb-2 border border-pink-200"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {uploading && (
                    <p className="text-sm text-pink-500 mt-1">Uploading...</p>
                  )}
                </div>

                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Description"
                  className="w-full border border-pink-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
