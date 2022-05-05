---
'@guild-docs/client': minor
'@guild-docs/server': minor
'@guild-docs/types': minor
---

edit on GitHub

It is now possible to add a "edit this page on GitHub" button.

```tsx
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
    editOnGitHub: {
      repo: 'pabloszx/the-guild-docs',
      baseDir: 'examples/basic',
      branch: 'main',
    },
  }
);
```
