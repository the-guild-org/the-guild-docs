import 'remark-admonitions/styles/classic.css';
import 'remark-admonitions/styles/infima.css';
import 'prism-themes/themes/prism-dracula.css';

import { appWithTranslation } from 'next-i18next';
import { ReactNode, useMemo } from 'react';
import { MDXProvider } from '@mdx-js/react';

import { Box, ChakraProvider, extendTheme, Stack } from '@chakra-ui/react';

import { NextNProgress, MdxInternalProps, MDXNavigation, iterateRoutes, components, ExtendComponents } from '@guild-docs/client';

import type { AppProps } from 'next/app';

const theme = extendTheme({
  colors: {},
});

ExtendComponents({
  HelloWorld() {
    return <p>Hello World!</p>;
  },
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
