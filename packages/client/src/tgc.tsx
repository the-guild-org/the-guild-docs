import React, { ComponentProps, Dispatch, ReactNode, SetStateAction, useMemo } from 'react';

import { HamburgerIcon } from '@chakra-ui/icons';
import {
  ChakraProvider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  DrawerProps,
  IconButton,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { MdxInternalProps } from '@guild-docs/types';
import { GlobalStyles, ThemeProvider as TGCThemeProvider } from '@theguild/components';

import { DocsContainer, DocsNavigation, DocsNavigationDesktop, DocsNavigationMobile, DocsTitle } from './docs/index';
import { MDXNavigation, MDXNavigationProps } from './navigation';
import { NextNProgress } from './NextNProgress';
import { iterateRoutes } from './routes';

import type { AppProps } from 'next/app';

import type { Dict } from '@chakra-ui/utils';
import type { IRoutes } from '@guild-docs/types';

export interface CombinedThemeProps {
  children: ReactNode;
  theme: Dict;
  accentColor: string;
}

export function CombinedThemeProvider({ children, theme, accentColor }: CombinedThemeProps) {
  return (
    <ChakraProvider theme={theme}>
      <TGCThemeProviderComponent>
        {children}
        <GlobalStyles />
      </TGCThemeProviderComponent>
      <NextNProgress color={accentColor} />
    </ChakraProvider>
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
  docsNavigationProps?: Omit<ComponentProps<typeof DocsNavigation>, 'children'>;
  docsTitleProps?: ComponentProps<typeof DocsTitle>;
  mdxNavigationProps?: Partial<MDXNavigationProps>;
  docsContainerProps?: Omit<ComponentProps<typeof DocsContainer>, 'children'>;
  docsNavigationDesktopProps?: Omit<ComponentProps<typeof DocsNavigationDesktop>, 'children'>;
  docsNavigationMobileProps?: Omit<ComponentProps<typeof DocsNavigationMobile>, 'children'>;
  hamburgerProps?: ComponentProps<typeof IconButton>;
  drawerProps?: DrawerProps;
  drawerOverlayProps?: ComponentProps<typeof DrawerOverlay>;
  drawerContentProps?: Omit<ComponentProps<typeof DrawerContent>, 'children'>;
  drawerCloseButtonProps?: ComponentProps<typeof DrawerCloseButton>;
  drawerBodyProps?: Omit<ComponentProps<typeof DrawerBody>, 'children'>;
}

export function DocsPage({ appProps: { pageProps, Component }, accentColor, ...restProps }: DocsPageProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const mdxRoutes: MdxInternalProps['mdxRoutes'] | undefined = pageProps.mdxRoutes;
  const Navigation = useMemo(() => {
    const paths: IRoutes =
      mdxRoutes === 1 ? restProps.mdxRoutes.data : (restProps.mdxRoutes.data = mdxRoutes || restProps.mdxRoutes.data);
    if (!paths) throw Error('No MDX Navigation routes data!');
    return (
      <DocsNavigation {...restProps.docsNavigationProps}>
        <DocsTitle children="Documentation" {...restProps.docsTitleProps} />
        <MDXNavigation
          paths={iterateRoutes(paths)}
          accentColor={accentColor}
          handleLinkClick={onClose}
          defaultOpenDepth={4}
          {...restProps.mdxNavigationProps}
        />
      </DocsNavigation>
    );
  }, [mdxRoutes]);

  const drawerBgContent = useColorModeValue('white', 'gray.850');
  const drawerBgButton = useColorModeValue('gray.200', 'gray.700');
  const drawerColorButton = useColorModeValue('gray.500', 'gray.100');

  return (
    <DocsContainer {...restProps.docsContainerProps}>
      <DocsNavigationDesktop {...restProps.docsNavigationDesktopProps} children={Navigation} />
      <DocsNavigationMobile {...restProps.docsNavigationMobileProps}>
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
            <DrawerBody {...restProps.drawerBodyProps} children={Navigation} />
          </DrawerContent>
        </Drawer>
      </DocsNavigationMobile>
      <Component {...pageProps} />
    </DocsContainer>
  );
}
