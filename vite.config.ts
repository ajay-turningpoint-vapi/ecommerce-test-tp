import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            // Split admin pages into their own chunk so the storefront stays small
            if (id.includes("/src/pages/admin/") || id.includes("/src/components/admin/")) {
              return "admin";
            }
            return undefined;
          }
          if (id.includes("recharts") || id.includes("d3-")) return "charts";
          if (id.includes("@radix-ui")) return "radix";
          if (id.includes("lucide-react")) return "icons";
          if (id.includes("react-hook-form") || id.includes("@hookform") || id.includes("zod")) return "forms";
          if (id.includes("@supabase") || id.includes("@tanstack")) return "data";
          if (id.includes("embla-carousel") || id.includes("vaul") || id.includes("cmdk") || id.includes("input-otp") || id.includes("react-resizable-panels") || id.includes("react-day-picker") || id.includes("date-fns")) return "ui-extras";
          if (id.includes("react-router")) return "router";
          if (id.includes("react-dom") || id.includes("react/") || id.includes("scheduler")) return "react";
          return "vendor";
        },
      },
    },
  },
}));
