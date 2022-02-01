import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import RemoveMarkdown from 'remove-markdown';

export function useIs404() {
  const router = useRouter();

  return Object.keys(((router || { components: {} }) as any).components || {}).length === 1;
}

export function getDefault<T>(module: T & { default?: T }): T {
  return module.default || module;
}

const CleanMarkdownCache: Record<string, string> = {};
export function cleanMarkdown(str: string): string {
  return (CleanMarkdownCache[str] ??= RemoveMarkdown(str));
}

let isBrowserGlobal = false;

export function useIsBrowserSSRSafe() {
  const [isBrowser, setIsBrowser] = useState(isBrowserGlobal);

  useEffect(() => {
    if (!isBrowser) setIsBrowser((isBrowserGlobal = true));
  }, [setIsBrowser, isBrowser]);

  return isBrowser;
}
