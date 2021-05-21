import Head from 'next/head';

import { chakra } from '@chakra-ui/react';
import { MDXPage } from '@guild-docs/client';
import { MDXPaths, MDXProps } from '@guild-docs/server';

import { getRoutes } from '../../../routes';

import type { GetStaticPaths, GetStaticProps } from 'next';

const DocsTOC = chakra('aside', {
  baseStyle: {
    position: 'sticky',
    top: '7rem',
    justifySelf: 'start',
    height: 'fit-content',
    width: {
      base: '100%',
      lg: '15rem',
    },
  },
});

const DocsContent = chakra('article', {
  baseStyle: {
    display: 'block',
    fontFamily: 'Poppins',
    mt: {
      lg: '-1rem',
    },
    px: {
      lg: '1.75rem',
    },
    flex: {
      lg: '1 1 0%',
    },
  },
});

export default MDXPage(function PostPage({ content, TOC, MetaHead, BottomNavigation }) {
  return (
    <>
      <Head>{MetaHead}</Head>
      <DocsContent>{content}</DocsContent>
      <DocsTOC>
        <TOC />
        <BottomNavigation />
      </DocsTOC>
    </>
  );
});

export const getStaticProps: GetStaticProps = ctx => {
  return MDXProps(
    ({ readMarkdownFile, getArrayParam }) => {
      return readMarkdownFile('docs/', getArrayParam('slug'));
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
