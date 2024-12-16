import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  experimentalDts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});
