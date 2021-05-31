import babel from '@rollup/plugin-babel';
import { join } from 'path';
// @ts-expect-error
import image from '@rollup/plugin-image';
// @ts-expect-error
import bundleSize from 'rollup-plugin-bundle-size';

export const config: import('bob-esbuild').BobConfig = {
  tsc: {
    dirs: ['packages/*', '!packages/cli', '!packages/tgc'],
  },
  verbose: true,
  clean: false,
  plugins: process.cwd().includes('tgc')
    ? [
        babel({
          extensions: ['.tsx', '.ts'],
          configFile: join(__dirname, '.babelrc'),
        }),
        image(),
        bundleSize(),
      ]
    : undefined,
};
