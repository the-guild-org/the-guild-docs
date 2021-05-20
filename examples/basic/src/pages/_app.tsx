import 'remark-admonitions/styles/infima.css';
import 'prism-themes/themes/prism-atom-dark.css';
import 'tailwindcss/tailwind.css';

import { appWithTranslation } from 'next-i18next';
import { ReactNode, useMemo } from 'react';

import { useRouter } from 'next/router';

import { Box, ChakraProvider, extendTheme, Stack, chakra } from '@chakra-ui/react';

import { NextNProgress, MdxInternalProps, MDXNavigation, iterateRoutes, ExtendComponents } from '@guild-docs/client';

import { GlobalStyles, Header, Subheader, Footer } from 'the-guild-components';

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
  a,
});

export function AppThemeProvider({ children }: { children: ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}

const serializedMdx = process.env.SERIALIZED_MDX_ROUTES;
let mdxRoutesData = serializedMdx && JSON.parse(serializedMdx);

function App({ Component, pageProps }: AppProps) {
  const router = useRouter() || {};

  const asPath = router.asPath || '_';

  const isDocs = asPath.includes('docs');
  const mdxRoutes: MdxInternalProps['mdxRoutes'] | undefined = pageProps.mdxRoutes;

  const Navigation = useMemo(() => {
    const paths = mdxRoutes === 1 ? mdxRoutesData : (mdxRoutesData = mdxRoutes || mdxRoutesData);

    return <MDXNavigation paths={iterateRoutes(paths)} />;
  }, [mdxRoutes]);

  return (
    <>
      <NextNProgress />
      <GlobalStyles />
      <Header accentColor="#1CC8EE" activeLink="/open-source" />
      <Subheader
        router={router}
        activeLink={asPath}
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
        <Stack isInline>
          <Box maxW="280px" width="100%">
            {Navigation}
          </Box>
          <Component {...pageProps} />
        </Stack>
      )}
      <Footer />
    </>
  );
}

export default appWithTranslation(App);
