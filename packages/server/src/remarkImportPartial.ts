import { LazyPromise } from '@guild-docs/types';
import { promises } from 'fs';
import { resolve } from 'path';
import type { Pluggable } from 'unified';

const RGX = /{@import (.*?)}/;

export const remarkImportPartial: Pluggable = function () {
  const unified = this;

  return async function transformer(node, file) {
    const { visit } = await import('unist-util-visit');
    const embedNodes: Array<{
      rawMdPromise: Promise<string>;
      node: any;
      filePath: string;
    }> = [];

    visit(node, 'paragraph', node => {
      if (node.children && node.children[0] && node.children[0].type === 'text' && node.children[0].value) {
        const matches = node.children[0].value.match(RGX);

        if (matches && matches[1]) {
          const filePath = matches[1];
          const fileAbsPath = resolve(file.cwd, filePath);

          const rawMdPromise = LazyPromise(() => promises.readFile(fileAbsPath, 'utf-8'));

          embedNodes.push({
            rawMdPromise,
            node,
            filePath: fileAbsPath,
          });
        }
      }
    });

    if (embedNodes.length) {
      await Promise.all(
        embedNodes.map(async ({ node, rawMdPromise, filePath }) => {
          let rawMd: string;
          try {
            rawMd = await rawMdPromise;
          } catch (err) {
            throw Error(`Unable to locate @import file in path: ${filePath}!`);
          }

          const parsedMd = await unified.run(unified.parse(rawMd));

          node.position = parsedMd.position;
          node.type = 'element';
          node.tagName = 'div';
          node.children = parsedMd.children;
        })
      );
      visit(node, 'element', node => {
        if (node.tagName === 'pre' && node.value && node.value.startsWith('<pre class="shiki"')) {
          node.type = 'html';
        }
      });
    }
  };
};
