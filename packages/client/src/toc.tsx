import React, { useEffect, useState } from 'react';
import { observe } from 'react-intersection-observer';
import { useImmer } from 'use-immer';

import { Box, chakra, Text, useSafeLayoutEffect, useUpdateEffect } from '@chakra-ui/react';

import type { MDXTOCProps } from '@guild-docs/types';

const TocLink = chakra('a', {});

export function MDXTOC({ toc, boxProps = {}, textProps, anchorProps }: MDXTOCProps) {
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

  return (
    <Box width="fit-content" {...boxProps}>
      {toc.map(([id, depth, label]) => {
        const isActive = activeId === id;

        return (
          <TocLink
            key={id}
            href={'#' + id}
            color={isActive ? 'pink.500' : 'teal.500'}
            transition="color 0.4s"
            _hover={{
              color: isActive ? 'pink.300' : 'teal.300',
            }}
            children={
              <Text
                wordBreak="break-word"
                marginLeft={`${depth * 0.5}em`}
                children={label}
                {...(textProps ? textProps({ id, depth, isActive, label }) : null)}
              />
            }
            {...(anchorProps ? anchorProps({ id, depth, isActive, label }) : null)}
          />
        );
      })}
    </Box>
  );
}
