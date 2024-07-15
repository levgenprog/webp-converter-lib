const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/lib.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  format: 'esm',
  target: ['es2020'],
  external: ['react'],
  loader: {
    '.wasm': 'file',
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
}).catch(() => process.exit(1));
