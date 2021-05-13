export interface WithGuildDocsOptions extends Record<string, unknown> {}

export * from './types';

export function withGuildDocs(opts: WithGuildDocsOptions = {}) {
  return {
    future: {
      webpack5: true,
    },
    ...opts,
  };
}

export * from './server/routes';
export * from './server/mdx';
