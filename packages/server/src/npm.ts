import { promises } from 'fs';
import fetch from 'node-fetch';
import { NpmsIO, PackageInfo } from 'npms.io';
import Lru from 'tiny-lru';

import { withoutStartingSlash, withoutTrailingSlash, withStartingSlash } from './utils';

const npmsIO = new NpmsIO();
const cache = Lru<PackageInfo>(100, 3.6e6); // 1h

export interface Package<Tags extends string = string> {
  identifier: string;
  title: string;
  npmPackage: string;
  tags: Tags[];
  readme?: string;
  iconUrl?: string;
  githubReadme?: {
    repo: string;
    path: string;
  };
  devFilePath?: string;
}

export interface PackageWithStats<Tags extends string = string> extends Package<Tags> {
  stats: PackageInfo | undefined | null;
}

export async function getPackageStats(name: string): Promise<PackageInfo | null> {
  try {
    return await npmsIO.api.package.packageInfo(name);
  } catch (e) {
    return null;
  }
}

export interface GetPackagesOptions<Tags extends string = string> {
  idSpecific?: string | null;
  packageList: Package<Tags>[];
}

export async function getPackagesData<Tags extends string = string>({
  idSpecific,
  packageList,
}: GetPackagesOptions<Tags>): Promise<PackageWithStats<Tags>[]> {
  let packages = packageList;

  if (idSpecific) {
    const rawData = packageList.find(t => t.identifier === idSpecific);

    if (!rawData) return [];

    packages = [rawData];
  }

  const allPackages = await Promise.all(
    packages.map(async (rawData): Promise<PackageWithStats<Tags>> => {
      const statsPromise = cache.get(rawData.title) || getPackageStats(rawData.npmPackage);

      const readmePromise = (async () => {
        if (rawData.readme) {
          return rawData.readme;
        } else if (rawData.devFilePath && process.env.NODE_ENV === 'development') {
          return promises.readFile(rawData.devFilePath, {
            encoding: 'utf-8',
          });
        } else if (rawData.githubReadme) {
          const fetchPath = `https://raw.githubusercontent.com/${withoutStartingSlash(
            withoutTrailingSlash(rawData.githubReadme.repo)
          )}/HEAD${withStartingSlash(rawData.githubReadme.path)}`;
          try {
            const response = await fetch(fetchPath, {
              method: 'GET',
            });

            if (response.status === 404) {
              console.error(`[GUILD-DOCS] ERROR | ${fetchPath} Not Found`);
              return;
            }

            const text = await response.text();

            return text;
          } catch (err) {
            console.error('[GUILD-DOCS] ERROR | Error while trying to get README from GitHub ' + fetchPath);
            console.error(err);
          }
        }
        const stats = await statsPromise;
        if (stats?.collected.metadata.links.repository && stats.collected.metadata.repository?.directory) {
          const path = withoutTrailingSlash(withStartingSlash(stats.collected.metadata.repository.directory));

          const fetchPath = `${
            withoutTrailingSlash(
              stats.collected.metadata.links.repository.replace('https://github.com', 'https://raw.githubusercontent.com')
            ) + '/HEAD'
          }${path}/README.md`;

          try {
            const response = await fetch(fetchPath, {
              method: 'GET',
            });

            if (response.status === 404) {
              console.error(`[GUILD-DOCS] ERROR | ${fetchPath} Not Found`);
              return;
            }

            const text = await response.text();

            return text;
          } catch (err) {
            console.error('[GUILD-DOCS] ERROR | Error while trying to get README from GitHub ' + fetchPath);
            console.error(err);
          }
        }

        return undefined;
      })();

      const [stats, readme] = await Promise.all([statsPromise, readmePromise]);

      if (!readme) {
        console.warn(`[GUILD-DOCS] WARNING | README could not be found for ${rawData.identifier}`);
      }

      if (stats && !cache.has(rawData.title)) {
        cache.set(rawData.title, stats);
      }

      const data = {
        ...rawData,
        readme,
        stats,
      };

      //@ts-expect-error
      for (const key in data) data[key] === undefined && delete data[key];

      return data;
    })
  );

  return allPackages;
}
