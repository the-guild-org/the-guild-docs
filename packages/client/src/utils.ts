import { useRouter } from 'next/router';

export function useIs404() {
  const router = useRouter();

  return Object.keys(((router || { components: {} }) as any).components || {}).length === 1;
}

export function getDefault<T>(module: T & { default?: T }): T {
  return module.default || module;
}
