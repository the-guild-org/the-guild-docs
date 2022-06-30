/* eslint-disable @typescript-eslint/no-var-requires */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

require('bob-tsm');

const { i18n } = require('./next-i18next.config.js');

const { withGuildDocs } = require('@guild-docs/server');

const { getRoutes } = require('./routes.ts');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(
  withGuildDocs({
    i18n,
    getRoutes,
  }),
);
