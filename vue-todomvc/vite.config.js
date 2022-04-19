import { defineConfig, splitVendorChunkPlugin  } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), splitVendorChunkPlugin()],
  define: {
    __VUE_OPTIONS_API__: false
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
      }
    }
  }
})
