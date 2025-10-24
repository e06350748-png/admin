export default function Footer() {
  return (
    <footer
      className="text-white text-center py-10 mt-16"
      style={{ background: "linear-gradient(135deg, #ff8dc7, #ff69b4)" }}
    >
      <div className="container mx-auto px-6 flex flex-col items-center">
        {/* 💖 Brand & Copyright */}
        <div className="mb-6">
          <h3 className="text-3xl font-bold mb-2">basant Brand 💖</h3>
          <p className="text-sm" style={{ color: "#ffe4ec" }}>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold">basant Brand</span>. All rights
            reserved.
          </p>
        </div>

        {/* 🌸 Social Icons */}
<div className="flex justify-center gap-8 mb-6">
  <a
    href="https://facebook.com"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-white hover:underline hover:decoration-black hover:decoration-2 transition-transform transform hover:scale-110"
  >
    <i className="bi bi-facebook text-xl" aria-hidden="true"></i>
    <span className="hidden sm:inline">Facebook</span>
  </a>

  <a
    href="https://instagram.com"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-white hover:underline hover:decoration-black hover:decoration-2 transition-transform transform hover:scale-110"
  >
    <i className="bi bi-instagram text-xl" aria-hidden="true"></i>
    <span className="hidden sm:inline">Instagram</span>
  </a>

  <a
    href="https://tiktok.com"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-white hover:underline hover:decoration-black hover:decoration-2 transition-transform transform hover:scale-110"
  >
    <i className="bi bi-tiktok text-xl" aria-hidden="true"></i>
    <span className="hidden sm:inline">TikTok</span>
  </a>
</div>


        {/* 🩷 Quick Links */}
        <div
          className="border-t border-pink-400 pt-4 mb-4 w-full flex justify-center"
          style={{ borderColor: "#ff4fa1" }}
        >
          <div
            className="flex flex-wrap justify-center gap-6 text-sm"
            style={{ color: "#ffe4ec" }}
          >
            <a href="/about" className="hover:text-white transition-colors">
              About Us
            </a>
            <a href="/contact" className="hover:text-white transition-colors">
              Contact
            </a>
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>

        {/* 💕 Love Message */}
        <div
          className="flex items-center gap-1 text-sm"
          style={{ color: "#ffe4ec" }}
        >
        <span className="m-0">Made with </span>
        <i className="bi bi-heart-fill text-pink-500 animate-pulse"></i>
        <span className="m-0"> by Eslam120</span>


        </div>
      </div>
    </footer>
  );
}
