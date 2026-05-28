import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In Docker dev, BACKEND_URL points to the backend container via Docker network.
// Locally (no Docker) it defaults to localhost:8080.
const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8080";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: backendUrl,
        changeOrigin: true,
      },
    },
  },
});
