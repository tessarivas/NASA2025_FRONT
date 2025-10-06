import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor libraries grandes
          "vendor-react": ["react", "react-dom"],
          "vendor-router": ["react-router-dom"],
          "vendor-ui": ["lucide-react", "recharts"],
          "vendor-3d": ["three", "react-globe.gl", "d3"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-animations": ["gsap"], // ← QUITAR tw-animate-css
          "vendor-graph": ["sigma", "graphology"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "lucide-react", "recharts", "d3", "three"],
  },
});
