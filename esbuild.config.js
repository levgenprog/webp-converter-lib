const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

esbuild.build({
  entryPoints: ['src/lib.ts'],
  bundle: true,
  format: 'esm',
  outfile: 'dist/index.js',
  platform: 'browser',
  target: ['esnext'],
  sourcemap: true,
  loader: {
    '.wasm': 'file', // Treat WASM files as file assets
  },
  define: {
    'process.env.NODE_ENV': '"production"',
    'global': 'window',
  },
  plugins: [
    {
      name: 'mock-node-modules',
      setup(build) {
        build.onResolve({ filter: /^fs$/ }, () => ({
          path: 'fs',
          namespace: 'mock-node-modules',
        }));

        build.onResolve({ filter: /^path$/ }, () => ({
          path: 'path',
          namespace: 'mock-node-modules',
        }));

        build.onLoad({ filter: /.*/, namespace: 'mock-node-modules' }, (args) => {
          if (args.path === 'fs' || args.path === 'path') {
            return {
              contents: 'export default {};',
              loader: 'js',
            };
          }
        });
      },
    },
    {
      name: 'wasm-loader',
      setup(build) {
        build.onResolve({ filter: /\.wasm$/ }, args => ({
          path: path.join(args.resolveDir, args.path),
          namespace: 'wasm',
        }));

        build.onLoad({ filter: /.*/, namespace: 'wasm' }, async (args) => {
          const wasmPath = args.path;
          const buffer = await fs.promises.readFile(wasmPath);
          const base64 = buffer.toString('base64');
          return {
            contents: `export default "${base64}"`,
            loader: 'text',
          };
        });
      },
    },
  ],
}).catch(() => process.exit(1));
