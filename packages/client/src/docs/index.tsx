import { chakra } from '@chakra-ui/react';

export const DocsContainer = chakra('section', {
  baseStyle: {
    display: 'flex',
    flexWrap: {
      base: 'wrap',
      lg: 'nowrap',
    },
    maxW: '1200px',
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
    position: {
      lg: 'sticky',
    },
    top: {
      lg: '7rem',
    },
    display: 'block',
    height: 'fit-content',
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

export const DocsDrawer = chakra('div', {
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

export const DocsTOC = chakra('aside', {
  baseStyle: {
    position: 'sticky',
    top: '7rem',
    justifySelf: 'start',
    height: 'fit-content',
    width: {
      base: '100%',
      lg: '15rem',
    },
  },
});

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
  },
});

export type {} from '@chakra-ui/system';
