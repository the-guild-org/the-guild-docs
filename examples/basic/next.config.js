const { register } = require('esbuild-register/dist/node');

register({
  extensions: ['.ts', '.tsx'],
});

const { i18n } = require('./next-i18next.config');

const { withGuildDocs } = require('guild-docs/lib/server');

const { getRoutes } = require('./routes.ts');

module.exports = withGuildDocs({
  i18n,
  getRoutes,
});
