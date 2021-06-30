import { access, readFile } from 'fs/promises';
import globby from 'globby';
import matter from 'gray-matter';
import { appWithTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { serialize } from 'next-mdx-remote/serialize';
import { join, resolve } from 'path';
import * as React from 'react';
import remarkAdmonitions from 'remark-admonitions';
import remarkPrism from 'remark-prism';
import remarkSlug from 'remark-slug';
import remarkEmoji from 'remark-emoji';

import { IS_PRODUCTION } from './constants';
import { getSlug } from './routes';
import { SerializeTOC } from './toc';

import type { GetStaticPathsContext, GetStaticPropsContext, GetStaticPropsResult } from 'next';
import type { IRoutes, MdxInternalProps } from '@guild-docs/types';

const Provideri18n = appWithTranslation(({ children }) => <React.Fragment children={children} />);

async function prepareMDXRenderWithTranslations(locale: string | undefined) {
  const translations = await serverSideTranslations(locale!, ['common']);

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

async function readMarkdownFile(basePath: string, slugPath: string[]) {
  const sharedStartPath = [basePath, slugPath.join('/')];
  const mdxPath = [...sharedStartPath, '.mdx'].join('');
  const mdPath = [...sharedStartPath, '.md'].join('');
  const indexMdPath = [...sharedStartPath, '/index.md'].join('');
  const indexMdxPath = [...sharedStartPath, '/index.mdx'].join('');
  const indexReadmeMdPath = [...sharedStartPath, '/README.md'].join('');
  const indexReadmeMdxPath = [...sharedStartPath, '/README.mdx'].join('');

  const [mdPathExists, mdxPathExists, indexMdPathExists, indexMdxPathExists, indexReadmeMdPathExists, indexReadmeMdxPathExists] =
    await Promise.all([
      fileExists(mdPath),
      fileExists(mdxPath),
      fileExists(indexMdPath),
      fileExists(indexMdxPath),
      fileExists(indexReadmeMdPath),
      fileExists(indexReadmeMdxPath),
    ]);

  if (mdPathExists) {
    return readFile(mdPath);
  } else if (mdxPathExists) {
    return readFile(mdxPath);
  } else if (indexMdPathExists) {
    return readFile(indexMdPath);
  } else if (indexMdxPathExists) {
    return readFile(indexMdxPath);
  } else if (indexReadmeMdPathExists) {
    return readFile(indexReadmeMdPath);
  } else if (indexReadmeMdxPathExists) {
    return readFile(indexReadmeMdxPath);
  }
  throw Error("Markdown File Couldn't be found!");
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

  const prepareMDX = prepareMDXRenderWithTranslations(locale);

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

  const { content, data } = matter(source);

  const {
    translations: { _nextI18Next },
  } = await prepareMDX;

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [
        [
          remarkAdmonitions,
          {
            customTypes: {
              shell: {
                keyword: 'shell',
                svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16pt" height="16pt" viewBox="0 0 16 16"><path d="M0 0v16h16V0zm15.063 15.063H.937v-11h14.126zm0-11.938H.937V.937h14.126zm0 0"/><path d="M1.875 1.563h.938V2.5h-.938zm0 0M3.438 1.563h.937V2.5h-.938zm0 0M5 1.563h.938V2.5H5zm0 0M1.875 5.074v1.348l.988.637-.988.578V9.05l2.828-1.668v-.586zm0 0M5.34 7.559h1.027v1.226H5.34zm0 0M5.34 5.32h1.027v1.23H5.34zm0 0M6.8 8.785h2.356v1.137H6.801zm0 0"/></svg>',
              },
            },
          },
        ],
        remarkPrism,
        remarkSlug,
        remarkEmoji,
      ],
      rehypePlugins: [],
    },
    scope: data,
  });

  const toc = SerializeTOC(content);

  const result: GetStaticPropsResult<MdxInternalProps> = {
    props: {
      source: mdxSource,
      frontMatter: data,
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
