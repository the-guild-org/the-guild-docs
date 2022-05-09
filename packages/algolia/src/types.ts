export type AlgoliaRecordSource =
  | 'Hive'
  | 'Yoga'
  | 'Envelop'
  | 'Inspector'
  | 'Code Generator'
  | 'Mesh'
  | 'Tools'
  | 'Modules'
  | 'ESLint'
  | 'Config'
  | 'Scalars'
  | 'Helix'
  | 'Shield'
  | 'Swift'
  | 'CLI'
  | 'SOFA'
  | 'Stencil'
  | 'Angular'
  | 'WhatsApp';

export interface AlgoliaRecord {
  objectID: string;
  hierarchy: string[];
  headings: string[];
  toc: AlgoliaSearchItemTOC[];
  title: string;
  content: string;
  source: string;
  type: string;
  url: string;
  domain: string;
}
export interface AlgoliaSearchItemTOC {
  children: AlgoliaSearchItemTOC[];
  title: string;
  anchor: string;
}
