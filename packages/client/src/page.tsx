import { useTranslation } from 'next-i18next';
import { MDXRemote } from 'next-mdx-remote';
import { createElement, Fragment, PropsWithChildren, ReactElement, useCallback, useMemo } from 'react';

import { components } from './components.js';
import { MDXTOC } from './toc.js';

import type { MdxPageProps, MdxInternalProps } from '@guild-docs/types';

export function MDXPage(Component: (props: PropsWithChildren<MdxPageProps>) => ReactElement) {
  return function MDXPage({ children, source, frontMatter, toc }: MdxInternalProps) {
    const title = frontMatter.title;

    const MetaHead = useMemo(() => {
      return createElement(Fragment, null, createElement('title', null, title));
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

    return createElement(
      Component,
      {
        content,
        frontMatter,
        useTranslation,
        TOC,
        MetaHead,
      },
      children
    );
  };
}
