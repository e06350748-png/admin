import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  // Allow both VITE_ and REACT_APP_ env prefixes so user can keep CRA-style variables
  envPrefix: ["VITE_", "REACT_APP_"],
});
