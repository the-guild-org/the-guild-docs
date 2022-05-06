import type { ComponentProps, ReactNode, VoidFunctionComponent } from 'react';
import type { SSRConfig, useTranslation } from 'next-i18next';

import type { BoxProps, TextProps, ChakraComponent, LinkProps, Collapse, ChakraProps, MergeWithAs } from '@chakra-ui/react';
import type { MDXRemoteSerializeResult } from './mdx';

export type IRoutes = {
  $routes?: ([href: string, name: string, sidebar?: string] | string)[];
  $name?: string;
  $sidebar?: string;
  _?: Record<string, IRoutes>;
};

export type TOC = [id: string, depth: number, label: string][];

export interface Paths {
  href: string;
  name?: string;
  sidebar?: string;
  isPage: boolean;
  paths?: Paths[];
}

export interface TOCHeading {
  id: string;
  label: string;
  depth: number;
  isActive: boolean;
}

export type ChakraComponentProps<Key extends keyof JSX.IntrinsicElements> = MergeWithAs<
  ComponentProps<Key>,
  ComponentProps<ChakraComponent<Key>>
> &
  ChakraProps;

export interface MDXTOCProps {
  toc: TOC;
  wrapperProps?: ChakraComponentProps<'div'>;
  titleProps?: ChakraComponentProps<'h2'>;
  linkProps?: (args: TOCHeading) => ChakraComponentProps<'a'>;
}

export interface MDXNavigationAccordionArgs {
  finalHref: string;
  isActive: boolean;
  isOpen: boolean;
  isAnchor: boolean;
  depth: number;
}

export interface MDXNavigationProps {
  paths: Paths[];
  acumHref?: string;
  depth?: number;
  accentColor?: string;
  handleLinkClick?: () => void;
  wrapperProps?: ChakraComponentProps<'nav'> | ((args: { depth: number; acumHref: string }) => ChakraComponentProps<'nav'>);
  detailsProps?: ChakraComponentProps<'div'> | ((args: MDXNavigationAccordionArgs) => ChakraComponentProps<'div'>);
  summaryProps?: ChakraComponentProps<'div'> | ((args: MDXNavigationAccordionArgs) => ChakraComponentProps<'div'>);
  summaryLabelProps?: ChakraComponentProps<'p'> | ((args: MDXNavigationAccordionArgs) => ChakraComponentProps<'p'>);
  summaryIconProps?: ChakraComponentProps<'svg'> | ((args: MDXNavigationAccordionArgs) => ChakraComponentProps<'svg'>);
  collapseProps?:
    | Omit<ComponentProps<typeof Collapse>, 'children'>
    | ((args: MDXNavigationAccordionArgs) => Omit<ComponentProps<typeof Collapse>, 'children'>);
  linkProps?: ChakraComponentProps<'a'> | ((args: MDXNavigationAccordionArgs) => ChakraComponentProps<'a'>);
  /**
   * @default 1
   */
  defaultOpenDepth?: number;
  /**
   * Override defaultOpenDepth logic with custom function
   */
  isAccordionDefaultOpen?: (args: { href: string; currentDepth: number }) => boolean;
}

export interface BottomNavigationProps {
  routes: IRoutes;
  wrapperProps?: BoxProps;
  linkProps?: LinkProps;
  titleProps?: TextProps;
}

export interface MdxPageProps {
  content: ReactNode;
  frontMatter: Record<string, any>;
  useTranslation: typeof useTranslation;
  TOC: VoidFunctionComponent<Omit<MDXTOCProps, 'toc'>>;
  MetaHead: ReactNode;
  BottomNavigation: VoidFunctionComponent<Omit<BottomNavigationProps, 'routes'>>;
  EditOnGitHub: VoidFunctionComponent;
}

export interface MdxInternalProps {
  children?: ReactNode;
  source: MDXRemoteSerializeResult<Record<string, unknown>>;
  frontMatter: Record<string, any>;
  _nextI18Next: SSRConfig['_nextI18Next'];
  mdxRoutes?: IRoutes | 1;
  toc: TOC;
  sourceFilePath: string;
}

export type PossiblePromise<T> = T | Promise<T>;

export * from './utils';
export * from './mdx';
