import type { ReactNode } from 'react';
import type { SSRConfig, useTranslation } from 'next-i18next';

import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

export type IRoutes = {
  $routes?: ([href: string, name: string] | string)[];
  $name?: string;
  _?: Record<string, IRoutes>;
};

export interface Paths {
  href: string;
  name?: string;
  isPage: boolean;
  paths?: Paths[];
}

export interface MdxPageProps {
  content: ReactNode;
  frontMatter: Record<string, any>;
  useTranslation: typeof useTranslation;
}

export interface MdxInternalProps {
  children?: ReactNode;
  source: MDXRemoteSerializeResult<Record<string, unknown>>;
  frontMatter: Record<string, any>;
  _nextI18Next: SSRConfig['_nextI18Next'];
  mdxRoutes: IRoutes | 1;
}
