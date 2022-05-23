import Head from 'next/head';
import type { ReactElement } from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { DocsContent, DocsTOC, MDXPage, EditOnGitHubButton } from '@guild-docs/client';
import { MDXPaths, MDXProps } from '@guild-docs/server';
import { getRoutes } from '../../../routes';

export default MDXPage(
  function PostPage({ content, TOC, MetaHead, sourceFilePath }): ReactElement {
    return (
      <>
        <Head>{MetaHead}</Head>
        <DocsContent>{content}</DocsContent>
        <DocsTOC>
          <TOC />
          <EditOnGitHubButton
            repo="the-guild-org/the-guild-docs"
            baseDir="examples/basic"
            branch="main"
            sourceFilePath={sourceFilePath}
          />
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
  }
);

export const getStaticProps: GetStaticProps = ctx =>
  MDXProps(
    ({ readMarkdownFile, getArrayParam }) => readMarkdownFile('docs/', getArrayParam('slug'), { importPartialMarkdown: true }),
    ctx,
    { getRoutes }
  );

export const getStaticPaths: GetStaticPaths = ctx => MDXPaths('docs', { ctx });
