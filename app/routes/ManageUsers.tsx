import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { Navbar } from "../components/Navbar";


export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("profiles").select("id, email, role");
    if (!error) setUsers(data || []);
    setLoading(false);
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    await supabase.from("profiles").update({ role: newRole }).eq("id", id);
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-[#fff0f5] text-gray-800 flex flex-col">
      <Navbar />
      <main className="flex-grow p-8">
        <h1 className="text-3xl font-bold text-pink-600 text-center mb-8">
          Manage Users 👥
        </h1>

        {loading ? (
          <p className="text-center">Loading users...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-md p-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-pink-100 text-pink-700">
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-pink-50">
                    <td className="p-3">{u.email}</td>
                    <td className="p-3 capitalize">{u.role}</td>
                    <td className="p-3 text-center">
                      {u.role !== "admin" && (
                        <button
                          onClick={() => handleRoleChange(u.id, "admin")}
                          className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600"
                        >
                          Make Admin
                        </button>
                      )}
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
