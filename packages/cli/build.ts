import { build } from 'esbuild';
import { join } from 'path';

async function main() {
  await build({
    entryPoints: [join(__dirname, 'src/index.ts')],
    platform: 'node',
    bundle: true,
    target: 'node13.2',
    format: 'cjs',
    outfile: join(__dirname, './lib/index.js'),
    minify: true,
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
