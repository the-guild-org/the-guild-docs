// Copied from https://github.com/sjwall/mdx-mermaid/blob/main/src/mdxast-mermaid.ts
// import type mermaidAPI from 'mermaid/mermaidAPI';
import { visit, EXIT } from 'unist-util-visit';
import type { Literal, Parent, Node, Data } from 'unist';

// type Config = {
//   /**
//    * Theme to use.
//    *
//    * For available themes, see: https://github.com/mermaid-js/mermaid/blob/develop/src/themes/index.js.
//    *
//    * If set, this `theme` member overrides anything set by `mermaid.theme`.
//    */
//   theme?: {
//     /**
//      * Theme to use when HTML data theme is 'light'.
//      *
//      * Defaults to `DEFAULT_LIGHT_THEME`.
//      */
//     light: mermaidAPI.Theme;
//
//     /**
//      * Theme to use when HTML data theme is 'dark'.
//      *
//      * Defaults to `DEFAULT_DARK_THEME`.
//      */
//     dark: mermaidAPI.Theme;
//   };
//
//   /**
//    * Mermaid configuration.
//    */
//   mermaid?: mermaidAPI.Config;
// };

type CodeMermaid = Literal<string> & {
  type: 'code';
  lang: 'mermaid';
};

/**
 * Insert the component import into the document.
 * @param ast The document to insert into.
 */
function insertImport(ast: Parent<Node | Literal, Data>) {
  // See if there is already an import for the Mermaid component
  let importFound = false;
  // @ts-ignore
  visit(ast, { type: 'import' }, (node: Literal<string>) => {
    if (/\s*import\s*{\s*Mermaid\s*}\s*from\s*'mdx-mermaid(\/lib)?\/Mermaid'\s*;?\s*/.test(node.value)) {
      importFound = true;
      return EXIT;
    }
  });

  // Add the Mermaid component import to the top
  if (!importFound) {
    ast.children.splice(0, 0, {
      type: 'import',
      value: 'import { Mermaid } from \'mdx-mermaid/lib/Mermaid\';',
    });
  }
}

/**
 * mdx-mermaid plugin.
 *
 * @param config Config passed in from parser.
 * @returns Function to transform mdxast.
 */
// @ts-ignore
export const mdxMermaid = (config?: any) => function transformer(ast: Parent<Node | Literal, Data>, file, done) {
  // Find all the mermaid diagram code blocks. i.e. ```mermaid
  const instances: [Literal, number, Parent<Node | Literal, Data>][] = [];
  // @ts-ignore
  visit<CodeMermaid>(ast, {
    type: 'code',
    lang: 'mermaid',
  }, (node: Literal, index: number, parent: Parent<Node, Data>) => {
    instances.push([node, index, parent as Parent<Node, Data>]);
  });

  // Replace each Mermaid code block with the Mermaid component
  instances.forEach(([node, index, parent]) => {
    parent.children.splice(index, 1, {
      type: 'jsx',
      value: `<Mermaid chart={\`${node.value}\`}/>`,
      position: node.position,
    });
  });

  // Look for any components
  // @ts-ignore
  visit<Literal<string> & { type: 'jsx' }>(ast, { type: 'jsx' }, (node: { value: string; }) => {
    if (/.*<Mermaid.*/.test(node.value)) {
      // If the component doesn't have config
      if (!/.*config={.*/.test(node.value)) {
        const index = node.value.indexOf('<Mermaid') + 8;
        node.value = node.value.substring(0, index) + ` config={${JSON.stringify(config || {})}}` + node.value.substring(index);
      }
      insertImport(ast);
      return EXIT;
    }
  });
  done();
};
