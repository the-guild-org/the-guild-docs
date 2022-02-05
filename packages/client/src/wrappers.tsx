import { HamburgerIcon } from '@chakra-ui/icons';
import {
  ChakraProvider,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  DrawerProps,
  Heading,
  HStack,
  IconButton,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useLatestRef,
} from '@chakra-ui/react';
import type { Dict } from '@chakra-ui/utils';
import { Global } from '@emotion/react';
import type { IRoutes, MdxInternalProps } from '@guild-docs/types';
import { GlobalStyles, ThemeProvider as TGCThemeProvider } from '@theguild/components';
import { DefaultSeo } from 'next-seo';
import type { DefaultSeoProps, OpenGraphMedia } from 'next-seo/lib/types';
import type { AppProps } from 'next/app';
import React, { ComponentProps, Dispatch, ReactNode, SetStateAction, useMemo } from 'react';
import StickyBoxPkg from 'react-sticky-box';
import { DocsContainer, DocsNavigation, DocsNavigationDesktop, DocsNavigationMobile, DocsTitle } from './docs';
import { MDXNavigation, MDXNavigationProps } from './navigation';
import { NextNProgress } from './NextNProgress';
import { iterateRoutes } from './routes';
import { useIs404, getDefault } from './utils';

const StickyBox = getDefault(StickyBoxPkg);

export interface CombinedThemeProps {
  children: ReactNode;
  theme: Dict;
  accentColor: string;
  defaultSeo: AppSeoProps;
  /**
   * @default { includeFonts: true, includeBase: true }
   */
  globalStyleProps?: ComponentProps<typeof GlobalStyles>;
}

export interface AppSeoProps extends DefaultSeoProps {
  title: string;
  description: string;
  logo: OpenGraphMedia;
}

export function CombinedThemeProvider({ children, theme, accentColor, defaultSeo, globalStyleProps = {} }: CombinedThemeProps) {
  const DefaultSEO = useMemo(() => {
    if (!defaultSeo) throw Error('No `defaultSeo` specified in CombinedThemeProvider');
    const { logo, ...props } = defaultSeo;

    if (!props?.title) throw Error(`No defaultSeo.title specified!`);

    if (!props.description) throw Error(`No defaultSeo.description specified!`);

    (props.openGraph ||= {}).type ||= 'website';

    if (!logo?.url?.startsWith('https://')) throw Error(`No defaultSeo.logo.url specified with absolute https url!`);

    props.openGraph.images ||= [logo];

    return <DefaultSeo {...props} />;
  }, [defaultSeo]);

  const includeFonts = globalStyleProps.includeFonts ?? true;

  return (
    <>
      {DefaultSEO}
      <ChakraProvider theme={theme}>
        <Global
          styles={[
            {
              '.shiki': {
                whiteSpace: 'pre-wrap',
              },
              '#__next': {
                display: 'flex',
                minHeight: '100vh',
                flexDirection: 'column',
                '& > footer': {
                  marginTop: 'auto',
                },
              },
            },
            includeFonts && {
              '#__next': {
                fontFamily: 'TGCFont, sans-serif',
              },
            },
          ]}
        />
        <TGCThemeProviderComponent>
          {children}
          <GlobalStyles includeBase {...globalStyleProps} includeFonts={includeFonts} />
        </TGCThemeProviderComponent>
        <NextNProgress color={accentColor} />
      </ChakraProvider>
    </>
  );
}

function TGCThemeProviderComponent({ children }: { children: ReactNode }) {
  const { colorMode, setColorMode } = useColorMode();
  const darkThemeProps = useMemo<{
    isDarkTheme: boolean;
    setDarkTheme: Dispatch<SetStateAction<boolean>>;
  }>(() => {
    return {
      isDarkTheme: colorMode === 'dark',
      setDarkTheme: arg => {
        if (typeof arg === 'function') {
          setColorMode(arg(colorMode === 'dark') ? 'dark' : 'light');
        } else {
          setColorMode(arg ? 'dark' : 'light');
        }
      },
    };
  }, [colorMode, setColorMode]);

  return <TGCThemeProvider {...darkThemeProps} children={children} />;
}

export interface DocsPageProps {
  appProps: AppProps;
  accentColor: string;
  mdxRoutes: { data: IRoutes };
  docsNavigationProps?: ComponentProps<typeof DocsNavigation>;
  docsTitleProps?: ComponentProps<typeof DocsTitle>;
  mdxNavigationProps?: Partial<MDXNavigationProps>;
  docsContainerProps?: ComponentProps<typeof DocsContainer>;
  docsNavigationDesktopProps?: ComponentProps<typeof DocsNavigationDesktop>;
  docsNavigationMobileProps?: ComponentProps<typeof DocsNavigationMobile>;
  hamburgerProps?: Partial<ComponentProps<typeof IconButton>>;
  drawerProps?: Partial<DrawerProps>;
  drawerOverlayProps?: ComponentProps<typeof DrawerOverlay>;
  drawerContentProps?: ComponentProps<typeof DrawerContent>;
  drawerCloseButtonProps?: ComponentProps<typeof DrawerCloseButton>;
  drawerBodyProps?: ComponentProps<typeof DrawerBody>;
  /**
   * @default "left"
   */
  hamburgerSide?: 'left' | 'right';
}

export function DocsPage({
  appProps: { pageProps, Component },
  accentColor,
  hamburgerSide = 'left',
  ...restProps
}: DocsPageProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const mdxRoutes: MdxInternalProps['mdxRoutes'] = pageProps.mdxRoutes;

  const restPropsRef = useLatestRef(restProps);

  const navigation = useMemo(() => {
    const paths: IRoutes =
      mdxRoutes === 1
        ? restPropsRef.current.mdxRoutes.data
        : (restPropsRef.current.mdxRoutes.data = mdxRoutes || restPropsRef.current.mdxRoutes.data);
    if (!paths) throw Error('No MDX Navigation routes data!');
    return (
      <DocsNavigation {...restPropsRef.current.docsNavigationProps}>
        <DocsTitle children="Documentation" {...restPropsRef.current.docsTitleProps} />
        <MDXNavigation
          paths={iterateRoutes(paths)}
          accentColor={accentColor}
          handleLinkClick={onClose}
          {...restPropsRef.current.mdxNavigationProps}
        />
      </DocsNavigation>
    );
  }, [mdxRoutes, accentColor, onClose, restPropsRef]);

  const drawerBgContent = useColorModeValue('white', 'gray.850');
  const drawerBgButton = useColorModeValue('gray.200', 'gray.700');
  const drawerColorButton = useColorModeValue('gray.500', 'gray.100');

  const is404 = useIs404();

  return (
    <DocsContainer {...restProps.docsContainerProps}>
      <DocsNavigationDesktop {...restProps.docsNavigationDesktopProps}>
        <StickyBox offsetTop={100} offsetBottom={20}>
          {navigation}
        </StickyBox>
      </DocsNavigationDesktop>
      <DocsNavigationMobile {...restProps.docsNavigationMobileProps}>
        <IconButton
          onClick={onOpen}
          icon={<HamburgerIcon />}
          aria-label="Open navigation"
          size="sm"
          position="fixed"
          left={hamburgerSide === 'left' ? '1.5rem' : undefined}
          right={hamburgerSide === 'right' ? '1.5rem' : undefined}
          bottom="1.5rem"
          zIndex="1"
          backgroundColor={accentColor}
          color="#fff"
          {...restProps.hamburgerProps}
        />
        <Drawer size="2xl" isOpen={isOpen} onClose={onClose} placement="left" {...restProps.drawerProps}>
          <DrawerOverlay {...restProps.drawerOverlayProps} />
          <DrawerContent backgroundColor={drawerBgContent} {...restProps.drawerContentProps}>
            <DrawerCloseButton
              backgroundColor={drawerBgButton}
              color={drawerColorButton}
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
              {...restProps.drawerCloseButtonProps}
            />
            <DrawerBody {...restProps.drawerBodyProps}>{navigation}</DrawerBody>
          </DrawerContent>
        </Drawer>
      </DocsNavigationMobile>
      {is404 ? (
        <HStack as="main">
          <Heading fontSize="2em">404</Heading>
          <Divider orientation="vertical" height="100px" />
          <Text>This page could not be found.</Text>
        </HStack>
      ) : (
        <Component {...pageProps} />
      )}
    </DocsContainer>
  );
}
