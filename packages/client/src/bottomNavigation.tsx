import { useRouter } from 'next/router.js';
import React, { FC, useMemo, useState } from 'react';
import { useSafeLayoutEffect } from '@chakra-ui/react';
import { arePathnamesEqual, concatHrefs, iterateRoutes, withoutTrailingSlash } from './routes';
import { cleanMarkdown } from './utils';
import type { BottomNavigationProps, Paths } from '@guild-docs/types';
import { Pagination } from './components/pagination';

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
    const href = withoutTrailingSlash(concatHrefs(acumHref, value.href));

    const existingPage = allHrefs.find(v => v.href === href);
    if (existingPage) {
      if (!existingPage.name && value.name) {
        existingPage.name = value.name;
      }
    } else {
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

    return allHrefs.map((current, index): CombinedReducedHref => ({
      previous: allHrefs[index - 1],
      current,
      next: allHrefs[index + 1],
    }));
  }, [routes]);

  const [currentRoute, setCurrentRoute] = useState<CombinedReducedHref | undefined>();

  // This logic is client-side only
  useSafeLayoutEffect(() => {
    const activeRouting = routesData.find(v => arePathnamesEqual(v.current.href, asPath));

    setCurrentRoute(activeRouting);
  }, [asPath, routesData]);

  if (!currentRoute) return null;

  const { previous, next, current } = currentRoute;
  if ((!previous && !next) || !current) return null;

  return (
    <Pagination
      previous={
        previous && {
          path: previous.href,
          title: cleanMarkdown(previous.name ?? ''),
        }
      }
      next={
        next && {
          path: next.href,
          title: cleanMarkdown(next.name ?? ''),
        }
      }
    />
  );
}
