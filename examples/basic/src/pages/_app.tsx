import 'remark-admonitions/styles/infima.css';
import 'prism-themes/themes/prism-atom-dark.css';
import '../../public/style.css';

import { appWithTranslation } from 'next-i18next';
import { ReactNode, useMemo, useState } from 'react';
import { Footer, GlobalStyles, Header, SearchBar, Subheader } from 'the-guild-components';

import { chakra, ChakraProvider, extendTheme } from '@chakra-ui/react';
import { ExtendComponents, iterateRoutes, MdxInternalProps, MDXNavigation, NextNProgress } from '@guild-docs/client';

import type { AppProps } from 'next/app';

export function ChakraThemeProvider({ children }: { children: ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}

ExtendComponents({
  HelloWorld() {
    return <p>Hello World!</p>;
  },
});

const theme = extendTheme({
  fonts: {
    heading: '"Poppins", sans-serif',
    body: '"Poppins", sans-serif',
  },
});

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
  const accentColor = '#1CC8EE';
  const isDocs = router.asPath.includes('docs');
  const mdxRoutes: MdxInternalProps['mdxRoutes'] | undefined = pageProps.mdxRoutes;
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);

  const Navigation = useMemo(() => {
    const paths = mdxRoutes === 1 ? mdxRoutesData : (mdxRoutesData = mdxRoutes || mdxRoutesData);
    return <MDXNavigation paths={iterateRoutes(paths)} accentColor={accentColor} />;
  }, [mdxRoutes]);

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
        <ChakraThemeProvider>
          <DocsContainer>
            <DocsNavigation zIndex={isSearchModalOpen ? '300' : '1'} transition={isSearchModalOpen ? '0s 0s' : '0s 0.3s'}>
              <DocsTitle>Documentation</DocsTitle>
              <DocsSearch>
                <SearchBar
                  isFull
                  placeholder="Search..."
                  title="Documentation"
                  accentColor={accentColor}
                  onHandleModal={setSearchModalOpen}
                />
              </DocsSearch>
              {Navigation}
            </DocsNavigation>
            <Component {...pageProps} />
          </DocsContainer>
        </ChakraThemeProvider>
      )}
      <Footer />
    </>
  );
}

export default appWithTranslation(App);
