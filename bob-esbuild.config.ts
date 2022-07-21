export const config: import('bob-esbuild').BobConfig = {
  tsc: {
    dirs: ['packages/*'],
  },
  verbose: true,
  clean: false,
  distDir: 'dist',
  keepDynamicImport: true,
  packageConfigs: {
    '@guild-docs/client': {
      onlyESM: true,
    },
    '@guild-docs/server': {
      onlyESM: true,
      inputFiles: ['src/postcss.config.js', 'src/tailwind.config.js'],
    },
  },
};
