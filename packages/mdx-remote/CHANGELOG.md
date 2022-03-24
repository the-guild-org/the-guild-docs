# @guild-docs/mdx-remote

## 2.0.1

### Patch Changes

- 725b49b: add `remark-gfm` to display markdown tables

## 2.0.0

### Major Changes

- 228b9cf: Use [MDX 2](https://mdxjs.com/blog/v2/) 🎉

  - Requires `Next.js v12`
  - Requires `"@mdx-js/react": "^2.0.0"`
  - Removed support for [remark-admonitions](https://github.com/elviswolcott/remark-admonitions) due to compatibility issues (and it stopped being maintained at April 28th, 2020)

### Patch Changes

- Updated dependencies [228b9cf]
  - @guild-docs/types@2.0.0

## 1.0.2

### Patch Changes

- 6d89612: Lint fixes

## 1.0.1

### Patch Changes

- a72fdb4: Don't mutate mdxOptions in `serialize`

## 1.0.0

### Major Changes

- 24878ed: Use @guild-docs/mdx-remote with esbuild as peer dependency (no need for esbuild resolutions/overrides)

### Patch Changes

- Updated dependencies [24878ed]
  - @guild-docs/types@1.0.3
