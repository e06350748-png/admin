import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // 🏠 الصفحة الرئيسية (لوحة التحكم)
  index("routes/Dashboard.tsx"),

  // 🔐 تسجيل الدخول
  route("login", "routes/Login.tsx"),

  // 🛍️ المنتجات
  route("add-product", "routes/AddProduct.tsx"),
  route("manage-products", "routes/ManageProducts.tsx"),

  // 👥 المستخدمين
  route("manage-users", "routes/ManageUsers.tsx"),

  // 📦 الطلبات
  route("manage-orders", "routes/ManageOrders.tsx"),
  route("order/:id", "routes/OrderDetails.tsx"),

  // ⚠️ صفحات الخطأ (دائمًا في الآخر)
  route("error-boundary", "routes/error/error-boundary.tsx"),
  route("*", "routes/error/error404.tsx"),
] satisfies RouteConfig;
