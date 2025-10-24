import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { supabase } from "../utils/supabase";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [user, setUser] = useState<{ full_name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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
    const fetchOrderDetails = async () => {
      setLoading(true);

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("id, user_id, total_amount, status, created_at, shipping_address, phone")
        .eq("id", id)
        .single();

      if (orderError) {
        console.error(orderError);
        setLoading(false);
        return;
      }

      setOrder(orderData);

      if (orderData?.user_id) {
        const { data: userData, error: userError } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", orderData.user_id)
          .single();

        if (userError) console.error(userError);
        else setUser(userData);
      }

      const { data: orderItems, error: itemsError } = await supabase
        .from("order_items")
        .select("product_name, product_image_url, quantity, price, subtotal")
        .eq("order_id", id);

      if (itemsError) console.error(itemsError);
      else setItems(orderItems || []);

      setLoading(false);
    };

    fetchOrderDetails();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    setUpdating(true);

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", order.id);

    if (error) {
      alert("Error updating order status");
      console.error(error);
    } else {
      setOrder({ ...order, status: newStatus });
    }

    setUpdating(false);
  };

  if (loading)
    return <div className="text-center py-20 text-gray-500">Loading order...</div>;

  if (!order)
    return <div className="text-center py-20 text-gray-500">Order not found.</div>;

  return (
    <div className="min-h-screen bg-[#fff0f5]">
      <Navbar />

      <main className="max-w-4xl mx-auto p-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-pink-100 text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-200 transition"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-pink-600 mb-6">
          Order #{order.id.substring(0, 8)}
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-2">Customer Info</h2>
          <p><b>Name:</b> {user?.full_name || "Unknown"}</p>
          <p><b>Email:</b> {user?.email || "-"}</p>
          <p><b>Phone:</b> {order.phone}</p>
          <p><b>Address:</b> {order.shipping_address}</p>
          <p><b>Date:</b> {new Date(order.created_at).toLocaleString()}</p>
          <p className="flex items-center gap-2">
            <b>Status:</b>
            <select
              value={order.status}
              onChange={e => handleStatusChange(e.target.value)}
              disabled={updating}
              className="px-3 py-1 rounded-lg font-semibold"
              style={{
                backgroundColor: getStatusColor(order.status) + "20",
                color: getStatusColor(order.status),
                border: `2px solid ${getStatusColor(order.status)}`
              }}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-4 border-b py-4">
              <img
                src={item.product_image_url}
                alt={item.product_name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-grow">
                <p className="font-bold text-gray-800">{item.product_name}</p>
                <p className="text-gray-500">
                  ${item.price} × {item.quantity}
                </p>
              </div>
              <p className="font-bold text-pink-600">${item.subtotal}</p>
            </div>
          ))}

          <div className="flex justify-between mt-6 text-lg font-bold text-gray-800">
            <span>Total:</span>
            <span className="text-pink-600">${order.total_amount}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
