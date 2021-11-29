#!/usr/bin/env node

import { program } from 'commander';
import mkdirp from 'mkdirp';
import { dirname, resolve } from 'path';
import { config, getPaths, setConfig } from './cliConfig';
import { addDependency, addPackageScripts } from './editPackageJson';
import {
  writeApp,
  writeDocPages,
  writeDocsDirectory,
  writeDocument,
  writei18Config,
  writeNextConfig,
  writeRoutes,
  writeTranslations,
  writeTSConfig,
} from './nextConfig';

program.version(require(resolve(__dirname, '../package.json')).version).description('Guild Docs CLI');

async function DepsAction(dir: string = process.cwd()) {
  setConfig(getPaths(dir));

  await mkdirp(dirname(config.packageJsonPath));

  await Promise.all([
    addDependency([
      '@guild-docs/client',
      '@guild-docs/server',
      '@mdx-js/react',
      '@chakra-ui/react',
      '@chakra-ui/theme-tools',
      '@chakra-ui/icons',
      '@chakra-ui/utils',
      '@emotion/react',
      '@emotion/styled',
      'framer-motion',
      'next',
      'remark-admonitions',
      'next-i18next',
      'react',
      'react-dom',
      '@theguild/components',
      'react-icons',
      'react-use',
      'next-seo',
      'shiki',
    ]),
    addDependency(
      [
        'esbuild',
        'bob-tsm',
        '@types/node',
        '@types/react',
        '@types/react-dom',
        '@types/mdx-js__react',
        'typescript',
        'concurrently',
        '@types/concurrently',
        'open-cli',
        'wait-on',
        'next-remote-watch',
        '@next/bundle-analyzer',
        'cross-env',
      ],
      {
        isDev: true,
      }
    ),
    addPackageScripts({
      build: 'next build',
      dev: 'concurrently -r "next-remote-watch ./docs ./routes.ts ./src/pages/_app.tsx ./src/pages/_document.tsx" "wait-on -s 1 http://localhost:3000 && open-cli http://localhost:3000"',
      next: 'next',
      start: 'next start',
      analyze: 'cross-env ANALYZE=true next build',
    }),
  ]);

  console.log('Dependencies added!');

  console.log(
    `If this docs website is in a monorepo, please copy the "pnpm.overrides" or "resolutions" fields in your root package.json`
  );
}

program.command('deps [dir]').description('Add deps to specified directory (default: process.cwd())').action(DepsAction);

async function ConfigAction(dir: string = process.cwd()) {
  setConfig(getPaths(dir));

  await Promise.all([
    writeNextConfig(),
    writei18Config(),
    writeRoutes(),
    writeTranslations(),
    writeApp(),
    writeDocPages(),
    writeDocsDirectory(),
    writeTSConfig(),
    writeDocument(),
  ]);

  console.log('Configuration files added!');
}

program.command('config [dir]').description('Create needed configurations files (default: process.cwd())').action(ConfigAction);

async function InitAction(dir: string = process.cwd()) {
  setConfig(getPaths(dir));

  await Promise.all([DepsAction(dir), ConfigAction(dir)]);

  console.log(
    `\n\nNow you can install dependencies: "pnpm i", "yarn" or "npm i"; and then run the "dev" script, either "pnpm dev", "yarn dev" or "npm run dev"`
  );
}

program
  .command('init [dir]')
  .description("Initialize a docs package, adding it's dependencies & minimum configuration files")
  .action(InitAction);

program
  .parseAsync(process.argv)
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
