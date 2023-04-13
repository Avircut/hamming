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
            goley: fileURLToPath(new URL('goley.html', import.meta.url)),
            hamming: fileURLToPath(
             new URL('index.html', import.meta.url) // typo here: componentes
            ),
          },
        },
      },
     input: {
        goley: fileURLToPath(new URL('goley.html', import.meta.url)),
       hamming: fileURLToPath(
          new URL('index.html', import.meta.url),
        ),
      },
    },
  },
});