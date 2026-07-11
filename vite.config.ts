import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    base: "/elegant-nikah/",
  },

  nitro: false,

  tanstackStart: {
    server: { entry: "server" },
    prerender: { enabled: true },
  },
});