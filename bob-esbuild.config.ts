export const config: import('bob-esbuild').BobConfig = {
  tsc: {
    dirs: ['packages/*', '!packages/cli'],
  },
  verbose: true,
  clean: false,
  distDir: 'dist',
  keepDynamicImport: true,
};
