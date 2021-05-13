import mkdirp from 'mkdirp';
import { resolve, dirname } from 'path';
import { existsSync, promises } from 'fs';
import { formatPrettier } from './prettier';
import type { BuiltInParserName } from 'prettier';

export const { writeFile } = promises;

export async function writeFileFormatIfNotExists(path: string[], content: string, parser: BuiltInParserName) {
  const writePath = resolve(...path);

  if (existsSync(writePath)) {
    console.log(`"${writePath}" already exists!`);
    return;
  }

  await mkdirp(dirname(writePath));

  await writeFile(writePath, await formatPrettier(content, parser));
}
