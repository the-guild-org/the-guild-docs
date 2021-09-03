import type { Visitor } from 'unist-util-visit';

import type { Transformer } from 'unified';
import type { Highlighter } from 'shiki';

export interface Options {
  highlighter: Highlighter;
  /** @default true */
  ignoreUnknownLanguage?: boolean;
}

export async function withShiki(): Promise<(options: Options) => Transformer> {
  const { visit } = await import('unist-util-visit');

  return options => {
    const highlighter = options.highlighter;
    const loadedLanguages = highlighter.getLoadedLanguages();
    const ignoreUnknownLanguage = options.ignoreUnknownLanguage == null ? true : options.ignoreUnknownLanguage;

    const transformer: Transformer = async function transformer(tree) {
      const visitor: Visitor<any> = function visitor(node) {
        const lang = ignoreUnknownLanguage && !loadedLanguages.includes(node.lang) ? null : node.lang;

        const highlighted = highlighter.codeToHtml(node.value, lang);
        node.type = 'html';
        node.value = highlighted;
      };

      visit(tree, 'code', visitor);
    };

    return transformer;
  };
}
