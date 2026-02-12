import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import vercel from 'vite-plugin-vercel';
import { writeFileSync } from "fs";

// Plugin pour générer version.json automatiquement
const versionPlugin = () => ({
  name: 'version-plugin',
  buildStart() {
    const version = {
      version: process.env.npm_package_version || '1.0.0',
      buildTime: new Date().toISOString(),
      gitCommit: process.env.GIT_COMMIT || '',
      environment: process.env.NODE_ENV || 'development'
    };
    
    writeFileSync(
      path.resolve(__dirname, 'public/version.json'),
      JSON.stringify(version, null, 2)
    );
    
    console.log('📝 Version file generated:', version);
  }
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'https://studyiacareer-backend-qpmpz.ondigitalocean.app',
        changeOrigin: true,
        secure: false,
        headers: {
          'Origin': 'http://localhost:5173'
        }
      }
    },
  },
  plugins: [react(), vercel(), versionPlugin(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Cache busting avec hash dans les noms de fichiers
    rollupOptions: {
      output: {
        // Ajouter un hash aux noms de fichiers pour forcer le rechargement
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
        },
      },
    },
    // Use esbuild for faster builds (default in Vite)
    minify: 'esbuild',
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
}));
