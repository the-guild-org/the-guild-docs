import type { IRoutes, Paths } from '@guild-docs/types';

/**
 * Compare function designed to ignore trailing slashes when comparing paths
 */
export function arePathnamesEqual(a: string, b: string): boolean {
  return withTrailingSlash(withoutUrlQuery(a)) === withTrailingSlash(withoutUrlQuery(b));
}

export function withoutUrlQuery(v: string): string {
  return v.split('#')[0] as string;
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
  return (
    (acumHref !== '/' ? acumHref + '/' : acumHref) + (currentHref === 'index' || currentHref === 'README' ? '' : currentHref)
  );
}

function subCategoryPaths(href: string, { $name, $sidebar, $routes, _: entryRoutes = {} }: IRoutes) {
  return {
    href,
    name: $name,
    sidebar: $sidebar,
    paths: iterateRoutes({ $routes, _: entryRoutes }),
    isPage:
      !!$routes?.find(v => {
        const singleValue = Array.isArray(v) ? v[0] : v;
        return singleValue === 'index' || singleValue === 'README';
      }) || Object.keys(entryRoutes).some(v => v === 'index' || v === 'README'),
  };
}

export function iterateRoutes(routes: IRoutes, paths: Paths[] = []): Paths[] {
  const { $routes, _: restRoutes = {} } = routes;

  if ($routes) {
    for (const route of $routes) {
      const [href, name, sidebar] = Array.isArray(route) ? route : [route, route];
      if (paths.find(v => v.href === href)) continue;

      // Reference to a sub-category
      if (href.startsWith('$')) {
        const cleanHref = href.slice(1);
        const restRouteValue = restRoutes[cleanHref];

        // If reference is not found, skip, warning only to server-side
        if (!restRouteValue) {
          if (typeof window === 'undefined') console.warn(`Reference to sub-category ${href} could not be found!`);
          continue;
        }

        paths.push(subCategoryPaths(cleanHref, restRouteValue));
        continue;
      }

      paths.push({
        href,
        name,
        sidebar,
        isPage: true,
      });
    }
  }
  for (const [href, routesValue] of Object.entries(restRoutes)) {
    const existingPath = paths.find(v => v.href === href);

    // Don't duplicate sub-categories
    if (existingPath) {
      Object.assign(existingPath, subCategoryPaths(href, routesValue));

      continue;
    }
    paths.push(subCategoryPaths(href, routesValue));
  }

  return paths;
}
