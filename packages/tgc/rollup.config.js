import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import autoExternal from 'rollup-plugin-auto-external';
import image from '@rollup/plugin-image';
import bundleSize from 'rollup-plugin-bundle-size';

import { join, resolve } from 'path';

function bundle() {
  return {
    input: 'src/index.tsx',
    output: [
      {
        file: join(__dirname, 'lib/index.esm.js'),
        format: 'es',
        sourcemap: true,
      },
      {
        file: join(__dirname, 'lib/index.js'),
        format: 'cjs',
        sourcemap: true,
      },
    ],
    external: ['react-player/lazy', 'algoliasearch/lite'],
    plugins: [
      nodeResolve({ extensions: ['.ts', '.tsx'] }),
      autoExternal({
        packagePath: resolve('package.json'),
        builtins: true,
        dependencies: true,
        peerDependencies: true,
      }),
      babel({
        extensions: ['.tsx', '.ts'],
        configFile: join(__dirname, '.babelrc'),
      }),
      image(),
      bundleSize(),
    ],
  };
}

export default bundle;
