/* eslint-disable no-else-return */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { isArray, isString, each, reduce, sortBy } from 'lodash';
import { readFileSync, writeFileSync } from 'node:fs';
import GithubSlugger from 'github-slugger';
import markdownToTxt from 'markdown-to-txt';
import algoliasearch from 'algoliasearch';
import type { IRoutes } from '@guild-docs/server';
import { join } from 'node:path';
import type { AlgoliaRecord, AlgoliaSearchItemTOC, AlgoliaRecordSource } from './types';

const extractToC = (content: string) => {
  const slugger = new GithubSlugger();

  const lines = content.split('\n');

  let isCodeBlock = false;
  let currentDepth = 0;
  let currentParent: AlgoliaSearchItemTOC | undefined;

  const slugs = reduce<string, AlgoliaSearchItemTOC[]>(
    lines,
    (acum, value) => {
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

      const result = value.match(/(##+ )(.+)/);

      if (!result) return acum;

      const depth = result[1]?.length - 3;

      if (depth > 1) {
        return acum;
      }

      const heading = result[2]?.trim();

      const record: AlgoliaSearchItemTOC = {
        children: [],
        title: heading,
        anchor: slugger.slug(heading),
      };

      if (depth > 0) {
        currentParent?.children.push(record);
        if (depth > currentDepth) {
          currentParent = record;
        }
      } else {
        currentParent = record;
        acum.push(record);
      }

      currentDepth = depth;

      return acum;
    },
    []
  );
  return slugs;
};

const contentForRecord = (content: string) => {
  let isCodeBlock = false;
  let isMeta = false;
  return markdownToTxt(
    content
      .split('\n')
      .map(line => {
        if (line.match(/^```(.*)/)) {
          if (isCodeBlock) {
            isCodeBlock = false;
            return null;
          } else {
            isCodeBlock = true;
            return null;
          }
        } else if (isCodeBlock) {
          return null;
        }
        if (line.startsWith('---')) {
          if (isMeta) {
            isMeta = false;
            return null;
          } else {
            isMeta = true;
            return null;
          }
        } else if (isMeta) {
          return null;
        }
        if (line.startsWith('#')) {
          return null;
        }
        return line;
      })
      .filter(line => line !== null)
      .join(' ')
  ).replaceAll(/(<([^>]+)>)/gi, '');
};

function routesToAlgoliaObjects(
  routes: IRoutes,
  type: 'documentation' | 'tutorial' = 'documentation',
  source: AlgoliaRecordSource,
  objectsPrefix = new GithubSlugger().slug(source)
) {
  const objects: AlgoliaRecord[] = [];

  function routeToAlgoliaObjects(topPath?: string, parentLevelName?: string, slug?: string, title?: string) {
    if (!slug || !title) {
      return;
    }

    const fileContent = readFileSync(topPath ? `./${topPath}/${slug}.mdx` : `./${slug}.mdx`).toString();

    const toc = extractToC(fileContent);

    const domain = `${process.env.SITE_URL || 'https://the-guild.dev/'}`;

    objects.push({
      objectID: `${objectsPrefix}-${slug}`,
      headings: toc.map(t => t.title),
      toc,
      content: contentForRecord(fileContent),
      url: `${domain}/${topPath ? `${topPath}/${slug}` : `${slug}`}`,
      domain,
      hierarchy: parentLevelName ? [source, parentLevelName, title] : [source, title],
      source,
      title,
      type,
    });
  }

  each(routes._, (topRoute, topPath) => {
    if (!topRoute) {
      return;
    }
    if (isString(topRoute)) {
      console.warn(`ignored ${topRoute}`);
      return;
    } else if (isArray(topRoute)) {
      console.warn(`ignored ${topRoute}`);
      return;
    } else {
      if (topRoute.$name && !topRoute.$routes) {
        routeToAlgoliaObjects(undefined, undefined, topPath, topRoute.$name);
      } else {
        each(topRoute.$routes, ([slug, title]) => {
          routeToAlgoliaObjects(topPath, topRoute.$name!, slug, title);
        });
      }
    }
  });

  return objects;
}

export type { AlgoliaRecord, AlgoliaSearchItemTOC, AlgoliaRecordSource };

export const indexToAlgolia = (
  routesArr: IRoutes[],
  source: AlgoliaRecordSource,
  dryMode = true,
  lockfilePath = join(__dirname, '..', 'algolia-lockfile.txt')
) => {
  if (!process.env.SITE_URL) {
    console.warn('Caution: `process.env.SITE_URL` is missing');
  }

  const objects = routesArr.map(routes => routesToAlgoliaObjects(routes, 'documentation', source));

  const recordsAsString = JSON.stringify(sortBy(objects, 'objectID'), (key, value) => (key === 'content' ? '-' : value), 2);

  const lockfileContent = readFileSync(lockfilePath, 'utf-8');

  if (dryMode) {
    writeFileSync(lockfilePath, recordsAsString);
  } else {
    if (recordsAsString !== lockfileContent) {
      if (!['ALGOLIA_APP_ID', 'ALGOLIA_ADMIN_API_KEY', 'ALGOLIA_INDEX_NAME'].some(envVar => !process.env[envVar])) {
        console.error('Some Algolia environment variables are missing!');
        return;
      }
      console.log('changed detected, updating Algolia index!');

      const client = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_ADMIN_API_KEY!);
      const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME!);
      index
        .deleteBy({
          filters: `source: "${source}"`,
        })
        .then(() => {
          index.saveObjects(objects).then(({ objectIDs }) => {
            console.log(objectIDs);
          });
        });
      writeFileSync(lockfilePath, recordsAsString);
    }
  }
};
