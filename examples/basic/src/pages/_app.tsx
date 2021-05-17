import 'remark-admonitions/styles/infima.css';
import 'prism-themes/themes/prism-atom-dark.css';
import 'tailwindcss/tailwind.css';

import { appWithTranslation } from 'next-i18next';
import { ReactNode, useMemo } from 'react';

import { Box, ChakraProvider, extendTheme, Stack, chakra } from '@chakra-ui/react';

import { NextNProgress, MdxInternalProps, MDXNavigation, iterateRoutes, ExtendComponents } from '@guild-docs/client';

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
  const mdxRoutes: MdxInternalProps['mdxRoutes'] | undefined = pageProps.mdxRoutes;
  const Navigation = useMemo(() => {
    const paths = mdxRoutes === 1 ? mdxRoutesData : (mdxRoutesData = mdxRoutes || mdxRoutesData);

    return <MDXNavigation paths={iterateRoutes(paths)} />;
  }, [mdxRoutes]);
  return (
    <>
      <NextNProgress />
      <AppThemeProvider>
        <Stack isInline>
          <Box maxW="280px" width="100%">
            {Navigation}
          </Box>
          <Component {...pageProps} />
        </Stack>
      </AppThemeProvider>
    </>
  );
}

export default appWithTranslation(App);
