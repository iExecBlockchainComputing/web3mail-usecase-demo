import path from 'path';
import react from '@vitejs/plugin-react';
// import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import { execSync } from 'child_process';

export default defineConfig(({ command }) => {
  let commitHash;
  if (command === 'build') {
    commitHash = execSync('git rev-parse --short HEAD').toString();
  }
  return {
    define: {
      __COMMIT_HASH__: commitHash
        ? JSON.stringify(commitHash)
        : JSON.stringify('(not set in dev mode)'),
    },
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
