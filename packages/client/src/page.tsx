import { useTranslation } from 'next-i18next';
import { MDXRemote } from 'next-mdx-remote';
import { createElement, Fragment, PropsWithChildren, ReactElement, useCallback, useMemo } from 'react';

import { BottomNavigationComponent } from './bottomNavigation.js';
import { components } from './components.js';
import { MDXTOC } from './toc.js';

import type { MdxPageProps, MdxInternalProps, IRoutes, BottomNavigationProps } from '@guild-docs/types';

export function MDXPage(Component: (props: PropsWithChildren<MdxPageProps>) => ReactElement) {
  return function MDXPage({ children, source, frontMatter, toc, mdxRoutes }: MdxInternalProps) {
    const title = frontMatter.title;

    const MetaHead = useMemo(() => {
      return createElement(Fragment, null, title ? createElement('title', null, title) : null);
    }, [title]);

    const content = useMemo(() => {
      return createElement(MDXRemote, { ...source, components });
    }, [title, source]);

    const TOC = useCallback<MdxPageProps['TOC']>(
      function TOC(props) {
        if (toc.length < 2) return null;

        return createElement(MDXTOC, {
          toc,
          ...props,
        });
      },
      [toc]
    );

    const BottomNavigation = useCallback(
      function BottomNavigation(props: Omit<BottomNavigationProps, 'routes'>) {
        if (!mdxRoutes) return null;

        const serializedMdx = process.env.SERIALIZED_MDX_ROUTES;

        let mdxRoutesData = mdxRoutes === 1 ? (serializedMdx ? (JSON.parse(serializedMdx) as IRoutes) : null) : mdxRoutes;

        if (!mdxRoutesData) return null;

        return createElement(BottomNavigationComponent, {
          ...props,
          routes: mdxRoutesData,
        });
      },
      [mdxRoutes]
    );

    return createElement(
      Component,
      {
        content,
        frontMatter,
        useTranslation,
        TOC,
        MetaHead,
        BottomNavigation,
      },
      children
    );
  };
}
