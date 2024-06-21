import { defineConfig } from "npm:vite@^5.3.1";
import { svelte } from "npm:@sveltejs/vite-plugin-svelte@^3.1.1";

import "npm:svelte@^4.2.18";
import "npm:svelte-i18n@^4.0.0";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
});
