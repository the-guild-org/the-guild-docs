import type { NextConfig } from 'next';
import nextBundleAnalyzer from '@next/bundle-analyzer';
import nextra from 'nextra';
import { remarkMermaid } from './remark-mermaid'

export const withGuildDocs = ({ themeConfig = './theme.config.tsx', ...nextConfig }: NextConfig & { themeConfig: string }) => {
  const withBundleAnalyzer = nextBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });
  const withNextra = nextra({
    themeConfig,
    theme: 'nextra-theme-docs',
    unstable_staticImage: true,
    mdxOptions: {
      remarkPlugins: [remarkMermaid]
    }
  });

  return withBundleAnalyzer(withNextra(nextConfig));
};
