import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    base: "/elegant-nikah/",
  },

  tanstackStart: {
    server: { entry: "server" },
    prerender: { enabled: true, crawlLinks: true },
  },
});