# @guild-docs/server

## 2.1.6

### Patch Changes

- cee86b9: Re-use NextConfig type

## 2.1.5

### Patch Changes

- 6d89612: Lint fixes
- Updated dependencies [6d89612]
  - @guild-docs/mdx-remote@1.0.2

## 2.1.4

### Patch Changes

- d84b603: allow to pass undefined in folderPattern to disabled "discovery"

## 2.1.3

### Patch Changes

- 9f58d44: fix ignorePaths in GenerateRoutes
- b5f02f6: Update next-i18next peer dependency version
- 8f0e267: Optional admonitions

## 2.1.2

### Patch Changes

- 4554abb: feat(server): add more language - yml,gql,c#,jsonc,java
- Updated dependencies [a72fdb4]
  - @guild-docs/mdx-remote@1.0.1

## 2.1.1

### Patch Changes

- f39795a: Fix ESM import

## 2.1.0

### Minor Changes

- 77d6367: Add support for `@import` in markdown files via `readMarkdownFile` function behind `importPartialMarkdown` configuration flag.

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

- 3115500: Update Next.js peer dependency to v12

## 2.0.4

### Patch Changes

- e8a4742: Fix rehype-slug as dep

## 2.0.3

### Patch Changes

- b263fdc: Change from remark-slug to rehype-slug, ref https://github.com/remarkjs/remark-slug/releases/tag/7.0.1

## 2.0.2

### Patch Changes

- 24878ed: Use @guild-docs/mdx-remote with esbuild as peer dependency (no need for esbuild resolutions/overrides)
- Updated dependencies [24878ed]
  - @guild-docs/types@1.0.3
  - @guild-docs/mdx-remote@1.0.0

## 2.0.1

### Patch Changes

- 1c85aa1: add weeklyNPMDownloads to PackageInfo

## 2.0.0

### Major Changes

- 9c27faf: **Breaking change only for websites using the Plugin Hub functionality**

  - Change from npms.io to raw npm registry usage

  This means that the new type signature for `PackageInfo` and `PackageWithStats` is:

  ```ts
  export interface PackageInfo {
    name: string;
    version: string;
    description?: string;
    repository?:
      | string
      | {
          type?: string;
          url?: string;
          directory?: string;
        };
    repositoryLink?: string;
    repositoryDirectory?: string;
    readme?: string;
    license?: string;
    createdDate: string;
    modifiedDate: string;
  }

  export interface Package<Tags extends string = string> {
    identifier: string;
    title: string;
    npmPackage: string;
    tags: Tags[];
    readme?: string;
    iconUrl?: string;
    githubReadme?: {
      repo: string;
      path: string;
    };
    devFilePath?: string;
  }

  export interface PackageWithStats<Tags extends string = string> extends Package<Tags> {
    stats: PackageInfo | undefined | null;
  }
  ```

## 1.0.6

### Patch Changes

- 268579c: Fix: specify next-mdx-remote/serialize .js extension
- 5addeaa: Pin next-mdx-remote to 3.0.6
- Updated dependencies [5addeaa]
  - @guild-docs/types@1.0.2

## 1.0.5

### Patch Changes

- b4feff4: Update next-mdx-remote with latest esbuild version
- 8741e40: Fix next-mdx-remote race condition
- Updated dependencies [b4feff4]
  - @guild-docs/types@1.0.1

## 1.0.4

### Patch Changes

- 4ab6ca3: "sideEffects": false

## 1.0.3

### Patch Changes

- 4a32ca8: inline remark shiki transformer (fix node12 engines issue)

## 1.0.2

### Patch Changes

- 01ebd5c: add "swift" in code highlighter

## 1.0.1

### Patch Changes

- 8d21aad: add extra languages

## 1.0.0

### Major Changes

- ff7a170: change code highlight from prism to shiki

### Patch Changes

- 1383ef6: update remark plugins with ESM only using dynamic imports
- Updated dependencies [fb55d6a]
  - @guild-docs/types@1.0.0

## 0.2.25

### Patch Changes

- ab4edfb: automatically add h1 heading to MDX if not found and frontMatter title is specified

## 0.2.23

### Patch Changes

- 39ab56d: update deps
- 33f0e5f: fix quotes encode in code blocks

## 0.2.22

### Patch Changes

- 7c6f5ac: skip TOC in code blocks
- 8dc1a2d: NPM Package README from GitHub & development readFile

## 0.2.18

### Patch Changes

- 35ebc64: add "getPackagesData" npm package data fetcher, import via `@guild-docs/server/npm`

## 0.2.16

### Patch Changes

- 919abbb: fix single mdx page outside of docs
- 7e79a7f: separate and export buildMDX function
- 19b4cb5: mdx component client & server side
- Updated dependencies [919abbb]
- Updated dependencies [19b4cb5]
  - @guild-docs/types@0.2.16

## 0.2.15

### Patch Changes

- b25d5ec: Disable eslint by default, it can be overriden

## 0.2.13

### Patch Changes

- a09e602: add "ignorePaths" for "GenerateRoutes"

## 0.2.12

### Patch Changes

- bb5409c: add :emoji: support

## 0.2.5

### Patch Changes

- 66c26b0: always put index at the beggining of navigation routes

## 0.2.1

### Patch Changes

- a5abb84: allow customize sidebar label
- a191976: allow README as index
- d2105c5: update build
- Updated dependencies [a5abb84]
- Updated dependencies [9522198]
- Updated dependencies [d2105c5]
  - @guild-docs/types@0.2.1

## 0.1.1

### Patch Changes

- c673f70: allow customize client components & sync packages
- Updated dependencies [c673f70]
  - @guild-docs/types@0.1.1

## 0.0.7

### Patch Changes

- 072368d: new building process
- Updated dependencies [072368d]
  - @guild-docs/types@0.0.6

## 0.0.6

### Patch Changes

- 610cf39: improve/fix next/head implementation
- 610cf39: update deps
- Updated dependencies [88a38cd]
- Updated dependencies [610cf39]
- Updated dependencies [610cf39]
  - @guild-docs/types@0.0.5

## 0.0.5

### Patch Changes

- 2029057: improve TOC
- Updated dependencies [2029057]
  - @guild-docs/types@0.0.4

## 0.0.4

### Patch Changes

- 3663a0a: add TOC
- ad80271: fix remark-admonitions dep
- Updated dependencies [3663a0a]
  - @guild-docs/types@0.0.3

## 0.0.3

### Patch Changes

- ba413a7: add remark slug
