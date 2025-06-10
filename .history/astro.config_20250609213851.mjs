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
      applyBaseStyles: false,
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
    minify: true,
    format: 'directory',
  },
  image: {
    // Image optimization settings
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: 268402689, // 16K x 16K
      },
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
  compressHTML: true,
  vite: {
    // Vite optimizations
    build: {
      // Chunk splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['astro'],
            ui: ['@astrojs/tailwind'],
          },
        },
      },
      // CSS code splitting
      cssCodeSplit: true,
      // Minification
      minify: 'esbuild',
      // Source maps for production debugging
      sourcemap: false,
    },
    // CSS preprocessing
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
        },
      },
    },
    // Dependency optimization
    optimizeDeps: {
      include: [
        '@astrojs/tailwind',
        'astro-icon',
      ],
      exclude: [
        '@astrojs/mdx',
      ],
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
  experimental: {
    // Enable experimental optimizations
    optimizeHoistedScript: true,
  },
  markdown: {
    // Markdown processing optimizations
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
    remarkPlugins: [],
    rehypePlugins: [],
  },
  // Security headers
  security: {
    checkOrigin: true,
  },
});