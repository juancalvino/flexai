import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

export default defineConfig({
  site: "https://flexai.com.ar",
  integrations: [
    tailwind({
      // Apply base styles
      applyBaseStyles: true,
    }),
    mdx({
      // Optimize MDX processing
      syntaxHighlight: 'shiki',
      shikiConfig: {
        theme: 'github-light',
        wrap: true,
      },
    }),
    sitemap({
      // Generate sitemap with priority and changefreq
      customPages: [
        'https://flexai.com.ar',
        'https://flexai.com.ar/precios',
        'https://flexai.com.ar/cobertura',
        'https://flexai.com.ar/nosotros',
      ],
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-AR',
        },
      },
    }),
    icon({
      // Optimize icon loading
      include: {
        bx: ['*'],
        'simple-icons': ['instagram', 'whatsapp', 'linkedin'],
        uil: ['*'],
      },
    }),
  ],
  output: 'static',
  build: {
    // Build optimizations
    inlineStylesheets: 'auto',
  },
  image: {
    // Image optimization settings
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    domains: [
      'flexai.com.ar',
      'lightdata.flexai.com.ar',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.flexai.com.ar',
      },
    ],
  },
  prefetch: {
    // Prefetch optimization
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  vite: {
    // Vite optimizations
    build: {
      // CSS code splitting
      cssCodeSplit: true,
      // Minification
      minify: 'esbuild',
      // Source maps for production debugging
      sourcemap: false,
    },
    // Development server
    server: {
      host: true,
      port: 3000,
    },
    // Plugin optimizations
    esbuild: {
      // Drop console logs in production
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
  },
  markdown: {
    // Markdown processing optimizations
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});