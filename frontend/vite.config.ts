import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    port: 3000,
    host: '0.0.0.0', // Explicitly bind to all interfaces
    allowedHosts: true
  },
  plugins: [
    react({
      tsDecorators: true,
      plugins: [],
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add esbuild configuration as fallback
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@vitejs/plugin-react-swc']
  },
  // Build configuration
  build: {
    sourcemap: mode === 'development',
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress certain warnings
        if (warning.code === 'THIS_IS_UNDEFINED') return;
        warn(warning);
      },
      output: {
        assetFileNames: 'assets/[name][extname]'
      }
    }
  },
  publicDir: 'public',
}));
