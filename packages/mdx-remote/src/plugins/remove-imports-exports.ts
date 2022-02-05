import { remove } from 'unist-util-remove';
import type { Plugin } from 'unified';

/**
 * remark plugin which removes all import and export statements
 */
export function removeImportsExportsPlugin(): Plugin {
  return tree => remove(tree, 'mdxjsEsm');
}
