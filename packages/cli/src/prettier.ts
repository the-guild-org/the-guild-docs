import { format, resolveConfig } from 'prettier';

import type { BuiltInParserName } from 'prettier';

export async function formatPrettier(str: string, parser: BuiltInParserName): Promise<string> {
  const prettierConfig = Object.assign({}, await resolveConfig(process.cwd()));

  return format(str, {
    parser,
    ...prettierConfig,
  });
}
