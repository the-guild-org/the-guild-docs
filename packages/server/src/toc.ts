import githubSlugger from 'github-slugger';

import type { TOC } from '@guild-docs/types';

export function SerializeTOC(content: string) {
  const slugger = new githubSlugger();

  const lines = content.split('\n');

  const slugs = lines.reduce((acum, value) => {
    const result = value.match(/(\#+)( )(.+)/);
    if (!result) return acum;

    const depth = result[1]?.length;

    const heading = result[3]?.trim();

    if (!heading || !depth) return acum;

    acum.push([depth, slugger.slug(heading)]);

    return acum;
  }, [] as TOC);

  return slugs;
}
