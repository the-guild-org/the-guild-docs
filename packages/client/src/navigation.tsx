import { useRouter } from 'next/router';
import React from 'react';

import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, ButtonProps, Collapse, Stack, StackProps, useDisclosure } from '@chakra-ui/react';

import { arePathnamesEqual } from './routes.js';

import type { Paths } from '@guild-docs/types';

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
