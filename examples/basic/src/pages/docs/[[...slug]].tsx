import { Box, Stack } from '@chakra-ui/react';
import { MDXPage } from '@guild-docs/client';
import { MDXPaths, MDXProps } from '@guild-docs/server';

import { getRoutes } from '../../../routes';

import type { GetStaticPaths, GetStaticProps } from 'next';

export default MDXPage(function PostPage({ content, TOC }) {
  return (
    <Stack>
      <Box as="main" maxWidth="80ch" textAlign="justify">
        {content}
      </Box>
      <TOC
        boxProps={{
          paddingRight: '2em',
          position: 'fixed',
          top: 0,
          right: 0,
          fontSize: '2xl',
        }}
      />
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
