import type { IRoutes } from '@guild-docs/types';
import type { NextConfig } from 'next';

export interface WithGuildDocsOptions extends NextConfig {
  getRoutes: () => IRoutes;
}

export * from '@guild-docs/types';

export function withGuildDocs({ env, getRoutes, ...rest }: WithGuildDocsOptions): NextConfig {
  return {
    // Disable eslint by default, it can be overriden
    eslint: {
      ignoreDuringBuilds: true,
    },
    ...rest,
    env: {
      SERIALIZED_MDX_ROUTES: JSON.stringify(getRoutes()),
      ...env,
    },
    experimental: {
      esmExternals: true,
      ...rest.experimental,
    },
  };
}

export * from './routes';
export * from './mdx';
