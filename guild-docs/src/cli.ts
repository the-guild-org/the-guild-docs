#!/usr/bin/env node

import { program } from 'commander';
import { getPaths, setConfig } from './cli/cliConfig';
import { addDependency } from './cli/editPackageJson';
import { writeApp, writei18Config, writeNextConfig, writeRoutes, writeTranslations } from './cli/nextConfig';

program.version(require('../package.json').version).description('Guild Docs CLI');

program
  .command('deps [dir]')
  .description('Add deps to specified directory (default: process.cwd())')
  .action(async (dir: string = process.cwd()) => {
    setConfig(getPaths(dir));

    await Promise.all([
      addDependency([
        'guild-docs',
        '@chakra-ui/react',
        '@chakra-ui/icons',
        '@emotion/react',
        '@emotion/styled',
        'framer-motion',
        'next',
        'remark-admonitions',
        'prism-themes',
        'next-i18next',
      ]),
      addDependency(
        [
          'esbuild',
          '@types/node',
          '@types/react',
          '@types/react-dom',
          'typescript',
          'open-cli',
          'wait-on',
          'concurrently',
          '@types/wait-on',
          '@types/concurrently',
          'tsup',
        ],
        {
          isDev: true,
        }
      ),
    ]);

    console.log('Dependencies added!');
  });

program
  .command('config [dir]')
  .description('Create configuration file (default: process.cwd())')
  .action(async (dir: string = process.cwd()) => {
    setConfig(getPaths(dir));

    await Promise.all([writeNextConfig(), writei18Config(), writeRoutes(), writeTranslations(), writeApp()]);

    console.log('Configuration files added!');
  });

program.parse(process.argv);
