import type { IRoutes, Paths } from '@guild-docs/types';

export function arePathnamesEqual(a: string, b: string) {
  if (a.endsWith('/') && b.endsWith('/')) return a === b;
  else if (a.endsWith('/')) return a.slice(0, a.length - 1) === b;
  else if (b.endsWith('/')) return b.slice(0, b.length - 1) === a;
  return a === b;
}

export function iterateRoutes(routes: IRoutes, paths: Paths[] = []): Paths[] {
  const { $routes, _: restRoutes = {} } = routes;

  for (const [href, { $name, $routes, _: entryRoutes = {} }] of Object.entries(restRoutes)) {
    paths.push({
      href,
      name: $name,
      paths: iterateRoutes({ $routes, _: entryRoutes }),
      isPage: !!$routes?.find(v => (Array.isArray(v) ? v[0] : v) === 'index') || Object.keys(entryRoutes).includes('index'),
    });
  }

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

  return paths;
}
