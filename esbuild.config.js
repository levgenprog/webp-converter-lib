const esbuild = require('esbuild');
const fs = require('fs');

esbuild.build({
  entryPoints: ['src/lib.ts'],
  bundle: true,
  format: 'cjs',
  outfile: 'dist/index.js',
  platform: 'node',
  target: ['node14'],
  sourcemap: true,
  plugins: [
    {
      name: 'wasm-loader',
      setup(build) {
        build.onResolve({ filter: /\.wasm$/ }, args => ({
          path: args.path,
          namespace: 'wasm',
        }));

        build.onLoad({ filter: /.*/, namespace: 'wasm' }, async (args) => {
          const wasmPath = require.resolve(`./src/${args.path}`);
          const buffer = await fs.promises.readFile(wasmPath);
          const base64 = buffer.toString('base64');
          return {
            contents: `export default Buffer.from('${base64}', 'base64')`,
            loader: 'text',
          };
        });
      },
    },
  ],
}).catch(() => process.exit(1));
