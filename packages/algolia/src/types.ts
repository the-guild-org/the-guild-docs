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
  | 'WhatsApp'
  | 'KitQL';

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

export type IRoutes = {
  $routes?: ([href: string, name: string, sidebar?: string] | string)[];
  $name?: string;
  $sidebar?: string;
  _?: Record<string, IRoutes>;
};
