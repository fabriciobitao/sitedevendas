import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

// CRITICO: um unico timestamp para define + version.json.
// Se usar Date.now() em 2 lugares, os valores diferem por ms e o auto-update entra em loop infinito.
const BUILD_TIMESTAMP = String(Date.now());

// Gera /version.json no build para o app detectar novas versoes e auto-refresh
function versionFilePlugin() {
  return {
    name: 'version-file',
    apply: 'build',
    closeBundle() {
      const outDir = resolve(process.cwd(), 'dist');
      try {
        mkdirSync(outDir, { recursive: true });
        writeFileSync(resolve(outDir, 'version.json'), JSON.stringify({ version: BUILD_TIMESTAMP }));
      } catch (e) {
        console.warn('[version-file] falha:', e);
      }
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), versionFilePlugin()],
  define: {
    __BUILD_VERSION__: JSON.stringify(BUILD_TIMESTAMP),
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return;
          if (id.includes('firebase')) return 'firebase';
          if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('dompurify')) return 'pdf';
          if (id.includes('recharts') || id.includes('d3-')) return 'charts';
          if (id.includes('react-router')) return 'router';
          if (id.includes('react') && !id.includes('recharts')) return 'react';
        },
      },
    },
  },
})
