#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) =>
  key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : (obj[key] = value);
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __markAsModule = target => __defProp(target, '__esModule', { value: true });
var __reExport = (target, module2, desc) => {
  if ((module2 && typeof module2 === 'object') || typeof module2 === 'function') {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== 'default')
        __defProp(target, key, {
          get: () => module2[key],
          enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable,
        });
  }
  return target;
};
var __toModule = module2 => {
  return __reExport(
    __markAsModule(
      __defProp(
        module2 != null ? __create(__getProtoOf(module2)) : {},
        'default',
        module2 && module2.__esModule && 'default' in module2
          ? { get: () => module2.default, enumerable: true }
          : { value: module2, enumerable: true }
      )
    ),
    module2
  );
};

// src/index.ts
var import_commander = __toModule(require('commander'));
var import_path3 = __toModule(require('path'));

// src/cliConfig.ts
var import_path = __toModule(require('path'));
var config = __spreadValues({}, getPaths());
function getPaths(cwd = process.cwd()) {
  return {
    cwd,
    packageJsonPath: (0, import_path.resolve)(cwd, './package.json'),
  };
}
function setConfig(conf) {
  Object.assign(config, conf);
}

// src/editPackageJson.ts
var import_edit_json_file = __toModule(require('edit-json-file'));
var import_npm_api = __toModule(require('npm-api'));
var api = new import_npm_api.default();
var jsonConfigs = {};
function addPackageScripts(scripts) {
  var _a;
  const json =
    jsonConfigs[(_a = config.packageJsonPath)] || (jsonConfigs[_a] = (0, import_edit_json_file.default)(config.packageJsonPath));
  Object.entries(scripts).forEach(([name, content]) => {
    if (json.get(`scripts.${name}`)) {
      return;
    }
    json.set(`scripts.${name}`, content);
  });
  json.save();
}
async function addDependency(dependency, { isDev } = {}) {
  const dependencies = Array.isArray(dependency) ? dependency : [dependency];
  await Promise.all(
    dependencies.map(async depName => {
      var _a;
      const json =
        jsonConfigs[(_a = config.packageJsonPath)] ||
        (jsonConfigs[_a] = (0, import_edit_json_file.default)(config.packageJsonPath));
      if (json.get(`dependencies.${depName}`) || json.get(`devDependencies.${depName}`)) {
        return;
      }
      const depRepo = api.repo(depName);
      const depPackageVersion =
        '^' +
        (
          await depRepo.version('latest').catch(err => {
            if (err.message === 'Not Found') throw Error(`Package "${depName}" could not be found!`);
            throw err;
          })
        ).version;
      json.set(`${isDev ? 'devDependencies' : 'dependencies'}.${depName}`, depPackageVersion);
    })
  ).finally(() => {
    Object.values(jsonConfigs).map(v => {
      const deps = v.get('dependencies');
      deps && v.set('dependencies', sortObject(deps));
      const devDeps = v.get('devDependencies');
      devDeps && v.set('devDependencies', sortObject(devDeps));
      v.save();
    });
  });
}
function sortObject(unordered) {
  return Object.keys(unordered)
    .sort()
    .reduce((obj, key) => {
      obj[key] = unordered[key];
      return obj;
    }, {});
}

// src/writeFormat.ts
var import_mkdirp = __toModule(require('mkdirp'));
var import_path2 = __toModule(require('path'));
var import_fs = __toModule(require('fs'));

// src/prettier.ts
var import_prettier = __toModule(require('prettier'));
async function formatPrettier(str, parser) {
  const prettierConfig = Object.assign({}, await (0, import_prettier.resolveConfig)(process.cwd()));
  return (0, import_prettier.format)(
    str,
    __spreadValues(
      {
        parser,
      },
      prettierConfig
    )
  );
}

// src/writeFormat.ts
var { writeFile } = import_fs.promises;
async function writeFileFormatIfNotExists(path, content, parser) {
  const writePath = (0, import_path2.resolve)(...path);
  if ((0, import_fs.existsSync)(writePath)) {
    console.log(`"${writePath}" already exists!`);
    return;
  }
  await (0, import_mkdirp.default)((0, import_path2.dirname)(writePath));
  await writeFile(writePath, await formatPrettier(content, parser));
}

// src/nextConfig.ts
async function writeNextConfig() {
  await writeFileFormatIfNotExists(
    [config.cwd, 'next.config.js'],
    `
  const { register } = require('esbuild-register/dist/node');

  register({
    extensions: ['.ts', '.tsx'],
  });
  
  const { i18n } = require('./next-i18next.config');
  
  const { withGuildDocs } = require('@guild-docs/server');
  
  const { getRoutes } = require('./routes.ts');
  
  module.exports = withGuildDocs({
    i18n,
    getRoutes,
  });      
`,
    'typescript'
  );
}
async function writei18Config() {
  await writeFileFormatIfNotExists(
    [config.cwd, 'next-i18next.config.js'],
    `
  module.exports = {
      i18n: {
        defaultLocale: "en",
        locales: ["en"],
      },
    };
  `,
    'typescript'
  );
}
async function writeRoutes() {
  await writeFileFormatIfNotExists(
    [config.cwd, 'routes.ts'],
    `
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

    `,
    'typescript'
  );
}
async function writeTranslations() {
  await writeFileFormatIfNotExists(
    [config.cwd, 'public/locales/en/common.json'],
    `
  {
    "greeting": "Hello!"
  }
  
  `,
    'json'
  );
}
async function writeApp() {
  await writeFileFormatIfNotExists(
    [config.cwd, 'src/pages/_app.tsx'],
    `
    import 'remark-admonitions/styles/classic.css';
    import 'remark-admonitions/styles/infima.css';
    import 'prism-themes/themes/prism-dracula.css';
    
    import { appWithTranslation } from 'next-i18next';
    import { ReactNode, useMemo } from 'react';
    import { MDXProvider } from '@mdx-js/react';
    
    import { Box, ChakraProvider, extendTheme, Stack } from '@chakra-ui/react';
    
    import { NextNProgress, MdxInternalProps, MDXNavigation, iterateRoutes, components, ExtendComponents } from '@guild-docs/client';
    
    import type { AppProps } from 'next/app';
    
    const theme = extendTheme({
      colors: {},
    });
    
    ExtendComponents({
      HelloWorld() {
        return <p>Hello World!</p>;
      },
    });
    
    export function AppThemeProvider({ children }: { children: ReactNode }) {
      return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
    }
    
    const serializedMdx = process.env.SERIALIZED_MDX_ROUTES;
    let mdxRoutesData = serializedMdx && JSON.parse(serializedMdx);
    
    function App({ Component, pageProps }: AppProps) {
      const mdxRoutes: MdxInternalProps['mdxRoutes'] | undefined = pageProps.mdxRoutes;
      const Navigation = useMemo(() => {
        const paths = mdxRoutes === 1 ? mdxRoutesData : (mdxRoutesData = mdxRoutes || mdxRoutesData);
    
        return <MDXNavigation paths={iterateRoutes(paths)} />;
      }, [mdxRoutes]);
      return (
        <>
          <NextNProgress />
          <MDXProvider components={components}>
            <AppThemeProvider>
              <Stack isInline>
                <Box maxW="280px" width="100%">
                  {Navigation}
                </Box>
                <Component {...pageProps} />
              </Stack>
            </AppThemeProvider>
          </MDXProvider>
        </>
      );
    }
    
    export default appWithTranslation(App);
        `,
    'typescript'
  );
}
async function writeDocPages() {
  const w1 = writeFileFormatIfNotExists(
    [config.cwd, 'src/pages/docs/[[...slug]].tsx'],
    `
  import { Stack } from '@chakra-ui/react';

  import { MDXPage } from '@guild-docs/client';
  import { MDXPaths, MDXProps } from '@guild-docs/server';

  import { getRoutes } from '../../../routes';

  import type { GetStaticPaths, GetStaticProps } from 'next';

  export default MDXPage(function PostPage({ content }) {
    return (
      <Stack>
        <main>{content}</main>
      </Stack>
    );
  });

  export const getStaticProps: GetStaticProps = ctx => {
    return MDXProps(
      ({ readMarkdownFile, getArrayParam }) => {
        return readMarkdownFile('docs/', getArrayParam('slug'));
      },
      ctx,
      {
        getRoutes,
      }
    );
  };

  export const getStaticPaths: GetStaticPaths = ctx => {
    return MDXPaths('docs', { ctx });
  };
  `,
    'typescript'
  );
  const w2 = writeFileFormatIfNotExists(
    [config.cwd, 'src/pages/index.tsx'],
    `
  export default function Index() {
    return <p>Welcome!</p>;
  }
  
  `,
    'typescript'
  );
  await Promise.all([w1, w2]);
}
async function writeDocsDirectory() {
  await writeFileFormatIfNotExists(
    [config.cwd, 'docs/index.mdx'],
    `
# Index Docs Page

<Translated>greeting</Translated> This is the Index of the Documentation Page!

<HelloWorld />

  `,
    'mdx'
  );
}
async function writeTSConfig() {
  await writeFileFormatIfNotExists(
    [config.cwd, 'tsconfig.json'],
    `
{
  "compilerOptions": {
    "target": "es2019",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "noEmit": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
      `,
    'json'
  );
}

// src/index.ts
import_commander.program
  .version(require((0, import_path3.resolve)(__dirname, '../package.json')).version)
  .description('Guild Docs CLI');
async function DepsAction(dir = process.cwd()) {
  setConfig(getPaths(dir));
  await Promise.all([
    addDependency([
      '@guild-docs/client',
      '@guild-docs/server',
      '@mdx-js/react',
      '@chakra-ui/react',
      '@chakra-ui/icons',
      '@emotion/react',
      '@emotion/styled',
      'framer-motion',
      'next',
      'remark-admonitions',
      'remark-prism',
      'prism-themes',
      'next-i18next',
      'react',
      'react-dom',
    ]),
    addDependency(
      [
        'esbuild',
        'esbuild-register',
        '@types/node',
        '@types/react',
        '@types/react-dom',
        '@types/mdx-js__react',
        'typescript',
        'concurrently',
        '@types/concurrently',
        'tsup',
        'open-cli',
        'wait-on',
      ],
      {
        isDev: true,
      }
    ),
    addPackageScripts({
      build: 'next build',
      dev: 'concurrently -r next "wait-on -s 1 http://localhost:3000 && open-cli http://localhost:3000"',
      next: 'next',
      start: 'next start',
    }),
  ]);
  console.log('Dependencies added!');
}
import_commander.program
  .command('deps [dir]')
  .description('Add deps to specified directory (default: process.cwd())')
  .action(DepsAction);
async function ConfigAction(dir = process.cwd()) {
  setConfig(getPaths(dir));
  await Promise.all([
    writeNextConfig(),
    writei18Config(),
    writeRoutes(),
    writeTranslations(),
    writeApp(),
    writeDocPages(),
    writeDocsDirectory(),
    writeTSConfig(),
  ]);
  console.log('Configuration files added!');
}
import_commander.program
  .command('config [dir]')
  .description('Create needed configurations files (default: process.cwd())')
  .action(ConfigAction);
async function InitAction(dir = process.cwd()) {
  setConfig(getPaths(dir));
  await Promise.all([DepsAction(dir), ConfigAction(dir)]);
  console.log(`

Now you can install dependencies: "pnpm i", "yarn" or "npm i"; and then run the "dev" script, either "pnpm dev", "yarn dev" or "npm run dev"`);
}
import_commander.program
  .command('init [dir]')
  .description("Initialize a docs package, adding it's dependencies & minimum configuration files")
  .action(InitAction);
import_commander.program
  .parseAsync(process.argv)
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
