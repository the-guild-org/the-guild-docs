export const config: import('bob-esbuild').BobConfig = {
  tsc: {
    dirs: ['packages/*'],
  },
  verbose: true,
  distDir: 'dist',
  keepDynamicImport: true,
  packageConfigs: {
    '@guild-docs/client': {
      onlyESM: true,
    },
    '@guild-docs/server': {
      onlyESM: true,
    },
  },
};
