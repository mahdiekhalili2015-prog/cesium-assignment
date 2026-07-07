import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  base: "/cesium-assignment/",

  define: {
    CESIUM_BASE_URL: JSON.stringify("/cesium-assignment/cesium"),
  },

  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/cesium/Build/Cesium/*",
          dest: "cesium",
        },
      ],
    }),
  ],
});