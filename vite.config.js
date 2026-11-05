import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

// ملفات المحتوى والصور محفوظة خارج public في المستودع؛ ننسخها إلى dist عند البناء.
function copySiteContent() {
  return {
    name: 'fnea-copy-site-content',
    closeBundle() {
      const out = resolve('dist');
      mkdirSync(out, { recursive: true });
      for (const dir of ['data', 'images']) {
        if (existsSync(resolve(dir))) cpSync(resolve(dir), resolve(out, dir), { recursive: true });
      }
      if (existsSync('favicon.svg')) cpSync('favicon.svg', resolve(out, 'favicon.svg'));
    },
  };
}

export default defineConfig({
  plugins: [react(), copySiteContent()],
  base: './',
});
