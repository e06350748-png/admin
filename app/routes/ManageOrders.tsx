import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { supabase } from "../utils/supabase";
import { useNavigate } from "react-router";

export default function ManageOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [users, setUsers] = useState<Record<string, { email: string; full_name: string }>>({});

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "#ff69b4";
      case "processing": return "#FFA500";
      case "shipped": return "#4169E1";
      case "delivered": return "#32CD32";
      case "cancelled": return "#DC143C";
      default: return "#666";
    }
  };

  useEffect(() => {
    const fetchOrdersAndUsers = async () => {
      setLoading(true);

      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(`
          id,
          user_id,
          total_amount,
          status,
          created_at,
          shipping_address,
          phone
        `)
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error("Error loading orders:", ordersError);
        setLoading(false);
        return;
      }

      setOrders(ordersData || []);

      // جلب بيانات المستخدمين من جدول profiles
      const userIds = [...new Set((ordersData || []).map(o => o.user_id))];
      if (userIds.length > 0) {
        const { data: usersData, error: usersError } = await supabase
          .from("profiles")
          .select("id, email, full_name")
          .in("id", userIds);

        if (usersError) {
          console.error("Error loading users:", usersError);
        } else {
          const userMap: Record<string, { email: string; full_name: string }> = {};
          usersData?.forEach(u => {
            if (u.id) userMap[u.id] = { email: u.email || "-", full_name: u.full_name || "-" };
          });
          setUsers(userMap);
        }
      }

      setLoading(false);
    };

    fetchOrdersAndUsers();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      alert("Error updating order status");
      console.error(error);
    } else {
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }

    setUpdating(null);
  };

  return (
    <div className="min-h-screen bg-[#fff0f5]">
      <Navbar />

      <main className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-center text-pink-600 mb-10">
          Manage Orders 📦
        </h1>

        {loading ? (
          <div className="text-center text-gray-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500 text-xl">No orders found.</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
            <table className="w-full border-collapse">
              <thead className="bg-pink-100 text-gray-700">
                <tr>
                  <th className="p-4 text-left">Order ID</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">Total</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-t hover:bg-pink-50 transition">
                    <td className="p-4 font-mono text-sm text-gray-700">
                      {(order.id || "").toString().substring(0, 8)}
                    </td>
                    <td className="p-4">
                      <div className="text-gray-800 font-medium">
                        {users[order.user_id]?.full_name || "Unknown"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {users[order.user_id]?.email || "-"}
                      </div>
                    </td>
                    <td className="p-4 text-gray-700">{order.phone || "-"}</td>
                    <td className="p-4 font-semibold text-gray-800">
                      ${Number(order.total_amount || 0).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        disabled={updating === order.id}
                        className="px-3 py-1 rounded-lg font-semibold"
                        style={{
                          backgroundColor: getStatusColor(order.status) + "20",
                          color: getStatusColor(order.status),
                          border: `2px solid ${getStatusColor(order.status)}`,
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-gray-600">
                      {order.created_at ? new Date(order.created_at).toLocaleString() : "-"}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => navigate(`/order/${order.id}`)}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-all"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
