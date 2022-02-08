import type { MDXRemoteSerializeResult } from '@guild-docs/types';
import * as mdx from '@mdx-js/react';
import { ComponentProps, createElement, ElementType, useEffect, useMemo, useState } from 'react';
import * as runtime from 'react/jsx-runtime.js';

// requestIdleCallback types found here: https://github.com/microsoft/TypeScript/issues/21309
type RequestIdleCallbackHandle = number;
type RequestIdleCallbackOptions = {
  timeout?: number;
};
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: () => number;
};

declare global {
  interface Window {
    requestIdleCallback: (
      callback: (deadline: RequestIdleCallbackDeadline) => void,
      opts?: RequestIdleCallbackOptions
    ) => RequestIdleCallbackHandle;
    cancelIdleCallback: (handle: RequestIdleCallbackHandle) => void;
  }
}

export type MdxProviderComponent = ComponentProps<typeof mdx.MDXProvider>['components'];

export type MDXRemoteProps = MDXRemoteSerializeResult & {
  /**
   * A object mapping names to React components.
   * The key used will be the name accessible to MDX.
   *
   * For example: `{ ComponentName: Component }` will be accessible in the MDX as `<ComponentName/>`.
   */
  components?: MdxProviderComponent | Record<string, React.ComponentType<any> | React.ReactNode>;
  /**
   * Determines whether or not the content should be hydrated asynchronously, or "lazily"
   */
  lazy?: boolean;
};

export type { MDXRemoteSerializeResult, SerializeOptions } from '@guild-docs/types';

/**
 * Renders compiled source from next-mdx-remote/serialize.
 */
export function MDXRemote({ compiledSource, scope, components = {}, lazy, frontmatter }: MDXRemoteProps) {
  const [isReadyToRender, setIsReadyToRender] = useState(!lazy || typeof window === 'undefined');

  // if we're on the client side and `lazy` is set to true, we hydrate the
  // mdx content inside requestIdleCallback, allowing the page to get to
  // interactive quicker, but the mdx content to hydrate slower.
  useEffect(() => {
    if (lazy) {
      const handle = window.requestIdleCallback(() => {
        setIsReadyToRender(true);
      });
      return () => window.cancelIdleCallback(handle);
    }
  }, [lazy]);

  const Content: ElementType = useMemo(() => {
    // if we're ready to render, we can assemble the component tree and let React do its thing
    // first we set up the scope which has to include the mdx custom
    // create element function as well as any components we're using
    const fullScope = Object.assign({ opts: { ...mdx, ...runtime }, frontmatter }, scope);
    const keys = Object.keys(fullScope);
    const values = Object.values(fullScope);

    // now we eval the source code using a function constructor
    // in order for this to work we need to have React, the mdx createElement,
    // and all our components in scope for the function, which is the case here
    // we pass the names (via keys) in as the function's args, and execute the
    // function with the actual values.
    const hydrateFn = Reflect.construct(Function, keys.concat(compiledSource));

    return hydrateFn.apply(hydrateFn, values).default;
  }, [scope, compiledSource]);

  if (!isReadyToRender) {
    // If we're not ready to render, return an empty div to preserve SSR'd markup
    return createElement('div', {
      dangerouslySetInnerHTML: { __html: '' },
      suppressHydrationWarning: true,
    });
  }

  // wrapping the content with MDXProvider will allow us to customize the standard
  // markdown components (such as "h1" or "a") with the "components" object
  const content = createElement(mdx.MDXProvider, {
    components: components as MdxProviderComponent,
    children: createElement(Content),
  });

  // If lazy = true, we need to render a wrapping div to preserve the same markup structure that was SSR'd
  return lazy
    ? createElement('div', {
        children: content,
      })
    : content;
}

if (typeof window !== 'undefined') {
  window.requestIdleCallback =
    window.requestIdleCallback ||
    function (cb) {
      const start = Date.now();
      return setTimeout(function () {
        cb({
          didTimeout: false,
          timeRemaining() {
            return Math.max(0, 50 - (Date.now() - start));
          },
        });
      }, 1) as unknown as number;
    };

  window.cancelIdleCallback =
    window.cancelIdleCallback ||
    function (id) {
      clearTimeout(id);
    };
}
