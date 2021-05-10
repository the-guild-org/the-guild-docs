#!/usr/bin/env node

import { program } from 'commander';

program.version(require('../package.json').version).description('Guild Docs CLI');

program.parse(process.argv);
