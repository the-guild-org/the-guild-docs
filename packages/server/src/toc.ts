import githubSlugger from 'github-slugger';

import type { TOC } from '@guild-docs/types';

export function SerializeTOC(content: string): TOC {
  const slugger = new githubSlugger();

  const lines = content.split('\n');

  let isCodeBlock = false;

  const slugs = lines.reduce((acum, value) => {
    if (value.match(/^```(.*)/)) {
      if (isCodeBlock) {
        isCodeBlock = false;
      } else {
        isCodeBlock = true;
        return acum;
      }
    } else if (isCodeBlock) {
      return acum;
    }

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
