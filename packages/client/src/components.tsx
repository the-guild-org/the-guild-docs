/* eslint-disable react-hooks/rules-of-hooks */
import { useTranslation } from 'next-i18next';
import ImageImport from 'next/image.js';
import NextLinkImport from 'next/link.js';
import React, { Children, ComponentType, ReactNode } from 'react';
import { onlyText } from 'react-children-utilities';
import { Mermaid } from 'mdx-mermaid/Mermaid';
import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  chakra,
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
  Tooltip,
  TooltipProps,
  UnorderedList,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';

import { PackageInstall, PackageRun } from './components/Package';
import { getDefault } from './utils';

import type { LinkProps as NextLinkProps } from 'next/link.js';

export { CopyToClipboard } from './components/CopyToClipboard';
export { PackageInstall, PackageRun };

export * from './components/npmBadge';

const Image = getDefault(ImageImport);
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

export const p = ({ children, ...delegated }: TextProps) => {
  return (
    <Text as="p" mt={4} lineHeight="tall" {...delegated}>
      {children}
    </Text>
  );
};

export const ul = ({ children, ...delegated }: ListProps) => {
  return (
    <UnorderedList as="ul" pt={2} pl={4} ml={2} {...delegated}>
      {children}
    </UnorderedList>
  );
};

export const ol = ({ children, ...delegated }: ListProps) => {
  return (
    <OrderedList as="ol" pt={2} pl={4} ml={2} {...delegated}>
      {children}
    </OrderedList>
  );
};

export const li = ({ children, ...delegated }: ListItemProps) => {
  return (
    <ListItem as="li" pb={1} {...delegated}>
      {children}
    </ListItem>
  );
};

export const blockquote = (props: BoxProps) => {
  const bgColor = useColorModeValue('blue.50', 'blue.900');

  return (
    <Box
      borderLeft="5px solid #559eff"
      mt={4}
      padding="0.8em"
      w="full"
      borderRadius="5px"
      bg={bgColor}
      variant="left-accent"
      status="info"
      css={{
        '> *:first-of-type': {
          marginTop: 0,
        },
      }}
      {...props}
    />
  );
};

export const hr = () => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return <Divider borderColor={borderColor} my={4} w="full" />;
};

export interface HeadingMarkdownProps extends HeadingProps {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size: NonNullable<HeadingProps['size']>;
}

export const HeadingMarkdown = ({
  children,
  id,
  as,
  size,
  directLinkProps,
  ...delegated
}: HeadingProps & {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size: NonNullable<HeadingProps['size']>;
  directLinkProps?: LinkProps;
}) => {
  return (
    <Heading
      as={as}
      size={size}
      my="0.5em"
      mt="-24"
      pt="28"
      id={id}
      _hover={
        id
          ? {
              'a.direct_link': {
                opacity: '1',
              },
            }
          : undefined
      }
      sx={
        id
          ? {
              'a.direct_link': {
                paddingLeft: '0.2em',
                transition: 'opacity 0.3s',
                opacity: '0',
              },
              'a.direct_link:hover': {
                opacity: '1',
                textDecoration: 'underline',
              },
            }
          : undefined
      }
      {...delegated}
    >
      {children}
      {id ? (
        <chakra.a className="direct_link" href={'#' + id} title="Direct link to heading" {...directLinkProps}>
          #
        </chakra.a>
      ) : null}
    </Heading>
  );
};

export const h1 = (props: HeadingProps) => {
  return <HeadingMarkdown {...props} as="h1" size="xl" />;
};

export const h2 = (props: HeadingProps) => {
  return <HeadingMarkdown {...props} as="h2" size="lg" />;
};

export const h3 = (props: HeadingProps) => {
  return <HeadingMarkdown {...props} as="h3" size="md" />;
};

export const h4 = (props: HeadingProps) => {
  return <HeadingMarkdown {...props} as="h4" size="md" />;
};

export const h5 = (props: HeadingProps) => {
  return <HeadingMarkdown {...props} as="h5" size="md" />;
};

export const h6 = (props: HeadingProps) => {
  return <HeadingMarkdown {...props} as="h6" size="md" />;
};

export const Link = ({ href, as, replace, scroll, shallow, passHref, prefetch, locale, ...props }: LinkProps & NextLinkProps) => {
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

export const ButtonLink = ({
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

export const table = (props: BoxProps) => <Box as="table" textAlign="left" mt="32px" width="full" {...props} />;

export const th = (props: BoxProps) => {
  const bg = useColorModeValue('gray.50', 'whiteAlpha.100');

  return <Box as="th" bg={bg} fontWeight="semibold" p={2} fontSize="sm" {...props} />;
};

export const td = (props: BoxProps) => (
  <Box as="td" p={2} borderTopWidth="1px" borderColor="inherit" fontSize="sm" whiteSpace="normal" {...props} />
);

export const originalComponents = {
  a(props: LinkProps) {
    return <ChakraLink color="accentColor" sx={{ '&:hover': { textDecoration: 'none' } }} {...props} />;
  },
  Image,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
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
  Graph: ({ children }: { children: ReactNode }) => {
    const { colorMode } = useColorMode();
    if (Children.toArray(children).length > 1) {
      console.error('BEWARE: the mermaid content should not contain any empty line!');
    }
    return <Mermaid chart={onlyText(children)} config={{ theme: colorMode }} />;
  },
  inlineCode: (props: CodeProps) => {
    const colorScheme = useColorModeValue('blackAlpha', undefined);

    return <Code display="inline" margin="1px" colorScheme={colorScheme} fontWeight="semibold" fontSize="0.875em" {...props} />;
  },
  Tooltip: (props: TooltipProps) => <Tooltip padding="1" textAlign="center" {...props} />,
  PackageInstall,
  PackageRun,
  pre: (props: CodeProps) => {
    const colorScheme = useColorModeValue('blackAlpha', undefined);

    return (
      <Code fontSize="0.9rem" colorScheme={colorScheme} padding="20px !important" width="100%" borderRadius="sm" {...props} />
    );
  },
};

export const components = {
  ...originalComponents,
};

// Workaround to this issue with TypeScript: https://github.com/microsoft/TypeScript/issues/42873
export type {} from '@chakra-ui/system';
export type {} from '@chakra-ui/layout';

export function ExtendComponents<TComponents extends Record<string, ComponentType<any>>>(
  extension: Partial<Record<keyof typeof components, ComponentType<any>>> & Partial<TComponents>
) {
  Object.assign(components, extension);
}
