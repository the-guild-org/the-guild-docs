export const config: import('bob-esbuild').BobConfig = {
  tsc: {
    dirs: ['packages/*', '!packages/cli'],
  },
  verbose: true,
  clean: false,
  distDir: 'dist',
  keepDynamicImport: true,
  packageConfigs: {
    '@guild-docs/mdx-remote': {
      onlyESM: true,
    },
    '@guild-docs/client': {
      onlyESM: true,
    },
  },
};
