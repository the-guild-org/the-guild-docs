import { resolve } from 'path';

export const config = {
  ...getPaths(),
};

export function getPaths(cwd: string = process.cwd()) {
  return {
    cwd,
    packageJsonPath: resolve(cwd, './package.json'),
  };
}

export function setConfig(conf: Partial<typeof config>) {
  Object.assign(config, conf);
}
