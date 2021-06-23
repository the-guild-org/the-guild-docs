import type { IRoutes } from '@guild-docs/types';

export interface WithGuildDocsOptions extends Record<string, unknown> {
  env?: Record<string, string>;
  getRoutes: () => IRoutes;
  i18n: {
    defaultLocale: string;
    locales: string[];
  };
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
