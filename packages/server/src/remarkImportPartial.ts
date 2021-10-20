import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import type { Pluggable } from 'unified';
const RGX = /{@import (.*?)}/;

export const remarkImportPartial: Pluggable = function () {
  const unified = this;

  return async function transformer(node, file) {
    const { visit } = await import('unist-util-visit');
    visit(node, 'paragraph', node => {
      if (node.children && node.children[0] && node.children[0].type === 'text') {
        const matches = (node.children[0].value || '').match(RGX);

        if (matches && matches[1]) {
          const filePath = matches[1];
          const fileAbsPath = resolve(file.cwd, filePath);

          if (existsSync(fileAbsPath)) {
            const rawMd = readFileSync(fileAbsPath, 'utf-8');
            const parsedMd = unified.parse(rawMd);

            if (!parsedMd.children) throw Error('Invalid markdown in path:' + fileAbsPath);

            node.children = parsedMd.children;
          } else {
            throw Error(`Unable to locate @import file in path: ${fileAbsPath}!`);
          }
        }
      }
    });
  };
};
