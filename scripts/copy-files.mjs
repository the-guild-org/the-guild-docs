import path from 'node:path';
import fs from 'node:fs/promises';

const CWD = process.cwd();

const promises = [
  path.join(CWD, 'packages/server/src/postcss.config.cjs'),
  path.join(CWD, 'packages/server/src/tailwind.config.cjs'),
  path.join(CWD, 'packages/client/src/styles.css'),
].map(async filePath => {
  const content = await fs.readFile(filePath);
  const newFilePath = filePath.replace('/src/', '/dist/');

  await fs.writeFile(newFilePath, content);
  console.log('✅', path.relative(CWD, newFilePath), 'copied!');
});

await Promise.all(promises);
