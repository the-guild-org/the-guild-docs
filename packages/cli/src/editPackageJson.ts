import { promises, readFileSync } from 'fs';
import get from 'lodash/get.js';
import set from 'lodash/set.js';
import NpmApi from 'npm-api';
import { config } from './cliConfig';
import { formatPrettier } from './prettier';

const api = new NpmApi();

export type PackageJson = Record<
  string,
  {
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    pnpm?: {
      overrides?: Record<string, string>;
    };
    resolutions?: Record<string, string>;
  }
>;

const jsonConfigs: Record<string, PackageJson> = {};

function readPackageJson(packageJsonPath: string): PackageJson {
  try {
    return JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  } catch (err) {
    return {
      scripts: {},
      dependencies: {},
      devDependencies: {},
    };
  }
}

export async function savePackageJson() {
  await Promise.all(
    Object.entries(jsonConfigs).map(async ([packageJsonPath, obj]) => {
      await promises.writeFile(packageJsonPath, await formatPrettier(JSON.stringify(obj), 'json'));
    })
  );
}

export function addPackageScripts(scripts: Record<string, string>) {
  const json = (jsonConfigs[config.packageJsonPath] ||= readPackageJson(config.packageJsonPath));

  Object.entries(scripts).forEach(([name, content]) => {
    if (get(json, `scripts.${name}`)) {
      return;
    }

    set(json, `scripts.${name}`, content);
  });
}

export function addPackageResolutions(resolutions: Record<string, string>) {
  const json = (jsonConfigs[config.packageJsonPath] ||= readPackageJson(config.packageJsonPath));

  Object.entries(resolutions).forEach(([name, content]) => {
    set(json, `pnpm.overrides.${name}`, content);
    set(json, `resolutions.${name}`, content);
  });
}

export async function addDependency(
  dependency: string | string[],
  {
    isDev,
    version,
  }: {
    isDev?: boolean;
    /**
     * @default "latest"
     */
    version?: string;
  } = {}
) {
  const dependencies = Array.isArray(dependency) ? dependency : [dependency];

  await Promise.all(
    dependencies.map(async depName => {
      const json = (jsonConfigs[config.packageJsonPath] ||= readPackageJson(config.packageJsonPath));
      if (get(json, `dependencies.${depName}`) || get(json, `devDependencies.${depName}`)) {
        return;
      }

      const depRepo = api.repo(depName);

      const depPackageVersion =
        version ||
        '^' +
          (
            await depRepo.version('latest').catch(err => {
              if (err.message === 'Not Found') throw Error(`Package "${depName}" could not be found!`);

              throw err;
            })
          ).version;

      set(json, `${isDev ? 'devDependencies' : 'dependencies'}.${depName}`, depPackageVersion);
    })
  ).finally(async () => {
    await Promise.all(
      Object.values(jsonConfigs).map(async v => {
        const deps = get(v, 'dependencies');
        deps && set(v, 'dependencies', sortObject(deps));

        const devDeps = get(v, 'devDependencies');
        devDeps && set(v, 'devDependencies', sortObject(devDeps));
      })
    );
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
