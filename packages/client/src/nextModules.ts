// This module is designed to make work the next modules with esModuleInterop turned on
// Weird bug, but this workaround seems to work fine

import Link from 'next/link';

import dynamic from 'next/dynamic';

export const NextLink: typeof Link =
  //@ts-expect-error
  Link.default || Link;

export const NextDynamic: typeof dynamic =
  //@ts-expect-error
  dynamic.default || dynamic;
