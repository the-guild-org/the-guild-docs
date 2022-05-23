import { MDXRemote, MDXRemoteSerializeResult } from '@guild-docs/mdx-remote';
import React, { ComponentType, ComponentProps } from 'react';
import type { CompiledMDX } from '@guild-docs/server';

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

export const RemoteGHMarkdown = <TComponents extends Record<string, ComponentType<any>> = Record<string, never>>({
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

          return <img {...props} alt={props.alt} src={src} />;
        },
      }}
    />
  );
};
