import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/server': {
                target: 'https://vinodel.prostoweb.su',
                changeOrigin: true,
                secure: false,
            }
        }
    }
})