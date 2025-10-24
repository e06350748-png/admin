import { Navbar } from "../../components/Navbar";
import FooterSection from "../../components/FooterSection";
import { useNavigate } from "react-router";

export default function ErrorBoundary({ error }: { error: Error }) {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-24 pb-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md">
          <h1 className="text-6xl font-extrabold text-red-600 mb-4 animate-pulse">
            Something went wrong 😕
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            An unexpected error occurred while loading this page.
          </p>

          <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-left p-4 rounded-md text-sm overflow-x-auto mb-6">
            <pre>{error?.message || "Unknown error"}</pre>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Reload Page
            </button>

            <button
              onClick={() => navigate("/")}
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
