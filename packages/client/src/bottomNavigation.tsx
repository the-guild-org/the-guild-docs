import NextLinkImport from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useMemo, useState } from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { LinkBox, LinkOverlay, Stack, useSafeLayoutEffect } from '@chakra-ui/react';

import { arePathnamesEqual, concatHrefs, iterateRoutes, withoutTrailingSlash } from './routes.js';
import { getDefault } from './utils.js';

import type { BottomNavigationProps, Paths } from '@guild-docs/types';

const NextLink = getDefault(NextLinkImport);

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

export function BottomNavigationComponent({ routes, stackProps, linkBoxProps, linkOverlayProps }: BottomNavigationProps) {
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

  // This logic is client-side only
  useSafeLayoutEffect(() => {
    setCurrentRoute(routesData.find(v => arePathnamesEqual(v.current.href, asPath)));
  }, [asPath, routesData]);

  if (!currentRoute) return null;

  const previous = currentRoute.previous;
  const next = currentRoute.next;

  if (!previous && !next) return null;

  return (
    <Stack isInline {...stackProps}>
      {previous && (
        <LinkBox
          borderRadius="md"
          shadow="md"
          borderWidth="1px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding="10px"
          {...linkBoxProps}
        >
          <NextLink href={previous.href} passHref>
            <LinkOverlay
              children={
                <>
                  <ChevronLeftIcon />
                  {previous.name || previous.href}
                </>
              }
              {...linkOverlayProps?.({
                href: previous.href,
                name: previous.name,
              })}
            />
          </NextLink>
        </LinkBox>
      )}
      {next && (
        <LinkBox
          borderRadius="md"
          shadow="md"
          borderWidth="1px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding="10px"
          {...linkBoxProps}
        >
          <LinkOverlay
            href={next.href}
            onClick={ev => {
              ev.preventDefault();
              Router.push(next.href);
            }}
            onMouseOver={() => {
              Router.prefetch(next.href);
            }}
            children={
              <>
                {next.name || next.href}
                <ChevronRightIcon />
              </>
            }
            {...linkOverlayProps?.({
              href: next.href,
              name: next.name,
            })}
          />
        </LinkBox>
      )}
    </Stack>
  );
}
