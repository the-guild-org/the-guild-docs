import { withGuildDocs } from 'guild-docs/next.config';

export default withGuildDocs({
  eslint: {
    ignoreDuringBuilds: true,
  },
});
