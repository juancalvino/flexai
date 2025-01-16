import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import vercel from '@astrojs/vercel'

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  site: "https://flexai.com.ar",
  integrations: [tailwind(), mdx(), sitemap(), icon()],
});
