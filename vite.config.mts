import { defineConfig } from "npm:vite@^5.2.11";
import { svelte } from "npm:@sveltejs/vite-plugin-svelte@^3.1.0";

import "npm:svelte@^4.2.17";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      external: [
        "svelte-i18n", // ignore react stuff
      ],
    },
  },
  plugins: [svelte()],
});
