import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import NextLinkImport from 'next/link';
import React, { ComponentType, ReactNode } from 'react';

import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Code,
  CodeProps,
  Divider,
  Heading,
  HeadingProps,
  Kbd,
  Link as ChakraLink,
  LinkProps,
  ListItem,
  ListItemProps,
  ListProps,
  OrderedList,
  Stack,
  Text,
  TextProps,
  UnorderedList,
  useColorModeValue,
} from '@chakra-ui/react';

import { getDefault } from './utils';

import type { LinkProps as NextLinkProps } from 'next/link';

const NextLink = getDefault(NextLinkImport);

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

const ul = ({ children, ...delegated }: ListProps) => {
  return (
    <UnorderedList as="ul" pt={2} pl={4} ml={2} {...delegated}>
      {children}
    </UnorderedList>
  );
};

const ol = ({ children, ...delegated }: ListProps) => {
  return (
    <OrderedList as="ol" pt={2} pl={4} ml={2} {...delegated}>
      {children}
    </OrderedList>
  );
};

const li = ({ children, ...delegated }: ListItemProps) => {
  return (
    <ListItem as="li" pb={1} {...delegated}>
      {children}
    </ListItem>
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

const h1 = ({ children, id, ...delegated }: HeadingProps) => {
  return (
    <Heading
      as="h1"
      size="xl"
      my={4}
      mt="-24"
      pt="28"
      id={id}
      _hover={{
        a: {
          opacity: '1',
        },
      }}
      {...delegated}
    >
      {children}
      {id ? (
        <Text
          as="a"
          paddingLeft="0.2em"
          href={'#' + id}
          transition="opacity 0.3s"
          opacity="0"
          _hover={{ opacity: '1', textDecoration: 'underline' }}
          title="Direct link to heading"
        >
          #
        </Text>
      ) : null}
    </Heading>
  );
};

const h2 = ({ children, id, ...delegated }: HeadingProps) => {
  return (
    <Heading
      as="h2"
      marginY="1em"
      mt="-24"
      pt="28"
      fontWeight="bold"
      size="lg"
      id={id}
      _hover={{
        a: {
          opacity: '1',
        },
      }}
      {...delegated}
    >
      {children}
      {id ? (
        <Text
          as="a"
          paddingLeft="0.2em"
          href={'#' + id}
          transition="opacity 0.3s"
          opacity="0"
          _hover={{ opacity: '1', textDecoration: 'underline' }}
          title="Direct link to heading"
        >
          #
        </Text>
      ) : null}
    </Heading>
  );
};

const h3 = ({ children, id, ...delegated }: HeadingProps) => {
  return (
    <Heading
      as="h3"
      marginY="1em"
      mt="-24"
      pt="28"
      size="md"
      fontWeight="bold"
      id={id}
      _hover={{
        a: {
          opacity: '1',
        },
      }}
      {...delegated}
    >
      {children}
      {id ? (
        <Text
          as="a"
          paddingLeft="0.2em"
          href={'#' + id}
          transition="opacity 0.3s"
          opacity="0"
          _hover={{ opacity: '1', textDecoration: 'underline' }}
          title="Direct link to heading"
        >
          #
        </Text>
      ) : null}
    </Heading>
  );
};

const h4 = ({ children, id, ...delegated }: HeadingProps) => {
  return (
    <Heading
      as="h4"
      marginY="1em"
      mt="-24"
      pt="28"
      size="md"
      fontWeight="bold"
      id={id}
      _hover={{
        a: {
          opacity: '1',
        },
      }}
      {...delegated}
    >
      {children}
      {id ? (
        <Text
          as="a"
          paddingLeft="0.2em"
          href={'#' + id}
          transition="opacity 0.3s"
          opacity="0"
          _hover={{ opacity: '1', textDecoration: 'underline' }}
          title="Direct link to heading"
        >
          #
        </Text>
      ) : null}
    </Heading>
  );
};

const h5 = ({ children, id, ...delegated }: HeadingProps) => {
  return (
    <Heading
      as="h5"
      marginY="1em"
      mt="-24"
      pt="28"
      size="md"
      fontWeight="bold"
      id={id}
      _hover={{
        a: {
          opacity: '1',
        },
      }}
      {...delegated}
    >
      {children}
      {id ? (
        <Text
          as="a"
          paddingLeft="0.2em"
          href={'#' + id}
          transition="opacity 0.3s"
          opacity="0"
          _hover={{ opacity: '1', textDecoration: 'underline' }}
          title="Direct link to heading"
        >
          #
        </Text>
      ) : null}
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
  h4,
  h5,
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
  Link,
  ButtonLink,
  Button,
  Translated,
  Stack,
  inlineCode: (props: CodeProps) => <Code colorScheme="yellow" fontSize="0.84em" {...props} />,
};

// Workaround to this issue with TypeScript: https://github.com/microsoft/TypeScript/issues/42873
export type {} from '@chakra-ui/system';
export type {} from '@chakra-ui/layout';

export function ExtendComponents<TComponents extends Record<string, ComponentType<any>>>(
  extension: Partial<Record<keyof typeof components, ComponentType<any>>> & Partial<TComponents>
) {
  Object.assign(components, extension);
}
