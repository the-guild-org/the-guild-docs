import 'remark-admonitions/styles/infima.css';
import 'prism-themes/themes/prism-atom-dark.css';
import '../../public/style.css';

import { appWithTranslation } from 'next-i18next';
import { ReactNode, useMemo } from 'react';
import { Footer, GlobalStyles, Header, Subheader } from 'the-guild-components';

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
  theme as chakraTheme,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import {
  DocsContainer,
  DocsDrawer,
  DocsNavigation,
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

const theme = extendTheme({
  fonts: {
    heading: '"Poppins", sans-serif',
    body: '"Poppins", sans-serif',
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
} as typeof chakraTheme);

const serializedMdx = process.env.SERIALIZED_MDX_ROUTES;
let mdxRoutesData = serializedMdx && JSON.parse(serializedMdx);

function App({ Component, pageProps, router }: AppProps) {
  const accentColor = '#1CC8EE';
  const isDocs = router.asPath.includes('docs');
  const [isLg] = useMediaQuery('(min-width: 992px)');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const mdxRoutes: MdxInternalProps['mdxRoutes'] | undefined = pageProps.mdxRoutes;
  const Navigation = useMemo(() => {
    const paths = mdxRoutes === 1 ? mdxRoutesData : (mdxRoutesData = mdxRoutes || mdxRoutesData);
    return (
      <DocsNavigation>
        <DocsTitle>Documentation</DocsTitle>
        <MDXNavigation paths={iterateRoutes(paths)} accentColor={accentColor} handleLinkClick={onClose} />
      </DocsNavigation>
    );
  }, [mdxRoutes]);

  return (
    <>
      <NextNProgress />
      <GlobalStyles />
      <Header accentColor={accentColor} activeLink="/open-source" />
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
        <ChakraThemeProvider>
          <DocsContainer>
            {isLg ? (
              Navigation
            ) : (
              <DocsDrawer>
                <IconButton
                  onClick={onOpen}
                  icon={<HamburgerIcon />}
                  aria-label="Open navigation"
                  size="sm"
                  position="fixed"
                  right="1.5rem"
                  bottom="1.5rem"
                  zIndex="1"
                  backgroundColor={accentColor}
                  color="#fff"
                />
                <Drawer size="2xl" isOpen={isOpen} onClose={onClose} placement="left">
                  <DrawerOverlay />
                  <DrawerContent>
                    <DrawerCloseButton
                      backgroundColor="#E5E7EB"
                      color="#7F818C"
                      height="2.375rem"
                      width="2.375rem"
                      top="1.5rem"
                      right="1.5rem"
                      fontSize="0.85rem"
                      borderRadius="0.5rem"
                    />
                    <DrawerBody>{Navigation}</DrawerBody>
                  </DrawerContent>
                </Drawer>
              </DocsDrawer>
            )}
            <Component {...pageProps} />
          </DocsContainer>
        </ChakraThemeProvider>
      )}
      <Footer />
    </>
  );
}

export default appWithTranslation(App);
