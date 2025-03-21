import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import griffel from "@griffel/vite-plugin";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig(async ({ command }) => ({
  plugins: [react(), command === "build" && griffel()],
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "index.html"),
        splashscreen: path.resolve(__dirname, "splashscreen.html"),
      },
    },
    target: "esnext",
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
  },
  // 3. to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.app/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
}));
