import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { glob } from 'glob';

// https://vite.dev/config/
export default defineConfig({
  base: '/todo-app-react/',
  server: {
    open: '/',
  },
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync('*.html')
          .map((file) => [
            path.basename(file, path.extname(file)),
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
    },
    outDir: 'dist',
  },
})
