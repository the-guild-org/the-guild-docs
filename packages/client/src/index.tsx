import { useTranslation } from 'next-i18next';
import { MDXRemote } from 'next-mdx-remote';
import Head from 'next/head';
import Image from 'next/image';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { useRouter } from 'next/router';
import React, { createElement, ReactElement } from 'react';

import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Code,
  CodeProps,
  Collapse,
  Divider,
  Heading,
  HeadingProps,
  Kbd,
  Link as ChakraLink,
  LinkProps,
  Stack,
  StackProps,
  Text,
  TextProps,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';

import type { ReactNode } from 'react';
import type { MdxPageProps, Paths, MdxInternalProps, IRoutes } from '@guild-docs/types';

export function Translated({ children, name }: { children?: ReactNode; name?: string }): ReactNode {
  const { t } = useTranslation('common');

  if (typeof name === 'string') {
    return t(name);
  }
  if (typeof children === 'string') {
    return t(children);
  }
  return children;
}

const p = ({ children, ...delegated }: TextProps) => {
  return (
    <Text as="p" mt={4} lineHeight="tall" {...delegated}>
      {children}
    </Text>
  );
};

const ul = ({ children, ...delegated }: BoxProps) => {
  return (
    <Box as="ul" pt={2} pl={4} ml={2} {...delegated}>
      {children}
    </Box>
  );
};

const ol = ({ children, ...delegated }: BoxProps) => {
  return (
    <Box as="ol" pt={2} pl={4} ml={2} {...delegated}>
      {children}
    </Box>
  );
};

const li = ({ children, ...delegated }: BoxProps) => {
  return (
    <Box as="li" pb={1} {...delegated}>
      {children}
    </Box>
  );
};

const blockquote = (props: BoxProps) => {
  const bgColor = useColorModeValue('blue.50', 'blue.900');

  return (
    <Box
      mt={4}
      w="full"
      bg={bgColor}
      variant="left-accent"
      status="info"
      css={{
        '> *:first-of-type': {
          marginTop: 0,
          marginLeft: 8,
        },
      }}
      {...props}
    />
  );
};

const hr = () => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return <Divider borderColor={borderColor} my={4} w="full" />;
};

const h1 = ({ children, ...delegated }: HeadingProps) => {
  return (
    <Heading as="h1" size="xl" my={4} {...delegated}>
      {children}
    </Heading>
  );
};

const h2 = ({ children, ...delegated }: HeadingProps) => {
  return (
    <Heading as="h2" fontWeight="bold" size="lg" {...delegated}>
      {children}
    </Heading>
  );
};

const h3 = ({ children, ...delegated }: HeadingProps) => {
  return (
    <Heading as="h3" size="md" fontWeight="bold" {...delegated}>
      {children}
    </Heading>
  );
};

const Link = ({ href, as, replace, scroll, shallow, passHref, prefetch, locale, ...props }: LinkProps & NextLinkProps) => {
  return (
    <NextLink
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref={passHref ?? true}
      prefetch={prefetch}
      locale={locale}
    >
      <ChakraLink as="a" {...props} />
    </NextLink>
  );
};

const ButtonLink = ({
  href,
  as,
  replace,
  scroll,
  shallow,
  passHref,
  prefetch,
  locale,
  ...props
}: ButtonProps & NextLinkProps) => {
  return (
    <NextLink
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref={passHref ?? true}
      prefetch={prefetch}
      locale={locale}
    >
      <Button as="a" {...props} />
    </NextLink>
  );
};

const table = (props: BoxProps) => <Box as="table" textAlign="left" mt="32px" width="full" {...props} />;

const th = (props: BoxProps) => {
  const bg = useColorModeValue('gray.50', 'whiteAlpha.100');

  return <Box as="th" bg={bg} fontWeight="semibold" p={2} fontSize="sm" {...props} />;
};

const td = (props: BoxProps) => (
  <Box as="td" p={2} borderTopWidth="1px" borderColor="inherit" fontSize="sm" whiteSpace="normal" {...props} />
);

export const components = {
  Image,
  h1,
  h2,
  h3,
  p,
  ul,
  ol,
  li,
  blockquote,
  hr,
  table,
  th,
  td,
  kbd: Kbd,
  a: Link,
  Link,
  ButtonLink,
  Button,
  Translated,
  Stack,
  inlineCode: (props: CodeProps) => <Code colorScheme="yellow" fontSize="0.84em" {...props} />,
};

export function ExtendComponents<TComponents extends Record<string, (props: Record<string, unknown>) => ReactNode>>(
  extension: Partial<typeof components> & TComponents
) {
  Object.assign(components, extension);
}

export function arePathnamesEqual(a: string, b: string) {
  if (a.endsWith('/') && b.endsWith('/')) return a === b;
  else if (a.endsWith('/')) return a.slice(0, a.length - 1) === b;
  else if (b.endsWith('/')) return b.slice(0, b.length - 1) === a;
  return a === b;
}

function NavigationItem({
  item: { href, name, paths, isPage },
  acumHref,
  depth,
  buttonProps = {},
  stackProps = {},
}: {
  item: Paths;
  acumHref: string;
  depth: number;
  buttonProps?: ButtonProps;
  stackProps?: StackProps;
}) {
  const finalHref = (acumHref !== '/' ? acumHref + '/' : acumHref) + (href === 'index' ? '' : href);

  const isAnchor = isPage && !paths?.length;

  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: depth < 1,
  });

  const Router = useRouter();

  return (
    <>
      <Button
        justifyContent="flex-start"
        variant="ghost"
        width="100%"
        as={isAnchor ? 'a' : undefined}
        href={isAnchor ? finalHref : undefined}
        whiteSpace="normal"
        onClick={
          isAnchor
            ? (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                ev.preventDefault();

                if (!arePathnamesEqual(Router.asPath, finalHref)) {
                  Router.push(finalHref, undefined, {
                    scroll: true,
                  });
                }
              }
            : () => {
                onToggle();
              }
        }
        onMouseOver={
          isAnchor
            ? () => {
                if (!arePathnamesEqual(Router.asPath, finalHref)) {
                  Router.prefetch(finalHref);
                }
              }
            : undefined
        }
        alignItems="center"
        marginY="2px"
        paddingX={`${depth + 1}em`}
        {...buttonProps}
      >
        <span>{name || href}</span>
        {paths?.length ? (
          <ChevronDownIcon className="chevdown" transition="transform 0.3s" transform={isOpen ? 'rotate(180deg)' : undefined} />
        ) : null}
      </Button>

      {paths?.length ? (
        <Collapse in={isOpen} unmountOnExit>
          <MDXNavigation
            paths={paths}
            acumHref={finalHref}
            depth={depth + 1}
            stackProps={stackProps}
            navigationButtonProps={buttonProps}
          />
        </Collapse>
      ) : null}
    </>
  );
}

export function MDXNavigation({
  paths,
  acumHref = '',
  depth = 0,
  stackProps = {},
  navigationButtonProps = {},
}: {
  paths: Paths[];
  acumHref?: string;
  depth?: number;
  stackProps?: StackProps;
  navigationButtonProps?: ButtonProps;
}) {
  const Component = paths.map((item, index) => {
    return <NavigationItem key={index} item={item} acumHref={acumHref} depth={depth} buttonProps={navigationButtonProps} />;
  });

  if (depth === 0) {
    return (
      <Stack width="280px" spacing="0" {...stackProps}>
        {Component}
      </Stack>
    );
  }
  return <>{Component}</>;
}

export function MDXPage(cmp: (props: MdxPageProps) => ReactElement) {
  return function MDXPage({ children, source, frontMatter }: MdxInternalProps) {
    const title = frontMatter.title;

    const content = (
      <>
        {title ? (
          <Head>
            <title>{title}</title>
          </Head>
        ) : null}

        <MDXRemote {...source} components={components} />
      </>
    );

    return createElement(cmp, {
      content,
      frontMatter,
      useTranslation,
      children,
    });
  };
}

export { NextNProgress } from './NProgress';

export function iterateRoutes(routes: IRoutes, paths: Paths[] = []): Paths[] {
  const { $routes, _: restRoutes = {} } = routes;

  for (const [href, { $name, $routes, _: entryRoutes = {} }] of Object.entries(restRoutes)) {
    paths.push({
      href,
      name: $name,
      paths: iterateRoutes({ $routes, _: entryRoutes }),
      isPage: !!$routes?.find(v => (Array.isArray(v) ? v[0] : v) === 'index') || Object.keys(entryRoutes).includes('index'),
    });
  }

  if ($routes) {
    for (const route of $routes) {
      const [href, name] = Array.isArray(route) ? route : [route, route];
      if (paths.find(v => v.href === href)) continue;
      paths.push({
        href,
        name,
        isPage: true,
      });
    }
  }

  return paths;
}

export * from '@guild-docs/types';
