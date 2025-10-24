import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import "./app.css";

import Footer from "./components/FooterSection";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap",
  },  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css",
  },
  
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="font-inter bg-lightPink text-gray-800 min-h-screen flex flex-col">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <main className="flex-grow bg-lightPink">
          <Outlet />
        </main>
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404 - Page Not Found" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-lightPink text-center p-8">
      <h1 className="text-5xl font-bold text-brandPink mb-4">{message}</h1>
      <p className="text-gray-700 mb-6">{details}</p>
      {stack && (
        <pre className="bg-white text-left p-4 rounded-xl shadow overflow-x-auto w-full max-w-2xl">
          <code className="text-sm text-gray-600">{stack}</code>
        </pre>
      )}
      <a
        href="/"
        className="mt-6 inline-block bg-brandPink text-white px-6 py-3 rounded-full hover:bg-pink-500 transition"
      >
        Go Back Home
      </a>
    </main>
  );
}