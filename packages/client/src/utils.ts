import type { MouseEvent } from 'react';
import RouterImport from 'next/router.js';

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
