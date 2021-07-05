import Lru from 'tiny-lru';
import { NpmsIO, PackageInfo } from 'npms.io';

const npmsIO = new NpmsIO();
const cache = Lru<PackageInfo>(100, 3.6e6); // 1h

export interface Package<Tags extends string = string> {
  identifier: string;
  title: string;
  npmPackage: string;
  tags: Tags[];
  readme?: string;
  iconUrl?: string;
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
      const stats = cache.get(rawData.title) || (await getPackageStats(rawData.npmPackage));

      if (stats && !cache.has(rawData.title)) {
        cache.set(rawData.title, stats);
      }

      return {
        ...rawData,
        stats,
      };
    })
  );

  return allPackages;
}
