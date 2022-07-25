export const config: import('bob-esbuild').BobConfig = {
  tsc: {
    dirs: ['packages/*'],
  },
  verbose: true,
  distDir: 'dist',
  keepDynamicImport: true,
  packageConfigs: {
    'guild-docs': {
      onlyESM: true,
    },
    '@guild-docs/algolia': {
      onlyESM: true,
    },
  },
};
