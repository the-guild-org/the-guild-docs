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
