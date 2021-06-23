import React, { useEffect, useState } from 'react';
import { observe } from 'react-intersection-observer';
import { useImmer } from 'use-immer';

import { chakra, useSafeLayoutEffect, useUpdateEffect, useColorModeValue } from '@chakra-ui/react';

import type { MDXTOCProps } from '@guild-docs/types';

const Wrapper = chakra('div', {
  baseStyle: {
    display: {
      base: 'none',
      lg: 'block',
    },
    width: '100%',
    p: '1rem',
    borderRadius: '0.5rem',
  },
});

const Title = chakra('h2', {
  baseStyle: {
    textTransform: 'uppercase',
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
});

const Link = chakra('a', {
  baseStyle: {
    display: 'block',
    width: 'fit-content',
    my: '0.5rem',
    fontSize: '0.875rem',
    transition: '0.15s',
    _hover: {
      opacity: '100%',
    },
    _focus: {
      opacity: '100%',
    },
    _last: {
      mb: '0',
    },
  },
});

export function MDXTOC({ toc, wrapperProps, linkProps, titleProps }: MDXTOCProps) {
  const [visibilityState, produceVisibilityState] = useImmer(() => {
    return toc.reduce((acum, [id]) => {
      acum[id] = false;
      return acum;
    }, {} as Record<string, boolean>);
  });

  useUpdateEffect(() => {
    produceVisibilityState(() =>
      toc.reduce((acum, [id]) => {
        acum[id] = false;
        return acum;
      }, {} as Record<string, boolean>)
    );
  }, [toc]);

  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    // If any heading is visible, then use the first one
    for (const [id] of toc) if (visibilityState[id]) return setActiveId(id);

    // If no heading is visible, we fallback to use heading boundings
    for (const [index, [id]] of toc.entries()) {
      const tocHeadingTopOffset = document.getElementById(id)?.getBoundingClientRect().top;

      if (tocHeadingTopOffset == null) continue;

      const nextToc = toc[index + 1];

      const nextTocHeadingTopOffset =
        (nextToc ? document.getElementById(nextToc[0])?.getBoundingClientRect().top : null) ?? Infinity;

      if (tocHeadingTopOffset <= 0 && nextTocHeadingTopOffset >= 0) return setActiveId(id);
    }

    setActiveId(null);
  }, [toc, visibilityState]);

  useSafeLayoutEffect(() => {
    const cleanupObserve = toc.map(([id]) => {
      const element = document.getElementById(id);
      if (!element) return;

      return observe(element, isVisible => {
        produceVisibilityState(draft => {
          draft[id] = isVisible;
        });
      });
    });

    return () => {
      for (const cb of cleanupObserve) cb && cb();
    };
  }, [toc]);

  const tocWrapperBackgroundColor = useColorModeValue('gray.200', 'gray.800');

  return (
    <Wrapper backgroundColor={tocWrapperBackgroundColor} {...wrapperProps}>
      <Title {...titleProps}>Content</Title>
      {toc.map(([id, depth, label]) => {
        const isActive = activeId === id;
        return (
          <Link
            key={id}
            href={'#' + id}
            fontWeight={isActive ? 'semibold' : 'normal'}
            opacity={isActive ? '100%' : '60%'}
            marginLeft={`${depth}rem`}
            {...linkProps?.({
              id,
              depth,
              label,
              isActive,
            })}
          >
            {label}
          </Link>
        );
      })}
    </Wrapper>
  );
}
