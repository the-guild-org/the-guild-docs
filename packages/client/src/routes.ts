import type { IRoutes, Paths } from '@guild-docs/types';

/**
 * Compare function designed to ignore trailing slashes when comparing paths
 */
export function arePathnamesEqual(a: string, b: string): boolean {
  return withTrailingSlash(withoutUrlQuery(a)) === withTrailingSlash(withoutUrlQuery(b));
}

export function withoutUrlQuery(v: string): string {
  return v.split('#')[0]!;
}

export function withTrailingSlash(v: string) {
  if (v.endsWith('/')) return v;
  return v + '/';
}

export function withoutTrailingSlash(v: string) {
  if (v === '/') return v;
  if (v.endsWith('/')) return v.slice(0, v.length - 1);
  return v;
}

export function concatHrefs(acumHref: string, currentHref: string) {
  return (acumHref !== '/' ? acumHref + '/' : acumHref) + (currentHref === 'index' ? '' : currentHref);
}

export function iterateRoutes(routes: IRoutes, paths: Paths[] = []): Paths[] {
  const { $routes, _: restRoutes = {} } = routes;

  if ($routes) {
    for (const route of $routes) {
      const [href, name] = Array.isArray(route) ? route : [route, route];
      if (paths.find(v => v.href === href)) continue;
      paths.push({
        href,
        name,
        isPage: true,
      });
    }
  }
  for (const [href, { $name, $routes, _: entryRoutes = {} }] of Object.entries(restRoutes)) {
    paths.push({
      href,
      name: $name,
      paths: iterateRoutes({ $routes, _: entryRoutes }),
      isPage: !!$routes?.find(v => (Array.isArray(v) ? v[0] : v) === 'index') || Object.keys(entryRoutes).includes('index'),
    });
  }

  return paths;
}
