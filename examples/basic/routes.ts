import { IRoutes, AddRoutes } from 'guild-docs/dist/server';

export function getRoutes(): IRoutes {
  const Routes: IRoutes = {
    _: {
      index: {
        $name: 'Home',
        $routes: ['index'],
      },
    },
    $routes: ['XDXD'],
  };
  AddRoutes({
    Routes,
    folderPattern: 'docs',
    basePath: 'docs',
  });

  return Routes;
}
