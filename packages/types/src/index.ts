import type { ComponentProps, ReactNode, VoidFunctionComponent } from 'react';
import type { SSRConfig, useTranslation } from 'next-i18next';

import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import type { BoxProps, TextProps, ChakraComponent } from '@chakra-ui/react';

export type IRoutes = {
  $routes?: ([href: string, name: string] | string)[];
  $name?: string;
  _?: Record<string, IRoutes>;
};

export type TOC = [depth: number, slug: string][];

export interface Paths {
  href: string;
  name?: string;
  isPage: boolean;
  paths?: Paths[];
}

export interface TOCHeading {
  name: string;
  depth: number;
}

export interface MDXTOCProps {
  toc: TOC;
  boxProps?: Omit<BoxProps, 'children'>;
  textProps?: (args: TOCHeading) => TextProps;
  anchorProps?: (args: TOCHeading) => ComponentProps<ChakraComponent<'a', {}>>;
}

export interface MdxPageProps {
  content: ReactNode;
  frontMatter: Record<string, any>;
  useTranslation: typeof useTranslation;
  TOC: VoidFunctionComponent<Omit<MDXTOCProps, 'toc'>>;
}

export interface MdxInternalProps {
  children?: ReactNode;
  source: MDXRemoteSerializeResult<Record<string, unknown>>;
  frontMatter: Record<string, any>;
  _nextI18Next: SSRConfig['_nextI18Next'];
  mdxRoutes: IRoutes | 1;
  toc: TOC;
}
