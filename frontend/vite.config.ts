import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    allowedHosts: [".trycloudflare.com"],
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // A custom service worker (src/sw.ts) is required to handle Web Push
      // `push`/`notificationclick` events — the default generateSW strategy
      // has no hook for that, so this replaces it and re-implements the
      // same runtime caching rules by hand inside sw.ts.
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      registerType: "autoUpdate",
      includeAssets: ["icon.svg"],
      manifest: {
        name: "Geriatric Grooves",
        short_name: "Grooves",
        description: "A gentle, encouraging daily mobility coach.",
        theme_color: "#2f6f4f",
        background_color: "#fdfaf3",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "maskable",
          },
        ],
      },
      injectManifest: {
        injectionPoint: "self.__WB_MANIFEST",
      },
      // vite-plugin-pwa doesn't register a service worker under `vite dev`
      // by default — without this, push notifications couldn't be tested
      // (or used) at all outside of a production build.
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
  ],
});
