declare module 'mdx-mermaid/Mermaid' {
  // fix Cannot find module 'mdx-mermaid/Mermaid' or its corresponding type declarations
  export const Mermaid: React.FC<{ chart: string; config?: { theme?: string } }>;
}
