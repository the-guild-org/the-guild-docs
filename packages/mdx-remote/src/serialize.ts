import { compile, CompileOptions } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import { VFile } from 'vfile';
import { matter } from 'vfile-matter';
import type { MDXRemoteSerializeResult, SerializeOptions } from '@guild-docs/types';

import { createFormattedMDXError } from './format-mdx-error';
import { removeImportsExportsPlugin } from './plugins/remove-imports-exports';

function getCompileOptions(mdxOptions: SerializeOptions['mdxOptions'] = {}): CompileOptions {
  // don't modify the original object when adding our own plugin
  // this allows code to reuse the same options object
  const remarkPlugins = [
    ...(mdxOptions.remarkPlugins || []),
    ...(mdxOptions.useDynamicImport ? [] : [removeImportsExportsPlugin]),
    remarkGfm, // Support GFM (tables, autolinks, tasklists, strikethrough)
  ];

  return {
    ...mdxOptions,
    remarkPlugins,
    outputFormat: 'function-body',
    providerImportSource: '@mdx-js/react',
  };
}

/**
 * Parses and compiles the provided MDX string. Returns a result which can be passed into <MDXRemote /> to be rendered.
 */
export async function serialize(
  /** Raw MDX contents as a string. */
  source: string,
  { scope = {}, mdxOptions = {}, parseFrontmatter = false }: SerializeOptions = {}
): Promise<MDXRemoteSerializeResult> {
  const vfile = new VFile({ value: source });

  // makes frontmatter available via vfile.data.matter
  if (parseFrontmatter) {
    matter(vfile, { strip: true });
  }

  let compiledMdx: VFile;

  try {
    compiledMdx = await compile(vfile, getCompileOptions(mdxOptions));
  } catch (error) {
    throw createFormattedMDXError(error, String(vfile));
  }

  const compiledSource = String(compiledMdx);

  return {
    compiledSource,
    frontmatter: (vfile.data.matter as Record<string, string> | undefined) ?? {},
    scope,
  };
}
