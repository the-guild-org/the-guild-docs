import { visit } from 'unist-util-visit';
// import { Literal, Parent, Node, Data } from 'unist'

const MERMAID_IMPORT_AST = {
  type: 'mdxjsEsm',
  value: 'import { Mermaid } from "mdx-mermaid/lib/Mermaid"',
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
            value: 'mdx-mermaid/lib/Mermaid',
            raw: `"mdx-mermaid/lib/Mermaid"`,
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
      name: 'config',
      value: {
        type: 'mdxJsxAttributeValueExpression',
        value: '{}',
        data: {
          estree: {
            type: 'Program',
            sourceType: 'module',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'ObjectExpression',
                  properties: [],
                },
              },
            ],
          },
        },
      },
    },
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

const remarkMermaid = () =>
  // @ts-ignore
  function transformer(ast, file, done) {
    const codeblocks: any[][] = [];
    visit(
      ast,
      {
        type: 'code',
        lang: 'mermaid',
      },
      (node, index, parent) => {
        codeblocks.push([node, index, parent]);
      }
    );

    if (codeblocks.length !== 0) {
      codeblocks.forEach(([node, index, parent]) => {
        parent.children.splice(index, 1, getMermaidElementAST(node.value));
      });
      ast.children.unshift(MERMAID_IMPORT_AST);
    }

    done();
  };

export { remarkMermaid };
