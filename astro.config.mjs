import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://cardistry.co.za",
  output: "static",
  // Keep generated code readable. The build script also applies Prettier to dist/.
  compressHTML: false,
  vite: {
    build: {
      minify: false,
      cssMinify: false,
      assetsInlineLimit: 0,
    },
  },
});
