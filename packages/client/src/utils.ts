import { useRouter } from 'next/router.js';
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
