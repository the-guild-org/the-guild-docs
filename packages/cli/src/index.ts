#!/usr/bin/env node

import { program } from 'commander';
import mkdirp from 'mkdirp';
import { dirname } from 'path';
import { config, getPaths, setConfig } from './cliConfig';
import { addDependency, addPackageScripts, savePackageJson } from './editPackageJson';
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

import pkg from '../package.json';

program.version(pkg.version).description('Guild Docs CLI');

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
        'typescript',
        'concurrently',
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
      analyze: 'cross-env ANALYZE=true next build',
      build: 'next build',
      dev: 'concurrently -r yarn:dev:*',
      'dev:open': 'wait-on http://localhost:3000 && open-cli http://localhost:3000',
      'dev:watch': 'next-remote-watch ./docs ./src/pages/_app.tsx ./src/pages/_document.tsx',
      next: 'next',
      start: 'next start',
    }),
  ]);

  await savePackageJson();

  console.log('Dependencies added!');
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
