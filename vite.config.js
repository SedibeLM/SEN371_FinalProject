import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vitejs.dev/config/
export default defineConfig({
 plugins: [react()],
 server: {
   port: 5173,        // default Vite port
   open: true,        // auto-open browser when server starts
 },
 resolve: {
   alias: {
     '@': '/src',     // allows you to import like "@/components/..."
   },
 },
})