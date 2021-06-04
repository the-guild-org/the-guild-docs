import RouterDefault from 'next/router';
import React, { useRef, useState } from 'react';

import { ChevronDownIcon } from '@chakra-ui/icons';
import { chakra, Collapse, CSSObject, Text, useDisclosure, useSafeLayoutEffect, useColorModeValue } from '@chakra-ui/react';

import { arePathnamesEqual, concatHrefs } from './routes';
import { getDefault } from './utils';

import type { MDXNavigationProps, Paths } from '@guild-docs/types';

const Details = chakra('div', {
  baseStyle: {},
});

const itemStyles: CSSObject = {
  py: '0.45rem',
  pl: '0.75rem',
  fontSize: '0.875rem',
  fontWeight: 'medium',
  textTransform: 'capitalize',
  cursor: 'pointer',
  userSelect: 'none',
  transition: '0.1s',
};

const Summary = chakra('div', {
  baseStyle: {
    ...itemStyles,
    display: 'flex',
    alignItems: 'center',
  },
});

const Link = chakra('a', {
  baseStyle: {
    display: 'block',
    ...itemStyles,
  },
});

const Router = getDefault(RouterDefault);

function Item({
  item: { href, name, sidebar, paths, isPage },
  acumHref,
  depth,
  accentColor,
  handleLinkClick,
  defaultOpenDepth = 2,
  ...styleProps
}: {
  item: Paths;
  acumHref: string;
  depth: number;
  accentColor: string;
  handleLinkClick: () => void;
} & Partial<MDXNavigationProps>) {
  const finalHref = concatHrefs(acumHref, href);

  const { isOpen, onToggle, onOpen } = useDisclosure({
    defaultIsOpen: depth < defaultOpenDepth,
  });

  const currentIsOpen = useRef(isOpen);
  currentIsOpen.current = isOpen;

  const pathsData = paths?.length ? paths : null;

  const isAnchor = isPage && !pathsData;

  const [isActive, setIsActive] = useState(false);

  const currentIsActive = useRef(isActive);
  currentIsActive.current = isActive;

  // This logic has to be client-side only
  useSafeLayoutEffect(() => {
    const initialIsActive = arePathnamesEqual(Router.asPath, finalHref);
    if (initialIsActive !== currentIsActive.current) setIsActive(initialIsActive);

    if (!currentIsOpen.current && Router.asPath.includes(finalHref)) {
      onOpen();
    }

    if (isAnchor) return;

    function routeChangeHandler() {
      const newIsActive = arePathnamesEqual(Router.asPath, finalHref);
      if (newIsActive !== currentIsActive.current) {
        setIsActive(newIsActive);
      }
    }

    Router.events.on('routeChangeComplete', routeChangeHandler);

    return () => {
      Router.events.off('routeChangeComplete', routeChangeHandler);
    };
  }, [finalHref, currentIsActive, isAnchor]);

  const label = sidebar || name || href.replace(/-/g, ' ');

  const propsArgs = {
    depth,
    finalHref,
    isActive,
    isAnchor,
    isOpen,
  };

  const innerItemStyles = {
    borderColor: useColorModeValue('gray.300', 'gray.600'),
    borderLeftWidth: `0.15rem`,
  };

  const hoverItemStyles = {
    _hover: {
      color: useColorModeValue('black', 'white'),
      backgroundColor: useColorModeValue('gray.100', 'gray.700'),
    },
  };

  return (
    <>
      {pathsData ? (
        <Details {...(depth !== 0 && innerItemStyles)} {...styleProps.detailsProps?.(propsArgs)}>
          <Summary
            onClick={onToggle}
            color={isOpen ? useColorModeValue('black', 'white') : useColorModeValue('gray.400', 'gray.500')}
            {...styleProps.summaryProps?.(propsArgs)}
            {...hoverItemStyles}
          >
            <ChevronDownIcon
              transition="transform 0.3s"
              transform={isOpen ? undefined : 'rotate(-90deg)'}
              {...styleProps.summaryIconProps?.(propsArgs)}
            />
            <Text as="span" {...styleProps.summaryLabelProps?.(propsArgs)}>
              {label}
            </Text>
          </Summary>

          <Collapse in={isOpen} unmountOnExit {...styleProps.collapseProps?.(propsArgs)}>
            <MDXNavigation
              paths={pathsData}
              acumHref={finalHref}
              depth={depth + 1}
              accentColor={accentColor}
              handleLinkClick={handleLinkClick}
              {...styleProps}
            />
          </Collapse>
        </Details>
      ) : (
        <Link
          onClick={ev => {
            ev.preventDefault();
            if (!isActive) {
              Router.push(finalHref);
              handleLinkClick();
            }
          }}
          onMouseOver={
            isActive
              ? undefined
              : () => {
                  Router.prefetch(finalHref);
                }
          }
          href={isAnchor ? finalHref : undefined}
          color={isActive ? accentColor : useColorModeValue('gray.400', 'gray.500')}
          {...(depth !== 0 && innerItemStyles)}
          {...styleProps.linkProps?.(propsArgs)}
          {...hoverItemStyles}
        >
          {label}
        </Link>
      )}
    </>
  );
}

export function MDXNavigation({
  paths,
  acumHref = '',
  depth = 0,
  accentColor = '#000',
  handleLinkClick,
  ...styleProps
}: MDXNavigationProps) {
  const Wrapper = chakra('nav', {
    baseStyle: {},
  });

  return (
    <Wrapper ml={depth !== 0 ? '1rem' : 0} {...styleProps.wrapperProps}>
      {paths.map((item, index) => {
        return (
          <Item
            key={index}
            item={item}
            acumHref={acumHref}
            depth={depth}
            accentColor={accentColor}
            handleLinkClick={handleLinkClick}
            {...styleProps}
          />
        );
      })}
    </Wrapper>
  );
}
