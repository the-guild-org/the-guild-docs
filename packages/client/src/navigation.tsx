import RouterDefault from 'next/router';
import React, { useRef, useState } from 'react';

import { ChevronDownIcon } from '@chakra-ui/icons';
import { BorderProps, chakra, Collapse, CSSObject, Text, useDisclosure, useSafeLayoutEffect } from '@chakra-ui/react';

import { arePathnamesEqual, concatHrefs } from './routes';
import { getDefault } from './utils';

import type { MDXNavigationProps, Paths } from '@guild-docs/types';

const Router = getDefault(RouterDefault);

const Wrapper = chakra('nav', {
  baseStyle: {},
});

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
  _hover: {
    color: '#000',
    backgroundColor: '#F3F4F6',
  },
};

const innerItemStyles: BorderProps = {
  borderLeft: '0.15rem solid #9ca3af',
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

function Item({
  item: { href, name, paths, isPage },
  acumHref,
  depth,
  accentColor,
  handleLinkClick,
  ...styleProps
}: {
  item: Paths;
  acumHref: string;
  depth: number;
  accentColor: string;
  handleLinkClick: () => void;
} & Partial<MDXNavigationProps>) {
  const finalHref = concatHrefs(acumHref, href);

  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: depth < 1,
  });

  const pathsData = paths?.length ? paths : null;

  const isAnchor = isPage && !pathsData;

  const [isActive, setIsActive] = useState(false);

  const currentIsActive = useRef(isActive);
  currentIsActive.current = isActive;

  // This logic has to be client-side only
  useSafeLayoutEffect(() => {
    const handleToggle = () => {
      const shouldToggle = !['/', '/docs', '/docs/'].includes(finalHref) && Router.asPath.includes(finalHref);
      shouldToggle && onToggle();
    };

    const initialIsActive = arePathnamesEqual(Router.asPath || '_', finalHref);
    if (initialIsActive !== currentIsActive.current) setIsActive(initialIsActive);

    handleToggle();

    function routeChangeHandler() {
      const newIsActive = arePathnamesEqual(Router.asPath || '_', finalHref);
      if (newIsActive !== currentIsActive.current) {
        setIsActive(newIsActive);
      }

      handleToggle();
    }

    Router.events.on('routeChangeComplete', routeChangeHandler);

    return () => {
      Router.events.off('routeChangeComplete', routeChangeHandler);
    };
  }, [finalHref, currentIsActive]);

  const label = name || href.replace(/-/g, ' ');

  const propsArgs = {
    depth,
    finalHref,
    isActive,
    isAnchor,
    isOpen,
  };

  return (
    <>
      {pathsData ? (
        <Details {...(depth !== 0 && innerItemStyles)} {...styleProps.detailsProps?.(propsArgs)}>
          <Summary onClick={onToggle} color={isOpen ? '#000' : '#7F818C'} {...styleProps.summaryProps?.(propsArgs)}>
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
          color={isActive ? accentColor : '#7F818C'}
          {...(depth !== 0 && innerItemStyles)}
          {...styleProps.linkProps?.(propsArgs)}
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
