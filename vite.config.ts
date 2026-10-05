import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: [
        { find: /^@\/src\/(.*)/, replacement: path.resolve(__dirname, 'src/$1') },
        { find: /^@\/(.*)/, replacement: path.resolve(__dirname, 'src/$1') },
        { find: '@', replacement: path.resolve(__dirname, 'src') },
      ],
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      hmr: false,
      ws: false as const,
    },
  };
});
