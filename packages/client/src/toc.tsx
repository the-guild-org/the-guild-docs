import React from 'react';

import { Box, chakra, Text } from '@chakra-ui/react';

import type { MDXTOCProps } from '@guild-docs/types';

const TocLink = chakra('a', {});

export function MDXTOC({ toc, boxProps = {}, textProps, anchorProps }: MDXTOCProps) {
  return (
    <Box width="fit-content" {...boxProps}>
      {toc.map(([depth, name]) => {
        return (
          <TocLink
            key={name}
            href={'#' + name}
            color="teal.500"
            _hover={{
              color: 'teal.300',
            }}
            children={
              <Text
                wordBreak="break-word"
                marginLeft={`${depth - 1}em`}
                children={name}
                {...(textProps ? textProps({ name, depth }) : null)}
              />
            }
            {...(anchorProps
              ? anchorProps({
                  name,
                  depth,
                })
              : null)}
          />
        );
      })}
    </Box>
  );
}
