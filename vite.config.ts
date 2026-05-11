import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const base = mode === "production" ? "/apartments-with-filters/" : "/";

  return {
    plugins: [react(), tailwindcss()],
    base,
    server: {
      port: 3000,
      open: true,
    },
    publicDir: resolve(__dirname, "public"),
    optimizeDeps: { exclude: ["msw"] },
  };
});
