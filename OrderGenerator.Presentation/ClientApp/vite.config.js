import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:7001',
                changeOrigin: true
            }
        },
        port: 3000
    },
    build: {
        outDir: '../wwwroot',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html')
            }
        }
    },
    root: '.', // Define a raiz como a pasta ClientApp
})