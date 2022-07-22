import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { globby } from 'globby';
import chalk from 'chalk';

const mjsFiles = await globby('../packages/{docs,algolia}/dist/**/*.js', {
  cwd: dirname(fileURLToPath(import.meta.url)),
});

const ok = [];
const fail = [];
let i = 0;

await Promise.all(
  mjsFiles.map(async filepath => {
    const mjsPath = `./${filepath}`;

    // TODO: temporarily ignore
    if (mjsPath === './../packages/docs/dist/mermaid.js') {
      return;
    }

    try {
      await import(mjsPath);
      ok.push(mjsPath);
    } catch (err) {
      fail.push(mjsPath);

      console.error(chalk.red(`\n${(i += 1)} ${'-'.repeat(100)}\n`), mjsPath, err);
    }
  })
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
