# the-guild-docs

Low level documentation websites using [Next.js](https://nextjs.org/)

## guild-docs package

To initialize a guild-docs package, you can use **npx**:

```bash
npx guild-docs init
```

```
$ npx guild-docs init

Configuration files added!
Dependencies added!


Now you can install dependencies: "pnpm i", "yarn" or "npm i"; and then run the ___"dev"___ script, either "pnpm dev", "yarn dev" or "npm run dev"
```

🎉 Now you can install dependencies and run the "dev" script, and you are set to go!

## How it works

### MDX

By default the **_"init"_** command creates a "docs" folder, where you can use [MDX](https://mdxjs.com/) and create any file or folder structure.

#### Imports/Exports

The MDX implementation we use has a single inconvenience/tradeoff, which is that it's **NOT** possible to use imports inside the MDX files. [Here you can read](https://github.com/hashicorp/next-mdx-remote#import--export) a short description of the reason why this happens.

But you can define _Custom Components_ to be used inside the MDX in the **app.tsx** file, using the included helper "ExtendComponents" function:

> Already added in the default `_app.tsx` file

> You can also use [`next/dynamic`](https://nextjs.org/docs/advanced-features/dynamic-import) to lazy load components:
>
> import dynamic from 'next/dynamic';
>
> const SomeHeavyComponent = dynamic(() => import('./SomeHeavyComponent'));

```ts
import { ExtendComponents } from '@guild-docs/client';

// ...
ExtendComponents({
  HelloWorld() {
    return <p>Hello World!</p>;
  },
});
// ...
```

And then use them in your files:

```MD
# Hello World

<HelloWorld />

```

### Routes / Navigation

By default, in initialization, a `routes.ts` file is created as it follows:

> `IRoutes` is a recursive object type designed to make and customize the routes, with a special `GenerateRoutes` helper function that reads from a folder pattern(s) ([using minimatch patterns](https://globster.xyz/)) with [globby](https://github.com/sindresorhus/globby).

```ts
import { IRoutes, GenerateRoutes } from '@guild-docs/server';

export function getRoutes(): IRoutes {
  const Routes: IRoutes = {
    _: {
      index: {
        $name: 'Home',
        $routes: [['index', 'Home Page']],
      },
    },
  };
  GenerateRoutes({
    Routes,
    folderPattern: 'docs',
    basePath: 'docs',
    basePathLabel: 'Documentation',
    labels: {
      index: 'Docs',
    },
  });

  return Routes;
}
```

In this example, the base routes has a route that goes to the **"/"** path, with the label **"Home Page"**.

#### GenerateRoutes

And the `GenerateRoutes` function is used to get all the "docs" folder, using a basePath "/docs" with a label **"Documentation"** in the navigation, and the labels that are useful for setting the expected labels in every step, where you can use the syntax `foo.bar.baz` to set the labels in deep paths.

## Contributing

This project is using [pnpm workspaces](https://pnpm.io/workspaces)

Make sure to install pnpm: [https://pnpm.io/installation](https://pnpm.io/installation)

And simply install the dependencies:

```bash
pnpm i
```

- The examples are in [examples/\*](/examples/)
- The packages are [packages/\*](/packages/)
