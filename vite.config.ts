import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const targetUrl = env.VITE_API_URL || "https://portal.leadcrm.in:82";

  return {
    server: {
      host: true,
      allowedHosts: true,
      proxy: {
        "/customer-beta": {
          target: targetUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  preview: {
    host: true,
    allowedHosts: true,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icons/*.png"],
      manifest: {
        name: "InsurePortal",
        short_name: "InsurePortal",
        description: "Your personal insurance client portal",
        start_url: "/",
        display: "standalone",
        background_color: "#F7F6F3",
        theme_color: "#1456A0",
        orientation: "portrait",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            // Dedicated maskable icon with safe-zone padding (~10% inset on all sides).
            // Generate icon-192-maskable.png from the source SVG with padding applied.
            src: "/icons/icon-192-maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            // Dedicated maskable icon with safe-zone padding (~10% inset on all sides).
            // Generate icon-512-maskable.png from the source SVG with padding applied.
            src: "/icons/icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
      },
    }),
  ],
  };
});
