import { defineConfig } from "npm:vite@^6";
import { svelte } from "npm:@sveltejs/vite-plugin-svelte@^4";

import "npm:svelte@^5";
import "npm:svelte-i18n@^4.0.0";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
});
