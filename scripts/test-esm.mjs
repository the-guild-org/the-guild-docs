import { globby } from 'globby';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const mjsFiles = await globby(
  [
    '../packages/*/dist/**/*.mjs',
    '../packages/client/dist/**/*.js',
    '../packages/server/dist/**/*.js',
    '../packages/mdx-remote/dist/**/*.js',
  ],
  {
    cwd: dirname(fileURLToPath(import.meta.url)),
  },
);

const ok = [];
const fail = [];
let i = 0;

await Promise.all(
  mjsFiles.map(async filepath => {
    const mjsPath = `./${filepath}`;
    try {
      await import(mjsPath);
      ok.push(mjsPath);
    } catch (err) {
      fail.push(mjsPath);

      console.error(
        chalk.red(`\n${i += 1} ${'-'.repeat(100)}\n`),
        mjsPath,
        err,
      );
    }
  }),
);

if (ok.length > 0) {
  console.log(chalk.green(`${ok.length} OK\n${ok.join('\n')}`));
}

if (fail.length > 0) {
  console.error(chalk.red(`${fail.length} Fail\n${fail.join('\n')}`));
  console.error('❌  FAILED');
  process.exit(1);
}

if (ok.length > 0) {
  console.log('✅  OK');
  process.exit(0);
}

console.error('No files analyzed!');
process.exit(1);
