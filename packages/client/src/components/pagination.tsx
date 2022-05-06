import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Link, SimpleGrid, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import React, { ComponentProps } from 'react';

export const PaginationLink = (
  props: {
    label: string;
    href: string;
  } & ComponentProps<typeof Link>
) => {
  const { label, href, children, ...rest } = props;

  return (
    <NextLink href={href} passHref>
      <Link
        flex="1"
        borderRadius="md"
        _hover={{
          textDecor: 'none',
        }}
        {...rest}
      >
        <Text fontSize="sm" px="2">
          {label}
        </Text>
        <Text mt="1" fontSize="lg" fontWeight="bold">
          {children}
        </Text>
      </Link>
    </NextLink>
  );
};

export const Pagination = ({
  previous,
  next,
  ...rest
}: {
  previous: {
    path: string;
    title: string;
  } | null;
  next: {
    path: string;
    title: string;
  } | null;
}) => {
  return (
    <SimpleGrid as="nav" aria-label="Pagination" spacing="40px" my="64px" columns={2} {...rest}>
      {previous ? (
        <PaginationLink textAlign="left" label="Previous" href={previous.path} rel="prev">
          <ChevronLeftIcon mr="1" fontSize="1.2em" />
          {previous.title}
        </PaginationLink>
      ) : (
        <div />
      )}
      {next ? (
        <PaginationLink textAlign="right" label="Next" href={next.path} rel="next">
          {next.title}
          <ChevronRightIcon ml="1" fontSize="1.2em" />
        </PaginationLink>
      ) : (
        <div />
      )}
    </SimpleGrid>
  );
};
