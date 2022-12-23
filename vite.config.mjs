import { defineConfig } from 'npm:vite'
import { svelte } from 'npm:@sveltejs/vite-plugin-svelte'

import 'npm:svelte'
import 'npm:svelte-i18n'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()]
})
