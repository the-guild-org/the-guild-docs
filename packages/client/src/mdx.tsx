import { MDXRemote } from 'next-mdx-remote';
import React, { ComponentType } from 'react';

import { components } from './components';

import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

export type ExtraMdxComponents<TComponents extends Record<string, ComponentType<any>> = {}> = Partial<
  Record<keyof typeof components, ComponentType<any>>
> &
  Partial<TComponents>;

export function MDX<TComponents extends Record<string, ComponentType<any>> = {}>({
  mdx,
  extraComponents,
}: {
  mdx: MDXRemoteSerializeResult;
  extraComponents?: ExtraMdxComponents<TComponents>;
}) {
  return <MDXRemote compiledSource={mdx.compiledSource} components={{ ...components, ...extraComponents }} />;
}

import type { ComponentProps } from 'react';
import type { CompiledMDX } from '@guild-docs/server';

const protocols = ['http', 'https', 'mailto', 'tel'];

function uriTransformer(uri?: string) {
  const url = (uri || '').trim();
  const first = url.charAt(0);

  if (first === '#' || first === '/') {
    return url;
  }

  const colon = url.indexOf(':');
  if (colon === -1) {
    return url;
  }

  let index = -1;

  while (++index < protocols.length) {
    const protocol = protocols[index];

    if (colon === protocol.length && url.slice(0, protocol.length).toLowerCase() === protocol) {
      return url;
    }
  }

  index = url.indexOf('?');
  if (index !== -1 && colon > index) {
    return url;
  }

  index = url.indexOf('#');
  if (index !== -1 && colon > index) {
    return url;
  }

  return 'javascript:void(0)';
}

export const RemoteGHMarkdown = <TComponents extends Record<string, ComponentType<any>> = {}>({
  content,
  repo,
  directory,
  extraComponents,
}: {
  content: CompiledMDX;
  repo?: string;
  directory?: string;
  extraComponents?: ExtraMdxComponents<TComponents>;
}) => {
  return (
    <MDX
      mdx={content.mdx}
      extraComponents={{
        ...extraComponents,
        img(props: ComponentProps<'img'>) {
          let src = uriTransformer(props.src);

          if (repo) {
            let modified = repo.replace('https://github.com/', 'https://raw.githubusercontent.com/') + '/HEAD/';

            if (directory) {
              modified = modified + directory;
            }

            src = modified + (src.startsWith('.') ? src.substr(1) : src);
          }

          return <img {...props} src={src} />;
        },
      }}
    />
  );
};
