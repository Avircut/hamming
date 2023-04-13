import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

export default defineConfig({
  base:'/hamming/',
  build: {
    outDir: 'dist',

    rollupOptions: {
      build: {
        rollupOptions: {
          input: {
            arith: fileURLToPath(new URL('goley.html', import.meta.url)),
            accordion: fileURLToPath(
             new URL('index.html', import.meta.url) // typo here: componentes
            ),
          },
        },
      },
     input: {
        arith: fileURLToPath(new URL('goley.html', import.meta.url)),
       accordion: fileURLToPath(
          new URL('index.html', import.meta.url),
        ),
      },
    },
  },
});