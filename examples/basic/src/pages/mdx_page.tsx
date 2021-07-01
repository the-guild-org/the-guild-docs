import { promises } from 'fs';
import { MDXPage } from '@guild-docs/client';
import { MDXProps } from '@guild-docs/server';

import type { GetStaticProps } from 'next';

export default MDXPage(function Page({ content }) {
  return <>{content}</>;
});

export const getStaticProps: GetStaticProps = ctx => {
  return MDXProps(() => {
    return promises.readFile('./other/example.mdx');
  }, ctx);
};
