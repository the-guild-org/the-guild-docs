import { MDXRemote, MDXRemoteSerializeResult } from '@guild-docs/mdx-remote';
import React, { ComponentType } from 'react';

import { components } from './components';

export type ExtraMdxComponents<TComponents extends Record<string, ComponentType<any>> = Record<string, never>> = Partial<
  Record<keyof typeof components, ComponentType<any>>
> &
  Partial<TComponents>;

export function MDX<TComponents extends Record<string, ComponentType<any>> = Record<string, never>>({
  mdx,
  extraComponents,
}: {
  mdx: MDXRemoteSerializeResult;
  extraComponents?: ExtraMdxComponents<TComponents>;
}) {
  return <MDXRemote compiledSource={mdx.compiledSource} components={{ ...components, ...extraComponents }} />;
}
