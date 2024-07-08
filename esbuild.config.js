import { build } from 'esbuild';
import { dirname, resolve } from 'path';
import { existsSync, mkdirSync, copyFileSync } from 'fs';

// Function to copy files
const copyFile = (source, destination) => {
  if (!existsSync(dirname(destination))) {
    mkdirSync(dirname(destination), { recursive: true });
  }
  copyFileSync(source, destination);
};

// Paths to files
const wasmSource = resolve(__dirname, 'src/webp_converter.wasm');
const wasmDest = resolve(__dirname, 'dist/webp_converter.wasm');
copyFile(wasmSource, wasmDest);

const dtsSource = resolve(__dirname, 'src/webp_converter.d.ts');
const dtsDest = resolve(__dirname, 'dist/webp_converter.d.ts');
copyFile(dtsSource, dtsDest);

// Build with esbuild
build({
  entryPoints: ['src/lib.ts'],
  bundle: true,
  sourcemap: true,
  minify: true,
  outdir: 'dist',
  format: 'esm',
  target: ['es2020'],
  loader: {
    '.js': 'js',
    '.ts': 'ts',
    '.wasm': 'file'
  },
  external: ['fs', 'path'],
}).catch(() => process.exit(1));
