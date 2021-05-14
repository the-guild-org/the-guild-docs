import { config } from './cliConfig';
import { writeFileFormatIfNotExists } from './writeFormat';

export async function writeNextConfig() {
  await writeFileFormatIfNotExists(
    [config.cwd, 'next.config.js'],
    `
  const { register } = require('esbuild-register/dist/node');

  register({
    extensions: ['.ts', '.tsx'],
  });
  
  const { i18n } = require('./next-i18next.config');
  
  const { withGuildDocs } = require('@guild-docs/server');
  
  const { getRoutes } = require('./routes.ts');
  
  module.exports = withGuildDocs({
    i18n,
    getRoutes,
  });      
`,
    'typescript'
  );
}

export async function writei18Config() {
  await writeFileFormatIfNotExists(
    [config.cwd, 'next-i18next.config.js'],
    `
  module.exports = {
      i18n: {
        defaultLocale: "en",
        locales: ["en"],
      },
    };
  `,
    'typescript'
  );
}

export async function writeRoutes() {
  await writeFileFormatIfNotExists(
    [config.cwd, 'routes.ts'],
    `
    import { IRoutes, GenerateRoutes } from '@guild-docs/server';

    export function getRoutes(): IRoutes {
      const Routes: IRoutes = {
        _: {
          index: {
            $name: 'Home',
            $routes: [['index', 'Home Page']],
          },
        },
      };
      GenerateRoutes({
        Routes,
        folderPattern: 'docs',
        basePath: 'docs',
        basePathLabel: 'Documentation',
        labels: {
          index: 'Docs',
        },
      });

      return Routes;
    }

    `,

    'typescript'
  );
}

export async function writeTranslations() {
  await writeFileFormatIfNotExists(
    [config.cwd, 'public/locales/en/common.json'],
    `
  {
    "greeting": "Hello!"
  }
  
  `,
    'json'
  );
}

export async function writeApp() {
  await writeFileFormatIfNotExists(
    [config.cwd, 'src/pages/_app.tsx'],
    `
    import 'remark-admonitions/styles/classic.css';
    import 'remark-admonitions/styles/infima.css';
    import 'prism-themes/themes/prism-dracula.css';
    
    import { appWithTranslation } from 'next-i18next';
    import { ReactNode, useMemo } from 'react';
    import { MDXProvider } from '@mdx-js/react';
    
    import { Box, ChakraProvider, extendTheme, Stack, chakra } from '@chakra-ui/react';
    
    import { NextNProgress, MdxInternalProps, MDXNavigation, iterateRoutes, components, ExtendComponents } from '@guild-docs/client';
    
    import type { AppProps } from 'next/app';
    
    const theme = extendTheme({
      colors: {},
    });

    const a = chakra('a', {
      baseStyle: {
        fontWeight: 'bold',
        color: 'blue.600',
      },
    });
    
    ExtendComponents({
      HelloWorld() {
        return <p>Hello World!</p>;
      },
      a
    });
    
    export function AppThemeProvider({ children }: { children: ReactNode }) {
      return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
    }
    
    const serializedMdx = process.env.SERIALIZED_MDX_ROUTES;
    let mdxRoutesData = serializedMdx && JSON.parse(serializedMdx);
    
    function App({ Component, pageProps }: AppProps) {
      const mdxRoutes: MdxInternalProps['mdxRoutes'] | undefined = pageProps.mdxRoutes;
      const Navigation = useMemo(() => {
        const paths = mdxRoutes === 1 ? mdxRoutesData : (mdxRoutesData = mdxRoutes || mdxRoutesData);
    
        return <MDXNavigation paths={iterateRoutes(paths)} />;
      }, [mdxRoutes]);
      return (
        <>
          <NextNProgress />
          <MDXProvider components={components}>
            <AppThemeProvider>
              <Stack isInline>
                <Box maxW="280px" width="100%">
                  {Navigation}
                </Box>
                <Component {...pageProps} />
              </Stack>
            </AppThemeProvider>
          </MDXProvider>
        </>
      );
    }
    
    export default appWithTranslation(App);
        `,
    'typescript'
  );
}

export async function writeDocPages() {
  const w1 = writeFileFormatIfNotExists(
    [config.cwd, 'src/pages/docs/[[...slug]].tsx'],
    `
  import { Stack } from '@chakra-ui/react';

  import { MDXPage } from '@guild-docs/client';
  import { MDXPaths, MDXProps } from '@guild-docs/server';

  import { getRoutes } from '../../../routes';

  import type { GetStaticPaths, GetStaticProps } from 'next';

  export default MDXPage(function PostPage({ content }) {
    return (
      <Stack>
        <main>{content}</main>
      </Stack>
    );
  });

  export const getStaticProps: GetStaticProps = ctx => {
    return MDXProps(
      ({ readMarkdownFile, getArrayParam }) => {
        return readMarkdownFile('docs/', getArrayParam('slug'));
      },
      ctx,
      {
        getRoutes,
      }
    );
  };

  export const getStaticPaths: GetStaticPaths = ctx => {
    return MDXPaths('docs', { ctx });
  };
  `,
    'typescript'
  );

  const w2 = writeFileFormatIfNotExists(
    [config.cwd, 'src/pages/index.tsx'],
    `
  export default function Index() {
    return <p>Welcome!</p>;
  }
  
  `,
    'typescript'
  );

  await Promise.all([w1, w2]);
}

export async function writeDocsDirectory() {
  await writeFileFormatIfNotExists(
    [config.cwd, 'docs/index.mdx'],
    `
# Index Docs Page

<Translated>greeting</Translated> This is the Index of the Documentation Page!

<HelloWorld />

  `,
    'mdx'
  );
}

export async function writeTSConfig() {
  await writeFileFormatIfNotExists(
    [config.cwd, 'tsconfig.json'],
    `
{
  "compilerOptions": {
    "target": "es2019",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "noEmit": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
      `,
    'json'
  );
}
