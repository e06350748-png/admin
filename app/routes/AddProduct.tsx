import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../utils/supabase";
import { Navbar } from "../components/Navbar";

export default function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image_url: "",
    stock: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ رفع الصورة إلى Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("Uploading image...");

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

      if (result.secure_url) {
        setFormData({ ...formData, image_url: result.secure_url });
        setMessage("✅ Image uploaded successfully!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  // ✅ إضافة المنتج إلى Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image_url) {
      setMessage("❌ Please upload an image first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.from("products").insert([
        {
          name: formData.name,
          price: parseFloat(formData.price),
          category: formData.category,
          image_url: formData.image_url,
          description: formData.description,
          stock: parseInt(formData.stock), // ✅ تمت إضافة الستوك هنا
          created_at: new Date(),
        },
      ]);

      if (error) throw error;

      setMessage("🎉 Product added successfully!");
      setFormData({
        name: "",
        price: "",
        category: "",
        image_url: "",
        description: "",
        stock: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add product. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff0f5] text-gray-800 flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-8">
        <div className="card max-w-lg w-full bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-3xl font-bold text-center mb-4 text-pink-600">
            Add New Product 💖
          </h2>

          {message && (
            <div
              className={`text-center mb-4 px-4 py-2 rounded-lg ${
                message.startsWith("🎉") || message.startsWith("✅")
                  ? "bg-green-100 text-green-700"
                  : message.startsWith("Uploading")
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Name */}
            <div>
              <label className="block font-semibold mb-1">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-pink-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block font-semibold mb-1">Price (£)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full border border-pink-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block font-semibold mb-1">
                Available Stock
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="w-full border border-pink-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-semibold mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="e.g. Perfumes, Makeup..."
                className="w-full border border-pink-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block font-semibold mb-1">
                Upload Product Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border border-pink-200 rounded-lg px-3 py-2 bg-white"
              />

              {uploading && (
                <p className="text-sm text-yellow-600 mt-2">
                  Uploading image...
                </p>
              )}

              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt="Uploaded"
                  className="mt-3 w-full h-48 object-cover rounded-lg border border-pink-200"
                />
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-pink-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-400"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || uploading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                loading || uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-pink-500 hover:bg-pink-600"
              }`}
            >
              {loading ? "Adding..." : "Add Product ➕"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
