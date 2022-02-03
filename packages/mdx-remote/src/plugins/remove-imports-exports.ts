import { LazyPromise } from '@guild-docs/types';
import type { Plugin } from 'unified';

const deps = LazyPromise(async () => {
  return {
    remove: (await import('unist-util-remove')).remove,
  };
});

/**
 * remark plugin which removes all import and export statements
 */
export function removeImportsExportsPlugin(): Plugin {
  return tree => {
    const transformer = deps.then(({ remove }) => {
      return remove(tree, 'mdxjsEsm');
    });
    return async (...args) => {
      return (await transformer)(...args);
    };
  };
}
