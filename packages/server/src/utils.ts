import type { MouseEvent } from 'react';
import RouterImport from 'next/router.js';

export function withoutTrailingSlash(v: string) {
  if (v === '/') return v;
  if (v.endsWith('/')) return v.slice(0, v.length - 1);
  return v;
}

export function withStartingSlash(v: string) {
  if (v.startsWith('/')) return v;
  return '/' + v;
}

export function withoutStartingSlash(v: string) {
  if (v === '/') return v;
  if (v.startsWith('/')) return v.slice(1, v.length);
  return v;
}

export function getDefault<T>(module: T & { default?: T }): T {
  return module.default || module;
}

const Router = getDefault(RouterImport);

export const handlePushRoute = (path: string, e: Pick<MouseEvent, 'preventDefault'>): void => {
  e.preventDefault();
  if (path) {
    Router.push(path);
  }
};
