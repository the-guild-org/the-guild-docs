import type { FC } from 'react';
import React from 'react';
import StickyBox from 'react-sticky-box';
import { chakra } from '@chakra-ui/react';

export const DocsContainer = chakra('section', {
  baseStyle: {
    display: 'flex',
    flexWrap: {
      base: 'wrap',
      lg: 'nowrap',
    },
    maxW: '1600px',
    justifyContent: 'center',
    width: '100%',
    mx: 'auto',
    px: '1.5rem',
    py: {
      base: '1.5rem',
      lg: '3rem',
    },
  },
});

export const DocsNavigation = chakra('aside', {
  baseStyle: {
    width: {
      base: '100%',
      lg: '16rem',
    },
    marginTop: {
      base: '1.35rem',
      lg: '0',
    },
  },
});

export const DocsNavigationDesktop = chakra('div', {
  baseStyle: {
    display: {
      base: 'none',
      lg: 'block',
    },
  },
});

export const DocsNavigationMobile = chakra('div', {
  baseStyle: {
    display: {
      base: 'block',
      lg: 'none',
    },
  },
});

export const DocsTitle = chakra('h2', {
  baseStyle: {
    mb: {
      base: '1.25rem',
      lg: '0.5rem',
    },
    fontWeight: 'bold',
    fontSize: '1.125rem',
  },
});

const TOC = chakra('aside', {
  baseStyle: {
    width: {
      base: '100%',
      lg: '15rem',
    },
  },
});

export const DocsTOC: FC = props => {
  return (
    <div>
      <StickyBox offsetTop={100} offsetBottom={20}>
        <TOC {...props} />
      </StickyBox>
    </div>
  );
};

export const DocsContent = chakra('article', {
  baseStyle: {
    display: 'block',
    mt: {
      lg: '-1rem',
    },
    px: {
      lg: '1.75rem',
    },
    flex: {
      lg: '1 1 0%',
    },
    wordBreak: 'break-word',
    maxW: '80ch',
  },
});

export type {} from '@chakra-ui/system';
