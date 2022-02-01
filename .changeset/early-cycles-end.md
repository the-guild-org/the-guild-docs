---
'@guild-docs/client': minor
---

New ["giscus"](https://github.com/giscus/giscus) integration, a comments system powered by GitHub Discussions.

```tsx
import Head from 'next/head';

import { DocsContent, DocsTOC, MDXPage } from '@guild-docs/client';
import { MDXPaths, MDXProps } from '@guild-docs/server';

import { getRoutes } from '../../../routes';

import type { GetStaticPaths, GetStaticProps } from 'next';

export default MDXPage(
  function PostPage({ content, TOC, MetaHead, BottomNavigation }) {
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
  },
  {
    giscus: {
      repo: '[ENTER_REPO_HERE]',
      repoId: '[ENTER REPO ID HERE]',
      category: '[ENTER CATEGORY NAME HERE]',
      categoryId: '[ENTER CATEGORY ID HERE]',
    },
  }
);
```

The configuration of Giscus has to be made following the https://giscus.app instructions:

![Giscus Configuration](https://i.imgur.com/TA0AbKd.png)!
