import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: false,
    chunkSizeWarningLimit: 1000,
    // ✅ Remove manualChunks to avoid React runtime break
    // rollupOptions: {
    //   output: {
    //     manualChunks(id) {
    //       if (id.includes('node_modules')) {
    //         if (id.includes('react')) {
    //           return 'react-vendor';
    //         }
    //         if (id.includes('lucide')) {
    //           return 'icons';
    //         }
    //         if (id.includes('@radix-ui')) {
    //           return 'ui';
    //         }
    //         return 'vendor';
    //       }
    //     }
    //   }
    // }
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('https://backend-deployment-gamma.vercel.app/'),
  },
});
