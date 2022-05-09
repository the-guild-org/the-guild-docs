---
'@guild-docs/client': minor
'@guild-docs/server': minor
'@guild-docs/types': minor
---

Edit on GitHub

Now it's possible to add an "edit this page on GitHub" button.

```tsx
import Head from 'next/head';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { DocsContent, DocsTOC, MDXPage, EditOnGitHubButton } from '@guild-docs/client';
import { MDXPaths, MDXProps } from '@guild-docs/server';
import { getRoutes } from '../../../routes';

export default MDXPage(function PostPage({ content, TOC, MetaHead, BottomNavigation, sourceFilePath }) {
  return (
    <>
      <Head>{MetaHead}</Head>
      <DocsContent>{content}</DocsContent>
      <DocsTOC>
        <TOC />
        <BottomNavigation />
        <EditOnGitHubButton
          repo="the-guild-org/the-guild-docs"
          baseDir="examples/basic"
          branch="main"
          sourceFilePath={sourceFilePath}
        />
      </DocsTOC>
    </>
  );
});
```
