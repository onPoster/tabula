import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import browserslistToEsbuild from "browserslist-to-esbuild"
import svgr from "@svgr/rollup"
import path from "path"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  // depending on your application, base can also be "/"
  base: "",
  define: {
    // here is the main update
    global: "globalThis",
  },
  build: {
    // --> ["chrome79", "edge92", "firefox91", "safari13.1"]
    target: browserslistToEsbuild(),
  },
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
  plugins: [
    // here is the main update
    tsconfigPaths(),
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
    svgr(),
  ],
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3000,
  },
})
