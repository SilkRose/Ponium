import path from "path";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig({
  clearScreen: false,
  root: path.resolve("./src"),
  publicDir: path.resolve("./public"),
  build: {
    outDir: path.resolve("dist"),
    emptyOutDir: true,
    minify: "terser",
    terserOptions: {
      compress: {
        passes: 3,
      },
    },
  },
  server: {
    open: false,
  },
  plugins: [
    createHtmlPlugin({
      minify: true,
      template: "index.html",
    }),
  ],
});
