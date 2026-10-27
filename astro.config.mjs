import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import { securityConfig } from "./astro.config.security.mjs";

const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  site: "https://flexai.com.ar",
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "es",
        locales: { es: "es-AR" },
      },
    }),
    icon({
      include: {
        bx: ["*"],
        "simple-icons": ["instagram", "whatsapp", "linkedin"],
        uil: ["*"],
      },
    }),
  ],
  output: "static",
  build: {
    inlineStylesheets: "auto",
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
      minify: "esbuild",
      sourcemap: false,
    },
    server: isDev ? securityConfig.server : { host: true, port: 3000 },
    esbuild: {
      drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
    },
    ...(isDev ? securityConfig.vite : {}),
  },
});
