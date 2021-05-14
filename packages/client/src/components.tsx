import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import React, { ReactNode } from 'react';

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
  Stack,
  Text,
  TextProps,
  useColorModeValue,
} from '@chakra-ui/react';

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

const a = (props: LinkProps) => <ChakraLink fontWeight="bold" color="blue.600" {...props} />;

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
  a,
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
