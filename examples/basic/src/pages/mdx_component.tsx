import { buildMDX, CompiledMDX } from '@guild-docs/server';
import { MDX } from '@guild-docs/client';
import { promises } from 'fs';

import type { GetStaticProps } from 'next';

interface PageProps {
  markdown: CompiledMDX;
}

export default function Page({ markdown }: PageProps) {
  return <MDX mdx={markdown.mdx} />;
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  return {
    props: {
      markdown: await buildMDX(promises.readFile('./other/example.mdx')),
    },
  };
};
