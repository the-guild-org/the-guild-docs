import { MDXRemote } from '@guild-docs/mdx-remote';
import type { BottomNavigationProps, IRoutes, MdxInternalProps, MdxPageProps } from '@guild-docs/types';
import { useTranslation } from 'next-i18next';
import DynamicPkg from 'next/dynamic.js';
import { Button, createIcon } from '@chakra-ui/react';
import React, { PropsWithChildren, ReactElement, useCallback, useMemo } from 'react';
import { BottomNavigationComponent } from './bottomNavigation';
import { components } from './components';
import type { GiscusProps } from './giscus';
import { MDXTOC } from './toc';
import { cleanMarkdown, getDefault } from './utils';

const Dynamic = getDefault(DynamicPkg);

const GiscusDynamic = Dynamic<GiscusProps>(() => import('./giscus').then(v => v.Giscus));

export interface MDXPageOptions {
  renderTitle?: (title?: string) => string;
  giscus?: GiscusProps;
  editOnGitHub?: {
    repo: string;
    branch: string;
    baseDir: string;
  };
}

export function MDXPage(
  Component: (props: PropsWithChildren<MdxPageProps>) => ReactElement,
  { renderTitle, giscus, editOnGitHub }: MDXPageOptions = {}
) {
  return function MDXPage({ children, source, frontMatter, toc, mdxRoutes, sourceFilePath }: MdxInternalProps) {
    const title: string | undefined = frontMatter.title;
    const description: string | undefined = frontMatter.description;

    const MetaHead = useMemo(() => {
      let titleString = typeof title === 'string' ? cleanMarkdown(title) : undefined;

      if (renderTitle) titleString = renderTitle(titleString);

      return (
        <>
          {titleString ? <title key="title" children={titleString} /> : null}
          {titleString ? <meta key="og:title" property="og:title" content={titleString} /> : null}
          {description ? <meta key="og:description" property="og:description" content={description} /> : null}
          {description ? <meta key="description" name="description" content={description} /> : null}
        </>
      );
    }, [title, description]);

    const EditOnGitHub = React.useMemo(() => {
      return () =>
        editOnGitHub ? (
          <Button
            as="a"
            leftIcon={<GitHubIcon />}
            target="_blank"
            variant="ghost"
            fontWeight="normal"
            marginTop="2"
            href={`https://github.com/${editOnGitHub.repo}/tree/${editOnGitHub.branch}/${editOnGitHub.baseDir}/${sourceFilePath}`}
          >
            Edit on GitHub
          </Button>
        ) : null;
    }, [editOnGitHub, sourceFilePath]);

    const content = useMemo(() => {
      return (
        <>
          <MDXRemote {...source} components={components} />
          {giscus ? <GiscusDynamic {...giscus} /> : null}
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
        EditOnGitHub={EditOnGitHub}
      />
    );
  };
}

const GitHubIcon = createIcon({
  displayName: 'GitHub',
  viewBox: '0 0 24 24',
  path: (
    <path
      fill="currentColor"
      d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
    />
  ),
});
