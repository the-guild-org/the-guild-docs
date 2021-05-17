import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, ButtonProps, Collapse, Stack, StackProps, useDisclosure, useSafeLayoutEffect } from '@chakra-ui/react';

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

  const pathsData = paths?.length ? paths : null;

  const isAnchor = isPage && !pathsData;

  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: depth < 1,
  });

  const Router = useRouter();

  const [isActive, setIsActive] = useState(false);

  const asPath = Router?.asPath || '_';

  // This logic has to be client-side only
  useSafeLayoutEffect(() => {
    setIsActive(arePathnamesEqual(asPath, finalHref));
  }, [asPath, finalHref]);

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

                if (!isActive) {
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
          isAnchor && !isActive
            ? () => {
                Router.prefetch(finalHref);
              }
            : undefined
        }
        alignItems="center"
        marginY="2px"
        paddingX={`${depth + 1}em`}
        color={isActive && !pathsData ? 'blue.500' : undefined}
        transition="color 0.5s"
        {...buttonProps}
      >
        <span>{name || href}</span>
        {pathsData && (
          <ChevronDownIcon className="chevdown" transition="transform 0.3s" transform={isOpen ? 'rotate(180deg)' : undefined} />
        )}
      </Button>

      {pathsData ? (
        <Collapse in={isOpen} unmountOnExit>
          <MDXNavigation
            paths={pathsData}
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
