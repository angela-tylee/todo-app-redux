import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { glob } from 'glob'
import liveReload from 'vite-plugin-live-reload'

function moveOutputPlugin() {
  return {
    name: 'move-output',
    enforce: 'post',
    apply: 'build',
    async generateBundle(options, bundle) {
      for (const fileName in bundle) {
        if (fileName.startsWith('pages/')) {
          const newFileName = fileName.slice('pages/'.length)
          bundle[fileName].fileName = newFileName
        }
      }
    },
  }
}

// Make config async to handle glob operations
export default defineConfig(async () => {
  // Get input files
  const entries = await glob('pages/**/*.{html,jsx,tsx}')
  const inputs = Object.fromEntries(
    entries.map((file) => [
      // Remove 'pages/' prefix and file extension from the entry name
      path.relative('pages', file.slice(0, file.length - path.extname(file).length)),
      fileURLToPath(new URL(file, import.meta.url))
    ])
  )

  // Add index.html if it exists in the root
  if (await glob('index.html')) {
    inputs.index = fileURLToPath(new URL('index.html', import.meta.url))
  }

  return {
    base: '/todo-app-redux/',
    plugins: [
      liveReload(['./layout/**/*.ejs', './pages/**/*.ejs', './pages/**/*.html']),
      moveOutputPlugin(),
      react()
    ],
    server: {
      open: '/',
      watch: {
        usePolling: true,
      },
    },
    build: {
      rollupOptions: {
        input: inputs,
      },
      hmr: {
        overlay: true,  // Add this
        timeout: 30000  // Add this: Increase WebSocket timeout to 30 seconds
      },
      outDir: 'dist',
    },
  }
})