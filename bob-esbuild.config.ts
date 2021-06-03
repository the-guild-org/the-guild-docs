export const config: import('bob-esbuild').BobConfig = {
  tsc: {
    dirs: ['packages/*', '!packages/cli'],
    hash: {
      folders: {
        exclude: ['bin'],
      },
    },
  },
  verbose: true,
  clean: false,
  distDir: 'lib',
};
