import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
// import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel({
    mode: "standalone",
  }),

  integrations: [svelte()],

  vite: {
    plugins: [tailwindcss()],
  },
});
