import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' — чтобы собранную страницу можно было открыть просто файлом
export default defineConfig({
  base: './',
  plugins: [react()],
})
