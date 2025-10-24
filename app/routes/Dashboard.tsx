import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../utils/supabase";
import { Navbar } from "../components/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    lastUpdate: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          navigate("/login");
          return;
        }

        // 🧩 تحقق من الرول
        const { data: profile, error: roleError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (roleError || profile?.role !== "admin") {
          navigate("/");
          return;
        }

        // 📊 جلب الإحصائيات
        const [{ count: productCount }, { count: userCount }] = await Promise.all([
          supabase.from("products").select("*", { count: "exact", head: true }),
          supabase.from("profiles").select("*", { count: "exact", head: true }),
        ]);

        setStats({
          products: productCount || 0,
          users: userCount || 0,
          lastUpdate: new Date().toLocaleString(),
        });
      } catch (err) {
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fff0f5] text-gray-800">
      <Navbar />

      <main className="flex-1 p-8 md:p-12 fade-in">
        <h1 className="text-4xl font-bold text-center mb-10 text-pink-600">
          Admin Dashboard 💼
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-500">Loading dashboard...</div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {/* 📦 Total Products */}
            <div className="card text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-pink-200 transition-all">
              <h2 className="text-xl font-semibold text-pink-500">Products</h2>
              <p className="text-5xl font-bold text-gray-800 mt-3">
                {stats.products}
              </p>
            </div>

            {/* 👥 Total Users */}
            <div className="card text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-pink-200 transition-all">
              <h2 className="text-xl font-semibold text-pink-500">Users</h2>
              <p className="text-5xl font-bold text-gray-800 mt-3">
                {stats.users}
              </p>
            </div>

            {/* 🕒 Last Update */}
            <div className="card text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-pink-200 transition-all">
              <h2 className="text-xl font-semibold text-pink-500">Last Update</h2>
              <p className="text-lg font-medium text-gray-700 mt-3">
                {stats.lastUpdate}
              </p>
            </div>
          </div>
        )}

        {/* 🚀 Actions Section */}
        {!loading && (
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate("/add-product")}
                className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-all"
              >
                ➕ Add Product
              </button>
              <button
                onClick={() => navigate("/manage-products")}
                className="bg-white border-2 border-pink-400 text-pink-600 px-6 py-3 rounded-lg hover:bg-pink-100 transition-all"
              >
                🛍 Manage Products
              </button>
              <button
                onClick={() => navigate("/manage-users")}
                className="bg-white border-2 border-pink-400 text-pink-600 px-6 py-3 rounded-lg hover:bg-pink-100 transition-all"
              >
                👥 Manage Users
              </button>
            </div>
          </div>
        )}
      </main>

    </div>
  );
}
