---
'@guild-docs/server': patch
---

Add support for `@import` in markdown files via `readMarkdownFile` function behind `importPartialMarkdown` configuration flag.

```ts
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
```
