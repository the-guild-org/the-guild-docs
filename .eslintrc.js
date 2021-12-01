module.exports = {
  reportUnusedDisableDirectives: true,
  overrides: [
    {
      files: '*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}',
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'prettier',
      ],
      parser: '@typescript-eslint/parser',
      rules: {
        'object-shorthand': ['error', 'always'],
        'no-else-return': ['error', { allowElseIf: false }],
        'react/jsx-curly-brace-presence': ['error', 'never'],
        'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
        // eslint has wrong import path resolution and also doesn't seem to find regular dependencies
        'import/no-unresolved': 'off',
        // There are legitimate reasons some types are set as "any" for easier usage
        '@typescript-eslint/no-explicit-any': 'off',
        // This is an arbitrary and useless rule
        'react/no-children-prop': 'off',
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
    {
      files: ['next.config.js', 'next-i18next.config.js', '.eslintrc.js', 'scripts/*'],
      env: {
        node: true,
      },
    },
    {
      files: 'examples/**/*',
      rules: {
        'react/react-in-jsx-scope': 'off', // no need for NextJS
      },
    },
  ],
};
