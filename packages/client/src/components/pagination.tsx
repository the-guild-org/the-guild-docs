import NextLink from 'next/link.js';
import React, { CSSProperties, ReactElement } from 'react';

type PaginationProps = {
  previous?: { path: string; title: string };
  next?: { path: string; title: string };
};

const ChevronRightIcon = ({ size = 24, style }: { size?: number; style?: CSSProperties }): ReactElement => {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" style={style}>
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
  );
};

export const Pagination = ({ previous, next }: PaginationProps): ReactElement => {
  return (
    <nav style={{ display: 'flex', margin: '64px 0' }}>
      {previous && (
        <NextLink href={previous.path} passHref>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a rel="prev">
            <span style={{ fontSize: 14, padding: '0 8px 4px' }}>Previous</span>
            <span style={{ fontSize: 18, display: 'flex', alignItems: 'center', fontWeight: 700 }}>
              <ChevronRightIcon style={{ transform: 'rotate(-180deg)' }} />
              {previous.title}
            </span>
          </a>
        </NextLink>
      )}
      {next && (
        <NextLink href={next.path} passHref>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a rel="next" style={{ textAlign: 'right', marginLeft: 'auto' }}>
            <span style={{ fontSize: 14, padding: '0 8px 4px' }}>Next</span>
            <span style={{ fontSize: 18, display: 'flex', alignItems: 'center', fontWeight: 700 }}>
              {next.title}
              <ChevronRightIcon />
            </span>
          </a>
        </NextLink>
      )}
    </nav>
  );
};
