import nextBundleAnalyzer from '@next/bundle-analyzer';
import nextra from 'nextra';

export const withGuildDocs = ({ themeConfig = './theme.config.tsx' }) => (nextConfig = {}) => {
  const withBundleAnalyzer = nextBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });
  const withNextra = nextra({
    themeConfig,
    theme: 'nextra-theme-docs',
    unstable_staticImage: true,
  });

  return withBundleAnalyzer(withNextra(nextConfig));
};
