import React, { useMemo } from 'react';
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

  const firstVisible = useMemo(() => {
    for (const [id] of toc) {
      if (visibilityState[id]) return id;
    }
    return null;
  }, [toc, visibilityState]);

  useSafeLayoutEffect(() => {
    const cleanup: (() => void)[] = [];

    for (const [id] of toc) {
      const element = document.getElementById(id);
      if (!element) continue;

      cleanup.push(
        observe(element, isVisible => {
          produceVisibilityState(draft => {
            draft[id] = isVisible;
          });
        })
      );
    }

    return () => {
      for (const cb of cleanup) cb();
    };
  }, []);

  return (
    <Box width="fit-content" {...boxProps}>
      {toc.map(([id, depth, label]) => {
        const isActive = visibilityState[id] && firstVisible === id;
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
