import { useTranslation } from 'next-i18next';
import { MDXRemote } from 'next-mdx-remote';
import Head from 'next/head';
import React, { createElement, ReactElement } from 'react';

import { components } from './components.js';

import type { MdxPageProps, MdxInternalProps } from '@guild-docs/types';

export function MDXPage(cmp: (props: MdxPageProps) => ReactElement) {
  return function MDXPage({ children, source, frontMatter }: MdxInternalProps) {
    const title = frontMatter.title;

    const content = (
      <>
        {title ? (
          <Head>
            <title>{title}</title>
          </Head>
        ) : null}

        <MDXRemote {...source} components={components} />
      </>
    );

    return createElement(cmp, {
      content,
      frontMatter,
      useTranslation,
      children,
    });
  };
}
