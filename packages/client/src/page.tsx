import { MDXRemote } from '@guild-docs/mdx-remote';
import type { BottomNavigationProps, IRoutes, MdxInternalProps, MdxPageProps } from '@guild-docs/types';
import { useTranslation } from 'next-i18next';
import dynamicPkg from 'next/dynamic';
import React, { FC, useCallback, useMemo } from 'react';
import { BottomNavigationComponent } from './bottomNavigation';
import { components } from './components';
import type { GiscusProps } from './giscus';
import { MDXTOC } from './toc';
import { cleanMarkdown, getDefault } from './utils';

const dynamic = getDefault(dynamicPkg);

const GiscusDynamic = dynamic(() => import('./giscus'), { ssr: false });

export interface MDXPageOptions {
  renderTitle?: (title?: string) => string;
  giscus?: GiscusProps;
}

export function MDXPage(Component: FC<MdxPageProps>, { renderTitle, giscus }: MDXPageOptions = {}) {
  return function MDXPage({ children, source, frontMatter, toc, mdxRoutes, sourceFilePath }: MdxInternalProps) {
    const title: string | undefined = frontMatter.title;
    const description: string | undefined = frontMatter.description;

    const MetaHead = useMemo(() => {
      let titleString = typeof title === 'string' ? cleanMarkdown(title) : undefined;

      if (renderTitle) titleString = renderTitle(titleString);

      return (
        <>
          {titleString && <title key="title" children={titleString} />}
          {titleString && <meta key="og:title" property="og:title" content={titleString} />}
          {description && <meta key="og:description" property="og:description" content={description} />}
          {description && <meta key="description" name="description" content={description} />}
        </>
      );
    }, [title, description]);

    const content = useMemo(() => {
      return (
        <>
          <MDXRemote {...source} components={components} />
          {giscus && <GiscusDynamic {...giscus} />}
        </>
      );
    }, [source]);

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
        children={children}
        sourceFilePath={sourceFilePath}
      />
    );
  };
}
