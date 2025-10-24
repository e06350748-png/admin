import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-pink-100 border-b border-pink-300 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* 🏷️ Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-pink-600">
            💼 Admin Dashboard
          </h1>
        </Link>

        {/* 🔗 Navigation Links */}
        <ul className="flex gap-6 items-center font-medium">
          <li>
            <Link
              to="/"
              className="text-gray-700 hover:text-pink-600 transition-colors"
            >
              🏠 Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="/manage-products"
              className="text-gray-700 hover:text-pink-600 transition-colors"
            >
              🛍️ Products
            </Link>
          </li>

          <li>
            <Link
              to="/add-product"
              className="text-gray-700 hover:text-pink-600 transition-colors"
            >
              ➕ Add Product
            </Link>
          </li>

          <li>
            <Link
              to="/manage-orders"
              className="text-gray-700 hover:text-pink-600 transition-colors"
            >
              📦 Orders
            </Link>
          </li>

          <li>
            <Link
              to="/manage-users"
              className="text-gray-700 hover:text-pink-600 transition-colors"
            >
              👥 Users
            </Link>
          </li>

          {/* Divider */}
          <li className="h-6 w-px bg-gray-400"></li>

          {/* 🔗 العودة للموقع */}
          <li>
            <a
              href="https://brand-sigma-jade.vercel.app/"
              className="text-gray-600 hover:text-pink-600 transition-colors"
            >
              🌐 View Site
            </a>
          </li>

          {/* 🚪 تسجيل الخروج */}
          {user && (
            <li>
              <button
                onClick={handleLogout}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-all"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};
