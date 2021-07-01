import type { ComponentProps, ReactNode, VoidFunctionComponent } from 'react';
import type { SSRConfig, useTranslation } from 'next-i18next';

import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import type { BoxProps, TextProps, ChakraComponent, LinkProps, Collapse } from '@chakra-ui/react';

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

export interface MDXTOCProps {
  toc: TOC;
  wrapperProps?: Omit<ComponentProps<ChakraComponent<'div', {}>>, 'children'>;
  titleProps?: Omit<ComponentProps<ChakraComponent<'h2', {}>>, 'children'>;
  linkProps?: (args: TOCHeading) => Omit<ComponentProps<ChakraComponent<'a', {}>>, 'children'>;
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
  wrapperProps?: Omit<ComponentProps<ChakraComponent<'nav', {}>>, 'children'>;
  detailsProps?: (args: MDXNavigationAccordionArgs) => Omit<ComponentProps<ChakraComponent<'div', {}>>, 'children'>;
  summaryProps?: (args: MDXNavigationAccordionArgs) => Omit<ComponentProps<ChakraComponent<'div', {}>>, 'children'>;
  summaryLabelProps?: (args: MDXNavigationAccordionArgs) => Omit<ComponentProps<ChakraComponent<'p', {}>>, 'children'>;
  summaryIconProps?: (args: MDXNavigationAccordionArgs) => Omit<ComponentProps<ChakraComponent<'svg', {}>>, 'children'>;
  collapseProps?: (args: MDXNavigationAccordionArgs) => Omit<ComponentProps<typeof Collapse>, 'children'>;
  linkProps?: (args: MDXNavigationAccordionArgs) => Omit<ComponentProps<ChakraComponent<'a', {}>>, 'children'>;
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
}

export interface MdxInternalProps {
  children?: ReactNode;
  source: MDXRemoteSerializeResult<Record<string, unknown>>;
  frontMatter: Record<string, any>;
  _nextI18Next: SSRConfig['_nextI18Next'];
  mdxRoutes?: IRoutes | 1;
  toc: TOC;
}

export type PossiblePromise<T> = T | Promise<T>;
