import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root } from 'mdast';

const MERMAID_IMPORT_AST = {
  type: 'mdxjsEsm',
  value: 'import { Mermaid } from "guild-docs/mermaid"',
  data: {
    estree: {
      type: 'Program',
      sourceType: 'module',
      body: [
        {
          type: 'ImportDeclaration',
          specifiers: [
            {
              type: 'ImportSpecifier',
              imported: { type: 'Identifier', name: 'Mermaid' },
              local: { type: 'Identifier', name: 'Mermaid' },
            },
          ],
          source: {
            type: 'Literal',
            value: 'guild-docs/mermaid',
            raw: '"guild-docs/mermaid"',
          },
        },
      ],
    },
  },
};

const getMermaidElementAST = (value: string) => ({
  type: 'mdxJsxFlowElement',
  name: 'Mermaid',
  children: [],
  attributes: [
    {
      type: 'mdxJsxAttribute',
      name: 'chart',
      value: {
        type: 'mdxJsxAttributeValueExpression',
        value: `\`${value}\``,
        data: {
          estree: {
            type: 'Program',
            sourceType: 'module',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'TemplateLiteral',
                  expressions: [],
                  quasis: [
                    {
                      type: 'TemplateElement',
                      value: {
                        raw: value,
                        cooked: value,
                      },
                      tail: true,
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    },
  ],
});

export const remarkMermaid: Plugin<[], Root> = () => (ast, file, done) => {
  const codeblocks: any[][] = [];
  visit(
    ast,
    { type: 'code', lang: 'mermaid' },
    (node, index, parent) => {
      codeblocks.push([node, index, parent]);
    },
  );

  if (codeblocks.length !== 0) {
    codeblocks.forEach(([node, index, parent]) => {
      parent.children.splice(index, 1, getMermaidElementAST(node.value));
    });
    ast.children.unshift(MERMAID_IMPORT_AST as any);
  }

  done();
};
