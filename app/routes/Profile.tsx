import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { supabase } from "../utils/supabase";

// ✅ تعريف نوع الطلب والعناصر المرتبطة به
interface OrderItem {
  id: string;
  product_name: string;
  product_emoji?: string;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  user_id: string;
  created_at: string;
  status: string;
  total_amount: number;
  order_items: OrderItem[];
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, loading: authLoading, updateProfile, signOut } = useAuth();

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    country: "Egypt",
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    } else if (user) {
      setFormData({
        full_name: user.full_name || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        postal_code: user.postal_code || "",
        country: user.country || "Egypt",
      });
      fetchOrders();
    }
  }, [user, authLoading, navigate]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
    }
  };

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { error } = await updateProfile(formData);

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Profile updated successfully! ✨");
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  // ✅ دالة إلغاء الطلب - الإصدار المُحسَّن
  const handleCancelOrder = async (orderId: string) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;

    try {
      if (!user) {
        alert("You must be logged in to cancel orders");
        return;
      }

      console.log("🔍 Cancelling order:", orderId);
      console.log("🔍 User ID:", user.id);

      // ✅ محاولة الـ update بدون select أولاً
      const { error } = await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", orderId)
        .eq("user_id", user.id);

      if (error) {
        console.error("❌ Supabase error:", error);
        
        // ✅ رسائل خطأ أوضح حسب نوع المشكلة
        if (error.code === "PGRST116") {
          throw new Error("Order not found or you don't have permission to cancel it");
        } else if (error.message.includes("policy")) {
          throw new Error("Permission denied. Please check your account settings.");
        }
        
        throw error;
      }

      console.log("✅ Order cancelled successfully in database");

      // ✅ تحديث الحالة محليًا
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" } : order
        )
      );

      alert("Order cancelled successfully ❌");

      // ✅ إعادة جلب الطلبات للتأكد من التحديث
      await fetchOrders();

    } catch (err: any) {
      console.error("❌ Error cancelling order:", err);
      alert(`Failed to cancel order: ${err.message || "Unknown error"}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#ff69b4";
      case "processing":
        return "#FFA500";
      case "shipped":
        return "#4169E1";
      case "delivered":
        return "#32CD32";
      case "cancelled":
        return "#DC143C";
      default:
        return "#666";
    }
  };

  if (authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#fff0f5" }}
      >
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-gray-800 flex flex-col"
      style={{ backgroundColor: "#fff0f5" }}
    >
      <Navbar />

      <main className="flex-grow p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold" style={{ color: "#ff69b4" }}>
              My Account 👤
            </h2>
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
              style={{
                backgroundColor: "transparent",
                color: "#ff69b4",
                border: "2px solid #ff69b4",
              }}
            >
              Logout 🚪
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Profile Information */}
            <div className="card">
              <h3
                className="text-2xl font-semibold mb-4"
                style={{ color: "#ff69b4" }}
              >
                Profile Information 📝
              </h3>

              {success && (
                <div
                  className="mb-4 px-4 py-3 rounded"
                  style={{
                    backgroundColor: "#d4edda",
                    color: "#155724",
                    border: "1px solid #c3e6cb",
                  }}
                >
                  {success}
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-2 rounded-lg border"
                    style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: "#ff69b4", color: "white" }}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Profile ✨"}
                </button>
              </form>
            </div>

            {/* Order History */}
            <div className="card">
              <h3
                className="text-2xl font-semibold mb-4"
                style={{ color: "#ff69b4" }}
              >
                Order History 📦
              </h3>

              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No orders yet</p>
                  <a
                    href="/products"
                    className="inline-block px-6 py-2 rounded-lg font-semibold transition-all hover:opacity-90"
                    style={{ backgroundColor: "#ff69b4", color: "white" }}
                  >
                    Start Shopping
                  </a>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-lg p-4 transition-all hover:shadow-md"
                      style={{ borderColor: "#ffe4ec" }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm text-gray-500 font-medium">
                            Order #{order.id.substring(0, 8)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(order.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: `${getStatusColor(
                              order.status
                            )}20`,
                            color: getStatusColor(order.status),
                          }}
                        >
                          {order.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="space-y-2 mb-3">
                        {order.order_items?.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.product_emoji} {item.product_name} x
                              {item.quantity}
                            </span>
                            <span className="font-semibold">
                              ${item.subtotal.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div
                        className="border-t pt-3"
                        style={{ borderColor: "#ffe4ec" }}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-bold">Total</span>
                          <span
                            className="font-bold text-lg"
                            style={{ color: "#ff69b4" }}
                          >
                            ${order.total_amount.toFixed(2)}
                          </span>
                        </div>

                        {/* 🔥 زر إلغاء الطلب */}
                        {order.status !== "cancelled" &&
                          order.status !== "delivered" && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="mt-2 w-full py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-80"
                              style={{
                                backgroundColor: "#ffe4ec",
                                color: "#ff69b4",
                                border: "1px solid #ff69b4",
                              }}
                            >
                              Cancel Order ❌
                            </button>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}