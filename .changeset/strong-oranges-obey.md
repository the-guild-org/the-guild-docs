---
'@guild-docs/server': major
---

**Breaking change only for websites using the Plugin Hub functionality**

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
