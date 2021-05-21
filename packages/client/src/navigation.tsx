import RouterDefault from 'next/router';
import React, { useRef, useState } from 'react';

import { useSafeLayoutEffect, chakra } from '@chakra-ui/react';

import { arePathnamesEqual, concatHrefs } from './routes.js';
import { getDefault } from './utils.js';

import type { Paths } from '@guild-docs/types';

const Router = getDefault(RouterDefault);

const Wrapper = chakra('div', {
  baseStyle: {
    fontFamily: 'Poppins',
  },
});

const Details = chakra('details', {
  baseStyle: {},
});

const itemStyles = {
  py: '0.35rem',
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

const innerItemStyles = {
  borderLeft: '0.15rem solid #9ca3af',
};

const Summary = chakra('summary', {
  baseStyle: {
    ...itemStyles,
  },
});

const Link = chakra('a', {
  baseStyle: {
    display: 'block',
    ...itemStyles,
  },
});

function Item({ item: { href, name, paths, isPage }, acumHref, depth }: { item: Paths; acumHref: string; depth: number }) {
  const finalHref = concatHrefs(acumHref, href);

  const pathsData = paths?.length ? paths : null;

  const isAnchor = isPage && !pathsData;

  const [isActive, setIsActive] = useState(false);

  const currentIsActive = useRef(isActive);
  currentIsActive.current = isActive;

  // This logic has to be client-side only
  useSafeLayoutEffect(() => {
    const initialIsActive = arePathnamesEqual(Router.asPath || '_', finalHref);

    if (initialIsActive !== currentIsActive.current) setIsActive(initialIsActive);

    function routeChangeHandler() {
      const newIsActive = arePathnamesEqual(Router.asPath || '_', finalHref);

      if (newIsActive !== currentIsActive.current) setIsActive(newIsActive);
    }

    Router.events.on('routeChangeComplete', routeChangeHandler);

    return () => {
      Router.events.off('routeChangeComplete', routeChangeHandler);
    };
  }, [finalHref, currentIsActive]);

  const label = name || href.replace(/-/g, ' ');

  return (
    <>
      {!pathsData ? (
        <Link href={isAnchor ? finalHref : undefined} color={isActive ? '#000' : '#7F818C'} {...(depth !== 0 && innerItemStyles)}>
          {label}
        </Link>
      ) : (
        <Details {...(depth !== 0 && innerItemStyles)}>
          <Summary color={isActive ? '#000' : '#7F818C'}> {label} </Summary>
          <MDXNavigation paths={pathsData} acumHref={finalHref} depth={depth + 1} />
        </Details>
      )}
    </>
  );
}

export function MDXNavigation({ paths, acumHref = '', depth = 0 }: { paths: Paths[]; acumHref?: string; depth?: number }) {
  return (
    <Wrapper ml={depth !== 0 ? '1rem' : 0}>
      {paths.map((item, index) => {
        return <Item key={index} item={item} acumHref={acumHref} depth={depth} />;
      })}
    </Wrapper>
  );
}
