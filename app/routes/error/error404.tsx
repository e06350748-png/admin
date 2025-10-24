import { Navbar } from "../../components/Navbar";
import FooterSection from "../../components/FooterSection";
import { useNavigate } from "react-router";

export default function Error404() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md">
          <h1 className="text-9xl font-extrabold text-indigo-600 mb-4 animate-bounce">
            404
          </h1>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Oops! The page you’re looking for doesn’t exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Go to Home
            </button>

            <button
              onClick={() => navigate(-1)}
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
