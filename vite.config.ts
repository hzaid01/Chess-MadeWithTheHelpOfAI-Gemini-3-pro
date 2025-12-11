import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  // Use relative path for Capacitor/Android builds, GitHub Pages path for web deployments
  const isCapacitorBuild = process.env.CAPACITOR_BUILD === 'true';
  return {
    base: isCapacitorBuild ? './' : '/Chess-MadeWithTheHelpOfAI-Gemini-3-pro/',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env': {}
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
