import Head from 'next/head';

import { DocsContent, DocsTOC, MDXPage } from '@guild-docs/client';
import { MDXPaths, MDXProps } from '@guild-docs/server';

import { getRoutes } from '../../../routes';

import type { GetStaticPaths, GetStaticProps } from 'next';

export default MDXPage(
  function PostPage({ content, TOC, MetaHead, BottomNavigation, EditOnGitHub }) {
    return (
      <>
        <Head>{MetaHead}</Head>
        <DocsContent>{content}</DocsContent>
        <DocsTOC>
          <TOC />
          <BottomNavigation />
          <EditOnGitHub />
        </DocsTOC>
      </>
    );
  },
  {
    giscus: {
      repo: 'pabloszx/the-guild-docs',
      repoId: 'R_kgDOGqmArg',
      category: 'Q&A',
      categoryId: 'DIC_kwDOGqmArs4CA9N3',
    },
    editOnGitHub: {
      repo: 'pabloszx/the-guild-docs',
      baseDir: 'examples/basic',
      branch: 'main',
    },
  }
);

export const getStaticProps: GetStaticProps = ctx => {
  return MDXProps(
    ({ readMarkdownFile, getArrayParam }) => {
      return readMarkdownFile('docs/', getArrayParam('slug'), { importPartialMarkdown: true });
    },
    ctx,
    {
      getRoutes,
    }
  );
};

export const getStaticPaths: GetStaticPaths = ctx => {
  return MDXPaths('docs', { ctx });
};
