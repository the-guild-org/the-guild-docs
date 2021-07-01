import { MDXRemote } from 'next-mdx-remote';
import React, { ComponentType } from 'react';

import { components } from './components';

import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

export function MDX<TComponents extends Record<string, ComponentType<any>>>({
  mdx,
  extraComponents,
}: {
  mdx: MDXRemoteSerializeResult;
  extraComponents?: Partial<Record<keyof typeof components, ComponentType<any>>> & Partial<TComponents>;
}) {
  return <MDXRemote compiledSource={mdx.compiledSource} components={{ ...components, ...extraComponents }} />;
}
