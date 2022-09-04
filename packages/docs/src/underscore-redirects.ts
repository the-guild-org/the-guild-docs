import { writeFile } from 'fs/promises';
import { join } from 'path';

class RunPromiseWebpackPlugin {
  asyncHook;

  constructor(asyncHook: () => Promise<void>) {
    this.asyncHook = asyncHook;
  }

  apply(compiler: any) {
    compiler.hooks.beforeCompile.tapPromise('RunPromiseWebpackPlugin', this.asyncHook);
  }
}

export function applyUnderscoreRedirects(config: any, meta: any) {
  config.plugins.push(
    new RunPromiseWebpackPlugin(async () => {
      const outDir = meta.dir;
      const outFile = join(outDir, './public/_redirects');

      try {
        const redirects: any[] = meta.config.redirects
          ? Array.isArray(typeof meta.config.redirects)
            ? typeof meta.config.redirects
            : await meta.config.redirects()
          : [];

        if (redirects.length > 0) {
          const redirectsTxt = redirects
            .map(r => `${r.source} ${r.destination} ${r.permanent ? '301' : '302'}`)
            .join('\n');
          await writeFile(outFile, redirectsTxt);
        } else {
          console.warn(`No redirects defined, no "_redirect" file is created!`);
        }
      } catch (e) {
        console.error('Error while generating redirects file: ', e);
        throw new Error(`Failed to generate "_redirects" file during build: ${(e as Error).message}`);
      }
    })
  );
}
