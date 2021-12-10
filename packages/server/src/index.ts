import type { IRoutes } from '@guild-docs/types';
import type { NextConfig } from 'next';

export interface WithGuildDocsOptions extends NextConfig {
  getRoutes: () => IRoutes;
}

export * from '@guild-docs/types';

export function withGuildDocs({ env = {}, getRoutes, ...rest }: WithGuildDocsOptions) {
  return {
    env: {
      SERIALIZED_MDX_ROUTES: JSON.stringify(getRoutes()),
      ...env,
    },
    // Disable eslint by default, it can be overriden
    eslint: {
      ignoreDuringBuilds: true,
    },
    ...rest,
  };
}

export * from './routes';
export * from './mdx';
