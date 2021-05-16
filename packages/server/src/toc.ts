import githubSlugger from 'github-slugger';

import type { TOC } from '@guild-docs/types';

export function SerializeTOC(content: string) {
  const slugger = new githubSlugger();

  const lines = content.split('\n');

  const slugs = lines.reduce((acum, value) => {
    const result = value.match(/(\#\#+ )(.+)/);
    if (!result) return acum;

    const depth = result[1]?.length;

    const heading = result[2]?.trim();

    if (!heading || !depth) return acum;

    acum.push([slugger.slug(heading), depth - 3, heading]);

    return acum;
  }, [] as TOC);

  return slugs;
}
