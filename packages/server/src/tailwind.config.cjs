const path = require('path');
const CWD = process.cwd();

module.exports = {
  content: [
    path.join(CWD, 'website/src/**/*.{tsx,mdx}'),
    path.join(CWD, 'website/theme.config.tsx'),
    '../../../@theguild/components/dist/index.esm.js',
    '../../../nextra-theme-docs/dist/**/*.js',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
  },
  darkMode: 'class',
};
