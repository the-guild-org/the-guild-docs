import NextLinkImport from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useMemo, useState } from 'react';

import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { useSafeLayoutEffect, chakra } from '@chakra-ui/react';

import { arePathnamesEqual, concatHrefs, iterateRoutes, withoutTrailingSlash } from './routes.js';
import { getDefault } from './utils.js';

import type { BottomNavigationProps, Paths } from '@guild-docs/types';

const NextLink = getDefault(NextLinkImport);

const Wrapper = chakra('div', {
  baseStyle: {
    display: 'flex',
    alignItems: 'center',
    pt: '1rem',
    fontFamily: 'Poppins',
  },
});

const Title = chakra('p', {
  baseStyle: {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',

    flex: '1 1 0%',
    justifyContent: 'center',
    alignItems: 'center',
    px: '0.5rem',
    fontWeight: 'medium',
    fontSize: '0.75rem',
    textAlign: 'center',
    color: '#6b7280',
  },
});

const Link = chakra('a', {
  baseStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '2rem',
    width: '2rem',
    borderRadius: '0.5rem',
    backgroundColor: '#F3F4F6',
    cursor: 'pointer',
    transition: '0.15s',
    _hover: {
      backgroundColor: '#000',
      color: '#FFF',
    },
  },
});

export interface ReducedHref {
  href: string;
  name?: string;
}

export interface CombinedReducedHref {
  previous?: ReducedHref;
  current: ReducedHref;
  next: ReducedHref;
}

function iterateReduce(
  acum: {
    acumHref: string;
    allHrefs: Array<ReducedHref>;
  },
  value: Paths
): typeof acum {
  const acumHref = acum.acumHref;

  const allHrefs = acum.allHrefs;

  if (value.isPage) {
    let href = withoutTrailingSlash(concatHrefs(acumHref, value.href));

    if (!allHrefs.find(v => v.href === href)) {
      allHrefs.push({
        href,
        name: value.name,
      });
    }
  }
  if (value.paths) {
    value.paths.reduce(iterateReduce, {
      acumHref: concatHrefs(acumHref, value.href),
      allHrefs,
    } as typeof acum);
  }

  return {
    acumHref,
    allHrefs,
  };
}

export const ClientSideOnly: FC = ({ children }) => {
  const [show, setShow] = useState(false);
  useSafeLayoutEffect(() => {
    setShow(true);
  }, []);
  if (show) return <>{children}</>;
  return null;
};

export function BottomNavigationComponent({ routes }: BottomNavigationProps) {
  const Router = useRouter() || {};

  const asPath = Router.asPath || '_';

  const routesData = useMemo(() => {
    const iterated = iterateRoutes(routes);
    const { allHrefs } = iterated.reduce(iterateReduce, {
      acumHref: '',
      allHrefs: [],
    });

    return allHrefs.map((current, index): CombinedReducedHref => {
      return {
        previous: allHrefs[index - 1],
        current,
        next: allHrefs[index + 1],
      };
    });
  }, [routes]);

  const [currentRoute, setCurrentRoute] = useState<CombinedReducedHref | undefined>();
  const [currentTitle, setCurrentTitle] = useState<string>('');

  // This logic is client-side only
  useSafeLayoutEffect(() => {
    const activeRouting = routesData.find(v => arePathnamesEqual(v.current.href, asPath));

    setCurrentRoute(activeRouting);
    setCurrentTitle(activeRouting?.current.name || '');
  }, [asPath, routesData]);

  if (!currentRoute) return null;

  const { previous, next, current } = currentRoute;
  if ((!previous && !next) || !current) return null;

  return (
    <Wrapper>
      {previous && (
        <NextLink href={previous.href} passHref>
          <Link
            onMouseOver={() => setCurrentTitle(previous.name || 'Previous')}
            onMouseOut={() => setCurrentTitle(current.name || '')}
          >
            <ArrowBackIcon />
          </Link>
        </NextLink>
      )}

      <Title>{currentTitle}</Title>
      {next && (
        <NextLink href={next.href} passHref>
          <Link onMouseOver={() => setCurrentTitle(next.name || 'Next')} onMouseOut={() => setCurrentTitle(current.name || '')}>
            <ArrowForwardIcon />
          </Link>
        </NextLink>
      )}
    </Wrapper>
  );
}
