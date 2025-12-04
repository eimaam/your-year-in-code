import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/app.ts'],
  format: ['esm'],
  target: 'node18',
  clean: true,
  splitting: false,
  treeshake: true,
  minify: false,
  sourcemap: true,
  dts: false,
  external: [
    'dotenv',
    'express',
    'cors',
    'mongoose',
    'bcryptjs',
    'jsonwebtoken',
    'cookie-parser',
    'express-rate-limit',
    'google-auth-library',
    'winston',
  ],
  esbuildOptions(options) {
    options.platform = 'node';
  },
  // Handle path aliases
  tsconfig: './tsconfig.json',
});

