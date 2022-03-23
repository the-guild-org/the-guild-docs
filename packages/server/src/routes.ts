import { readFileSync } from 'fs';
import { globbySync } from 'globby';
import matter from 'gray-matter';

import type { IRoutes } from '@guild-docs/types';

export function getSlug({ path, replaceBasePath }: { path: string; replaceBasePath?: string }) {
  let slugPath = path.replace(/\.mdx?$/, '');

  if (replaceBasePath) slugPath = slugPath.replace(replaceBasePath, '');

  const slug = slugPath.split('/').filter(v => !!v);

  return slug;
}

export interface AddRoutesConfig {
  Routes?: IRoutes;
  folderPattern?: string;
  basePath?: string;
  basePathLabel?: string;
  replaceBasePath?: string;
  labels?: Record<string, string | [title: string, sidebar_label: string] | undefined>;
  ignorePaths?: string[];
}

function getTitle(value: string | [title: string, sidebar_label: string]): string {
  return Array.isArray(value) ? value[0] : value;
}

function getSidebarLabel(value: string | [title: string, sidebar_label: string]): string {
  return Array.isArray(value) ? value[1] : value;
}

export function GenerateRoutes(config: AddRoutesConfig) {
  const {
    basePath,
    basePathLabel,
    folderPattern,
    Routes = {},
    replaceBasePath = config.folderPattern,
    labels = {},
    ignorePaths,
  } = config;

  const baseRoutes: IRoutes = basePathLabel ? ({ $name: basePathLabel } as IRoutes) : {};

  if (folderPattern) {
    for (const path of globbySync(folderPattern)) {
      if (!/\.mdx?$/.test(path)) continue;

      const md = readFileSync(path);

      const data: { [P in 'sidebar_label' | 'title']?: string } = matter(md).data;

      const slugList = getSlug({
        path,
        replaceBasePath,
      });

      let currentRoute = basePath ? ((Routes._ ||= {})[basePath] ||= baseRoutes) : Routes;

      let acumSlug = '';
      for (const [index, slug] of slugList.entries()) {
        acumSlug += slug;
        if (ignorePaths?.some(path => acumSlug.startsWith(path))) continue;

        if (index === slugList.length - 1) {
          const currentRouteRoutes = (currentRoute.$routes ||= []);
          const existingRouteIndex = currentRouteRoutes.findIndex(v => (Array.isArray(v) ? v[0] : v) === slug);
          const existingRoute = currentRouteRoutes[existingRouteIndex];

          const sidebar = data.sidebar_label || labels[acumSlug];

          const sidebarRest = sidebar ? ([getSidebarLabel(sidebar)] as const) : ([] as const);

          // Only overwrite the titles and prevent duplication of routes
          if (existingRoute) {
            const title = data.title || labels[acumSlug];
            // We ignore the case where title is not specified, but yes sidebar label
            if (title) {
              currentRouteRoutes[existingRouteIndex] = [
                Array.isArray(existingRoute) ? existingRoute[0] : existingRoute,
                getTitle(title),
                ...sidebarRest,
              ];
            }
          } else {
            const title = data.title || labels[acumSlug];

            currentRouteRoutes.push([slug, title ? getTitle(title) : slug, ...sidebarRest]);
          }

          const readmeIndex = currentRouteRoutes.findIndex(value => {
            if (Array.isArray(value)) {
              const href = value[0];
              return href === 'README' || href === 'index';
            }
            return value === 'README' || value === 'index';
          });

          // Always put Index at the beggining
          if (readmeIndex !== -1 && readmeIndex !== 0) {
            const readmeRoute = currentRouteRoutes[readmeIndex];

            if (readmeRoute) {
              currentRouteRoutes.splice(readmeIndex, 1);
              currentRouteRoutes.unshift(readmeRoute);
            }
          }
        } else {
          currentRoute = (currentRoute._ ||= {})[slug] ||= {};

          const labelValue = labels[acumSlug];

          labelValue && (currentRoute.$name = getTitle(labelValue));

          Array.isArray(labelValue) && (currentRoute.$sidebar = getSidebarLabel(labelValue));
        }

        acumSlug += '.';
      }
    }
  }

  return Routes;
}
