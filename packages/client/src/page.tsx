import { useTranslation } from 'next-i18next';
import { MDXRemote } from 'next-mdx-remote';
import Head from 'next/head';
import React, { createElement, ReactElement, useCallback, useMemo } from 'react';

import { components } from './components.js';
import { MDXTOC } from './toc.js';

import type { MdxPageProps, MdxInternalProps } from '@guild-docs/types';

export function MDXPage(cmp: (props: MdxPageProps) => ReactElement) {
  return function MDXPage({ children, source, frontMatter, toc }: MdxInternalProps) {
    const title = frontMatter.title;

    const content = useMemo(() => {
      return (
        <>
          {title ? (
            <Head>
              <title>{title}</title>
            </Head>
          ) : null}

          <MDXRemote {...source} components={components} />
        </>
      );
    }, [title, source]);

    const TOC = useCallback<MdxPageProps['TOC']>(
      function TOC(props) {
        if (toc.length < 2) return null;

        return <MDXTOC toc={toc} {...props} />;
      },
      [toc]
    );

    return createElement(cmp, {
      content,
      frontMatter,
      useTranslation,
      children,
      TOC,
    });
  };
}
