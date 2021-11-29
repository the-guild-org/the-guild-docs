import { useTranslation } from 'next-i18next';
import { MDXRemote } from '@guild-docs/mdx-remote';
import React, { PropsWithChildren, ReactElement, useCallback, useMemo } from 'react';

import { BottomNavigationComponent } from './bottomNavigation';
import { components } from './components';
import { MDXTOC } from './toc';

import type { MdxPageProps, MdxInternalProps, IRoutes, BottomNavigationProps } from '@guild-docs/types';
import { cleanMarkdown } from './utils';

export interface MDXPageOptions {
  renderTitle?: (title?: string) => string;
}

export function MDXPage(
  Component: (props: PropsWithChildren<MdxPageProps>) => ReactElement,
  { renderTitle }: MDXPageOptions = {}
) {
  return function MDXPage({ children, source, frontMatter, toc, mdxRoutes }: MdxInternalProps) {
    const title: string | undefined = frontMatter.title;
    const description: string | undefined = frontMatter.description;

    const MetaHead = useMemo(() => {
      let titleString = typeof title === 'string' ? cleanMarkdown(title) : undefined;

      if (renderTitle) titleString = renderTitle(titleString);

      return (
        <>
          {titleString ? <title key="title">{titleString}</title> : null}
          {titleString ? <meta key="og:title" property="og:title" content={titleString} /> : null}
          {description ? <meta key="og:description" property="og:description" content={description} /> : null}
          {description ? <meta key="description" name="description" content={description} /> : null}
        </>
      );
    }, [title]);

    const content = useMemo(() => {
      return <MDXRemote {...source} components={components} />;
    }, [title, source]);

    const TOC = useCallback<MdxPageProps['TOC']>(
      function TOC(props) {
        if (toc.length < 2) return null;

        return <MDXTOC toc={toc} {...props} />;
      },
      [toc]
    );

    const BottomNavigation = useCallback(
      function BottomNavigation(props: Omit<BottomNavigationProps, 'routes'>) {
        if (!mdxRoutes) return null;

        const serializedMdx = process.env.SERIALIZED_MDX_ROUTES;

        const mdxRoutesData = mdxRoutes === 1 ? (serializedMdx ? (JSON.parse(serializedMdx) as IRoutes) : null) : mdxRoutes;

        if (!mdxRoutesData) return null;

        return <BottomNavigationComponent {...props} routes={mdxRoutesData} />;
      },
      [mdxRoutes]
    );

    return (
      <Component
        content={content}
        frontMatter={frontMatter}
        useTranslation={useTranslation}
        TOC={TOC}
        MetaHead={MetaHead}
        BottomNavigation={BottomNavigation}
      >
        {children}
      </Component>
    );
  };
}
