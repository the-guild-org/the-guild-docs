import editJsonFile from 'edit-json-file';
import NpmApi from 'npm-api';

import { config } from './cliConfig';

const api = new NpmApi();

const jsonConfigs: Record<string, editJsonFile.JsonEditor> = {};

export async function addDependency(dependency: string | string[], { isDev }: { isDev?: boolean } = {}) {
  const dependencies = Array.isArray(dependency) ? dependency : [dependency];

  await Promise.all(
    dependencies.map(async depName => {
      const json = (jsonConfigs[config.packageJsonPath] ||= editJsonFile(config.packageJsonPath));
      if (json.get(`dependencies.${depName}`) || json.get(`devDependencies.${depName}`)) {
        return;
      }

      const depRepo = api.repo(depName);

      const depPackageVersion =
        '^' +
        (
          await depRepo.version('latest').catch(err => {
            if (err.message === 'Not Found') throw Error(`Package "${depName}" could not be found!`);

            throw err;
          })
        ).version;

      json.set(`${isDev ? 'devDependencies' : 'dependencies'}.${depName}`, depPackageVersion);
    })
  ).finally(() => {
    Object.values(jsonConfigs).map(v => {
      const deps = v.get('dependencies');
      deps && v.set('dependencies', sortObject(deps));

      const devDeps = v.get('devDependencies');
      devDeps && v.set('devDependencies', sortObject(devDeps));

      v.save();
    });
  });
}

export function sortObject(unordered: Record<string, unknown>) {
  return Object.keys(unordered)
    .sort()
    .reduce((obj, key) => {
      obj[key] = unordered[key];
      return obj;
    }, {} as typeof unordered);
}
