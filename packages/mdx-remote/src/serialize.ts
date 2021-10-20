import mdx from '@mdx-js/mdx';
import { transform } from 'esbuild';
import type { Plugin } from 'unified';
import type { MDXRemoteSerializeResult, SerializeOptions } from '@guild-docs/types';
import { LazyPromise } from '@guild-docs/types';

const deps = LazyPromise(async () => {
  return {
    remove: (await import('unist-util-remove')).remove,
  };
});

/**
 * Parses and compiles the provided MDX string. Returns a result which can be passed into <MDXRemote /> to be rendered.
 */
export async function serialize(
  /** Raw MDX contents as a string. */
  source: string,
  { scope = {}, mdxOptions = {}, target = ['es2020', 'node12'] }: SerializeOptions = {}
): Promise<MDXRemoteSerializeResult> {
  const { remove } = await deps;

  /**
   * remark plugin which removes all import and export statements
   */
  const removeImportsExportsPlugin: Plugin = () => tree => remove(tree, ['import', 'export']) || undefined;

  mdxOptions.remarkPlugins = [...(mdxOptions.remarkPlugins || []), removeImportsExportsPlugin];

  const compiledMdx = await mdx(source, { ...mdxOptions, skipExport: true });
  const transformResult = await transform(compiledMdx, {
    loader: 'jsx',
    jsxFactory: 'mdx',
    minify: true,
    target,
  });

  return {
    compiledSource: transformResult.code,
    scope,
  };
}
