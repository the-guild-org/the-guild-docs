import { Stack } from '@chakra-ui/react';

import { MDXPage } from 'guild-docs';
import { MDXPaths, MDXProps } from 'guild-docs/dist/server';

import type { GetStaticPaths, GetStaticProps } from 'next';
import { getRoutes } from '../../../routes';

export default MDXPage(function PostPage({ content }) {
  return (
    <Stack>
      <main>{content}</main>
    </Stack>
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
