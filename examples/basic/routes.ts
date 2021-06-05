import { IRoutes, GenerateRoutes } from '@guild-docs/server';

export function getRoutes(): IRoutes {
  const Routes: IRoutes = {
    _: {
      index: {
        $name: 'Home',
        $routes: [['index', 'Home Page']],
      },
      docs: {
        $name: 'Docs',
        $routes: ['secondary', 'README'],
      },
    },
  };
  GenerateRoutes({
    Routes,
    folderPattern: 'docs',
    basePath: 'docs',
    basePathLabel: 'Documentation',
  });

  return Routes;
}
