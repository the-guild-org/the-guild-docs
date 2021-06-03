import 'remark-admonitions/styles/infima.css';
import 'prism-themes/themes/prism-atom-dark.css';
import '../../public/style.css';

import { appWithTranslation } from 'next-i18next';
import { ReactNode, useMemo } from 'react';
import { Footer, GlobalStyles, Header, Subheader, ThemeProvider as ComponentsThemeProvider } from '@guild-docs/tgc';

import { HamburgerIcon } from '@chakra-ui/icons';
import {
  ChakraProvider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  extendTheme,
  IconButton,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  theme as defaultTheme,
} from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

import {
  DocsContainer,
  DocsNavigation,
  DocsNavigationDesktop,
  DocsNavigationMobile,
  DocsTitle,
  ExtendComponents,
  iterateRoutes,
  MdxInternalProps,
  MDXNavigation,
  NextNProgress,
} from '@guild-docs/client';

import type { AppProps } from 'next/app';

import { handleRoute } from '../../next-helpers';

export function ChakraThemeProvider({ children }: { children: ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}

ExtendComponents({
  HelloWorld() {
    return <p>Hello World!</p>;
  },
});

const styles: typeof defaultTheme['styles'] = {
  global: props => ({
    body: {
      bg: mode('white', 'gray.850')(props),
    },
  }),
};

const theme = extendTheme({
  colors: {
    gray: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      850: '#1b1b1b',
      900: '#171717',
    },
  },
  fonts: {
    heading: '"Poppins", sans-serif',
    body: '"Poppins", sans-serif',
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles,
});

const accentColor = '#1CC8EE';

const serializedMdx = process.env.SERIALIZED_MDX_ROUTES;
let mdxRoutesData = serializedMdx && JSON.parse(serializedMdx);

function ChakraWrapper({ color, appProps }: { color: string; appProps: AppProps }) {
  const { Component, pageProps, router } = appProps;

  const isDocs = router.asPath.includes('docs');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { toggleColorMode } = useColorMode();

  const mdxRoutes: MdxInternalProps['mdxRoutes'] | undefined = pageProps.mdxRoutes;
  const Navigation = useMemo(() => {
    const paths = mdxRoutes === 1 ? mdxRoutesData : (mdxRoutesData = mdxRoutes || mdxRoutesData);
    return (
      <DocsNavigation>
        <DocsTitle>Documentation</DocsTitle>
        <MDXNavigation paths={iterateRoutes(paths)} accentColor={color} handleLinkClick={onClose} />
      </DocsNavigation>
    );
  }, [mdxRoutes]);

  return (
    <ComponentsThemeProvider>
      <GlobalStyles />
      <Header accentColor={color} activeLink="/open-source" themeSwitch onThemeSwitch={toggleColorMode} />
      <Subheader
        activeLink={router.asPath}
        product={{
          title: 'Docs',
          description: 'Lorem ipsum dolor sit amet',
          image: {
            src: '/assets/subheader-logo.svg',
            alt: 'Docs',
          },
          onClick: e => handleRoute('/', e, router),
        }}
        links={[
          {
            children: 'Home',
            title: 'Read about Guild Docs',
            href: '/',
            onClick: e => handleRoute('/', e, router),
          },
          {
            children: 'Docs',
            title: 'View examples',
            href: '/docs',
            onClick: e => handleRoute('/docs', e, router),
          },
        ]}
        cta={{
          children: 'Get Started',
          title: 'Start using The Guild Docs',
          href: 'https://github.com/the-guild-org/the-guild-docs',
          target: '_blank',
          rel: 'noopener noreferrer',
        }}
      />
      {!isDocs ? (
        <Component {...pageProps} />
      ) : (
        <DocsContainer>
          <DocsNavigationDesktop>{Navigation}</DocsNavigationDesktop>
          <DocsNavigationMobile>
            <IconButton
              onClick={onOpen}
              icon={<HamburgerIcon />}
              aria-label="Open navigation"
              size="sm"
              position="fixed"
              right="1.5rem"
              bottom="1.5rem"
              zIndex="1"
              backgroundColor={color}
              color="#fff"
            />
            <Drawer size="2xl" isOpen={isOpen} onClose={onClose} placement="left">
              <DrawerOverlay />
              <DrawerContent backgroundColor={useColorModeValue('white', 'gray.850')}>
                <DrawerCloseButton
                  backgroundColor={useColorModeValue('gray.200', 'gray.700')}
                  color={useColorModeValue('gray.500', 'gray.100')}
                  height="2.375rem"
                  width="2.375rem"
                  top="1.5rem"
                  right="1.5rem"
                  fontSize="0.85rem"
                  borderRadius="0.5rem"
                  border="2px solid transparent"
                  _hover={{
                    borderColor: 'gray.500',
                  }}
                />
                <DrawerBody>{Navigation}</DrawerBody>
              </DrawerContent>
            </Drawer>
          </DocsNavigationMobile>
          <Component {...pageProps} />
        </DocsContainer>
      )}
      <Footer />
    </ComponentsThemeProvider>
  );
}

function App(appProps: AppProps) {
  return (
    <ChakraThemeProvider>
      <NextNProgress color={accentColor} />
      <ChakraWrapper color={accentColor} appProps={appProps} />
    </ChakraThemeProvider>
  );
}

export default appWithTranslation(App);
