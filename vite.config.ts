import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // In prod, app will be served under `demo.iex.ec/pem` path
  const basePath = env.SET_SUBPATH_FOR_PROD === 'true' ? '/pem' : '/';
  console.log('[vite] Building with base path:', basePath);
  return {
    base: basePath,
    plugins: [
      react(),
      // visualizer(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
