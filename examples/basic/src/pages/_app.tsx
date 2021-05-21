import 'remark-admonitions/styles/infima.css';
import 'prism-themes/themes/prism-atom-dark.css';
import 'tailwindcss/tailwind.css';

import { appWithTranslation } from 'next-i18next';
import { ReactNode, useMemo } from 'react';

import { chakra, ChakraProvider, extendTheme } from '@chakra-ui/react';

import { NextNProgress, MdxInternalProps, MDXNavigation, iterateRoutes, ExtendComponents } from '@guild-docs/client';

import { GlobalStyles, Header, Subheader, Footer, SearchBar } from 'the-guild-components';

import type { AppProps } from 'next/app';

export function AppThemeProvider({ children }: { children: ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}

ExtendComponents({
  HelloWorld() {
    return <p>Hello World!</p>;
  },
});

const theme = extendTheme({});

const DocsContainer = chakra('section', {
  baseStyle: {
    display: 'flex',
    flexWrap: {
      base: 'wrap',
      lg: 'nowrap',
    },
    maxW: '1200px',
    width: '100%',
    mx: 'auto',
    px: '1.5rem',
    py: {
      base: '1.5rem',
      lg: '3rem',
    },
  },
});

const DocsNavigation = chakra('aside', {
  baseStyle: {
    position: 'sticky',
    zIndex: '300', // TODO: Influenced by setup done for Docusaurus | Remove when no longer needed
    top: '7rem',
    display: {
      base: 'none',
      lg: 'block',
    },
    height: 'fit-content',
    width: '16rem',
  },
});

const DocsTitle = chakra('h2', {
  baseStyle: {
    mb: '0.5rem',
    fontWeight: 'bold',
    fontSize: '1.125rem',
    fontFamily: 'Poppins',
  },
});

const DocsSearch = chakra('div', {
  baseStyle: {
    mb: '0.5rem',
  },
});

const serializedMdx = process.env.SERIALIZED_MDX_ROUTES;
let mdxRoutesData = serializedMdx && JSON.parse(serializedMdx);

function App({ Component, pageProps, router }: AppProps) {
  const isDocs = router.asPath.includes('docs');
  const mdxRoutes: MdxInternalProps['mdxRoutes'] | undefined = pageProps.mdxRoutes;

  const Navigation = useMemo(() => {
    const paths = mdxRoutes === 1 ? mdxRoutesData : (mdxRoutesData = mdxRoutes || mdxRoutesData);
    return <MDXNavigation paths={iterateRoutes(paths)} />;
  }, [mdxRoutes]);

  const accentColor = '#1CC8EE';

  return (
    <>
      <NextNProgress />
      <GlobalStyles />
      <Header accentColor={accentColor} activeLink="/open-source" />
      <Subheader
        router={router}
        activeLink={router.asPath}
        product={{
          title: 'Docs',
          description: 'Lorem ipsum dolor sit amet',
          image: {
            src: '/assets/subheader-logo.svg',
            alt: 'Docs',
          },
        }}
        links={[
          {
            label: 'Home',
            title: 'Read about Guild Docs',
            href: '/',
          },
          {
            label: 'Docs',
            title: 'View examples',
            href: '/docs',
          },
        ]}
        cta={{
          label: 'Get Started',
          title: 'Start using The Guild Docs',
          href: 'https://github.com/the-guild-org/the-guild-docs',
        }}
      />

      {!isDocs ? (
        <Component {...pageProps} />
      ) : (
        <AppThemeProvider>
          <DocsContainer>
            <DocsNavigation>
              <DocsTitle>Documentation</DocsTitle>
              <DocsSearch>
                <SearchBar placeholder="Search..." title="Documentation" accentColor={accentColor} isFull />
              </DocsSearch>
              {Navigation}
            </DocsNavigation>
            <Component {...pageProps} />
          </DocsContainer>
        </AppThemeProvider>
      )}
      <Footer />
    </>
  );
}

export default appWithTranslation(App);
