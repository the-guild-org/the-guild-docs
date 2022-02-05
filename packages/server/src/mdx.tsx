import type { MDXRemoteSerializeResult, SerializeOptions } from '@guild-docs/mdx-remote';
import type { IRoutes, MdxInternalProps, PossiblePromise, TOC } from '@guild-docs/types';
import { LazyPromise } from '@guild-docs/types';
import { access, readFile } from 'fs/promises';
import { globby } from 'globby';
import matter from 'gray-matter';
import type { GetStaticPathsContext, GetStaticPropsContext, GetStaticPropsResult } from 'next';
import { appWithTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations.js';
import { dirname, join, resolve } from 'path';
import * as React from 'react';
import { getHighlighter } from 'shiki';
import { IS_PRODUCTION } from './constants';
import { getSlug } from './routes';
import { SerializeTOC } from './toc';

const Provideri18n = appWithTranslation(({ children }) => <React.Fragment children={children} />);

async function prepareMDXRenderWithTranslations(locale: string | undefined) {
  const translations = await serverSideTranslations(locale || 'en', ['common']);

  return {
    provider: {
      component: Provideri18n,
      props: {
        pageProps: translations,
      },
    },
    translations,
  };
}

function fileExists(path: string) {
  return access(path).then(
    () => true,
    () => false
  );
}

const PartialMDRegex = /{@import (.*?)}/;

export interface ReadMarkdownFileOptions {
  importPartialMarkdown?: boolean;
}

async function readMarkdownFile(basePath: string, slugPath: string[], options?: ReadMarkdownFileOptions) {
  const { content, path } = await (async () => {
    const sharedStartPath = [basePath, slugPath.join('/')];
    const mdxPath = [...sharedStartPath, '.mdx'].join('');
    const mdPath = [...sharedStartPath, '.md'].join('');
    const indexMdPath = [...sharedStartPath, '/index.md'].join('');
    const indexMdxPath = [...sharedStartPath, '/index.mdx'].join('');
    const indexReadmeMdPath = [...sharedStartPath, '/README.md'].join('');
    const indexReadmeMdxPath = [...sharedStartPath, '/README.mdx'].join('');

    const [
      mdPathExists,
      mdxPathExists,
      indexMdPathExists,
      indexMdxPathExists,
      indexReadmeMdPathExists,
      indexReadmeMdxPathExists,
    ] = await Promise.all([
      fileExists(mdPath),
      fileExists(mdxPath),
      fileExists(indexMdPath),
      fileExists(indexMdxPath),
      fileExists(indexReadmeMdPath),
      fileExists(indexReadmeMdxPath),
    ]);

    if (mdPathExists) {
      return {
        path: mdPath,
        content: await readFile(mdPath, 'utf-8'),
      };
    }
    if (mdxPathExists) {
      return {
        path: mdxPath,
        content: await readFile(mdxPath, 'utf-8'),
      };
    }
    if (indexMdPathExists) {
      return {
        path: indexMdPath,
        content: await readFile(indexMdPath, 'utf-8'),
      };
    }
    if (indexMdxPathExists) {
      return {
        path: indexMdxPath,
        content: await readFile(indexMdxPath, 'utf-8'),
      };
    }
    if (indexReadmeMdPathExists) {
      return {
        path: indexReadmeMdPath,
        content: await readFile(indexReadmeMdPath, 'utf-8'),
      };
    }
    if (indexReadmeMdxPathExists) {
      return {
        path: indexReadmeMdxPath,
        content: await readFile(indexReadmeMdxPath, 'utf-8'),
      };
    }
    throw Error("Markdown File Couldn't be found!");
  })();

  if (options?.importPartialMarkdown) {
    return parsePartialMarkdown(content, dirname(path));
  }

  return content;
}

async function parsePartialMarkdown(content: string, basePath: string): Promise<string> {
  const splitContentLines = content.split(/\r\n|\n/g);

  const parsedContent = await Promise.all(
    splitContentLines.map(async contentLine => {
      const matches = contentLine.match(PartialMDRegex);

      if (matches && matches[1]) {
        const fileAbsPath = resolve(basePath, matches[1]);

        if (await fileExists(fileAbsPath)) {
          const partialMarkdown = await readFile(fileAbsPath, 'utf-8');

          return parsePartialMarkdown(partialMarkdown, basePath);
        }

        throw Error(`Unable to locate @import file in path ${fileAbsPath}!`);
      }

      return contentLine;
    })
  );

  return parsedContent.join('\n');
}

export interface BuildMDXOptions {
  /**
   * @default true
   */
  buildTOC?: boolean;
  extraRemarkPlugins?: NonNullable<SerializeOptions['mdxOptions']>['remarkPlugins'];
  extraRehypePlugins?: NonNullable<SerializeOptions['mdxOptions']>['rehypePlugins'];
}

export interface CompiledMDX {
  mdx: MDXRemoteSerializeResult<Record<string, unknown>>;
  toc: TOC;
  frontMatter: Record<string, any>;
}

const MdxDeps = LazyPromise(async () => {
  const [remarkAdmonitions, remarkEmoji, highlighter, withShiki, { serialize }, rehypeSlug] = await Promise.all([
    import('remark-admonitions').then(v => v.default).catch(() => void 0),
    import('remark-emoji').then(v => v.default),
    getHighlighter({
      theme: 'dark-plus',
      langs: [
        'javascript',
        'typescript',
        'sh',
        'shell',
        'bash',
        'json',
        'yaml',
        'markdown',
        'md',
        'mdx',
        'tsx',
        'ts',
        'graphql',
        'swift',
        'java',
        'jsonc',
        'diff',
        'csharp',
        'c#',
        'vue',
        'html',
        'svelte',
      ],
    }),
    import('@stefanprobst/rehype-shiki').then(v => v.default),
    import('@guild-docs/mdx-remote/serialize'),
    import('rehype-slug').then(v => v.default),
  ]);

  return {
    remarkAdmonitions,
    remarkEmoji,
    highlighter,
    withShiki,
    serialize,
    rehypeSlug,
  };
});

export async function buildMDX(
  source: PossiblePromise<string | Buffer>,
  { buildTOC = true, extraRemarkPlugins = [], extraRehypePlugins = [] }: BuildMDXOptions = {}
): Promise<CompiledMDX> {
  const matterData = matter(await source);

  let content = matterData.content;
  const data = matterData.data;

  if (data.title && !content.trimStart().startsWith('# ') && data.add_heading !== false) {
    content = '# ' + data.title + '\n\n' + content.trimStart();
  }

  const { remarkAdmonitions, remarkEmoji, highlighter, withShiki, serialize, rehypeSlug } = await MdxDeps;

  const remarkPlugins: NonNullable<SerializeOptions['mdxOptions']>['remarkPlugins'] = [remarkEmoji, ...extraRemarkPlugins];

  // TODO: Remove or look for a replacement
  if (remarkAdmonitions && !!false) {
    remarkPlugins.push([
      remarkAdmonitions,
      {
        customTypes: {
          shell: {
            keyword: 'shell',
            svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16pt" height="16pt" viewBox="0 0 16 16"><path d="M0 0v16h16V0zm15.063 15.063H.937v-11h14.126zm0-11.938H.937V.937h14.126zm0 0"/><path d="M1.875 1.563h.938V2.5h-.938zm0 0M3.438 1.563h.937V2.5h-.938zm0 0M5 1.563h.938V2.5H5zm0 0M1.875 5.074v1.348l.988.637-.988.578V9.05l2.828-1.668v-.586zm0 0M5.34 7.559h1.027v1.226H5.34zm0 0M5.34 5.32h1.027v1.23H5.34zm0 0M6.8 8.785h2.356v1.137H6.801zm0 0"/></svg>',
          },
        },
      },
    ]);
  }

  const mdx = await serialize(content, {
    mdxOptions: {
      remarkPlugins,
      rehypePlugins: [
        rehypeSlug,
        [
          withShiki,
          {
            highlighter,
          },
        ],
        ...extraRehypePlugins,
      ],
    },
  });

  mdx.compiledSource = mdx.compiledSource.replace(/&quot;/g, '"');

  const toc: TOC = buildTOC ? SerializeTOC(content) : [];

  return {
    mdx,
    toc,
    frontMatter: data,
  };
}

export async function buildMultipleMDX(
  source: PossiblePromise<Array<PossiblePromise<string | Buffer>>>,
  opts?: BuildMDXOptions
): Promise<Array<CompiledMDX>> {
  return Promise.all((await source).map(value => buildMDX(value, opts)));
}

export async function MDXProps(
  getSource: (data: {
    params: Record<string, string | string[] | undefined>;
    readFile: typeof readFile;
    join: typeof join;
    resolve: typeof resolve;
    readMarkdownFile: typeof readMarkdownFile;
    getStringParam: (name: string) => string;
    getArrayParam: (name: string) => string[];
  }) => Promise<string | Buffer>,
  { locale = 'en', params = {} }: Pick<GetStaticPropsContext, 'locale' | 'params'>,
  { getRoutes }: { getRoutes?: () => IRoutes } = {}
): Promise<GetStaticPropsResult<MdxInternalProps>> {
  const mdxRoutes: MdxInternalProps['mdxRoutes'] = getRoutes ? (IS_PRODUCTION ? 1 : getRoutes()) : undefined;

  const prepareMDXTranslations = prepareMDXRenderWithTranslations(locale);

  const source = await getSource({
    params,
    readFile,
    readMarkdownFile,
    join,
    resolve,
    getStringParam(name) {
      const param = params[name];

      if (typeof param !== 'string') throw Error(`No ${name} provided!`);

      return param;
    },
    getArrayParam(name) {
      const param = params[name];

      if (param == null) return [];

      if (!Array.isArray(param)) throw Error(`No ${name} provided!`);

      return param;
    },
  });

  const { frontMatter, mdx, toc } = await buildMDX(source);

  const {
    translations: { _nextI18Next },
  } = await prepareMDXTranslations;

  const result: GetStaticPropsResult<MdxInternalProps> = {
    props: {
      source: mdx,
      frontMatter,
      _nextI18Next,
      toc,
    },
  };

  if (mdxRoutes) result.props.mdxRoutes = mdxRoutes;

  return result;
}

export type MDXCatchAllPathsResult = Promise<{
  paths: {
    params: {
      slug: string[];
    };
    locale: string;
  }[];
  fallback: boolean;
}>;

export interface MDXPathsOptions {
  ctx?: Pick<GetStaticPathsContext, 'locales'>;
  /**
   * If not specified and the pattern is a string, the default is the same pattern used
   */
  replaceBasePath?: string;
}

export async function MDXPaths(
  patterns: string | string[],
  { ctx: { locales = ['en'] } = {}, replaceBasePath = typeof patterns === 'string' ? patterns : undefined }: MDXPathsOptions = {}
): MDXCatchAllPathsResult {
  const paths: {
    params: {
      slug: string[];
    };
    locale: string;
  }[] = [];

  const globbyPatterns = await globby(patterns);

  const docsSlugs = globbyPatterns.reduce((acum, path) => {
    if (!/\.mdx?$/.test(path)) return acum;

    acum.push(
      getSlug({
        path,
        replaceBasePath,
      })
    );

    return acum;
  }, [] as string[][]);

  for (const locale of locales) {
    for (const slug of docsSlugs) {
      paths.push({
        params: {
          slug,
        },
        locale,
      });

      const dupSlug = [...slug];

      const poppedSlug = dupSlug.pop();
      if (poppedSlug === 'index' || poppedSlug === 'README') {
        paths.push({
          params: {
            slug: dupSlug,
          },
          locale,
        });
      }
    }
  }

  return {
    paths,
    fallback: false,
  };
}
