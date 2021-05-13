import { existsSync, promises } from 'fs';
import { resolve, dirname } from 'path';

import { config } from './cliConfig';
import { formatPrettier } from './prettier';
import mkdirp from 'mkdirp';

export const { writeFile } = promises;

export async function writeNextConfig() {
  const configPath = resolve(config.cwd, 'next.config.js');
  const configExists = existsSync(configPath);

  if (configExists) {
    console.log(`"${configPath}" already exists!`);
    return;
  }

  await writeFile(
    configPath,
    await formatPrettier(
      `
    const { register } = require("esbuild-register/dist/node");

    register({
        extensions: [".ts", ".tsx"],
    });

    const { i18n } = require("./next-i18next.config");

    const { withGuildDocs } = require("guild-docs/dist/server");

    const { getRoutes } = require("./routes.ts");

    module.exports = withGuildDocs({
        i18n,
        env: {
        SERIALIZED_MDX_ROUTES: JSON.stringify(getRoutes()),
        },
    })
  `,
      'typescript'
    )
  );
}

export async function writei18Config() {
  const configPath = resolve(config.cwd, 'next-i18next.config.js');
  const configExists = existsSync(configPath);

  if (configExists) {
    console.log(`"${configPath}" already exists!`);
    return;
  }

  await writeFile(
    configPath,
    await formatPrettier(
      `
    module.exports = {
        i18n: {
          defaultLocale: "en",
          locales: ["en"],
        },
      };
    `,
      'typescript'
    )
  );
}

export async function writeRoutes() {
  const configPath = resolve(config.cwd, 'routes.ts');
  const configExists = existsSync(configPath);

  if (configExists) {
    console.log(`"${configPath}" already exists!`);
    return;
  }

  await writeFile(
    configPath,
    await formatPrettier(
      `
    import { IRoutes, AddRoutes } from "guild-docs/dist/server";

    export function getRoutes(): IRoutes {
        const Routes = AddRoutes({
            // ...
        });

        AddRoutes({
            Routes,
            // ...
        })

        return Routes;
    }
    `,
      'typescript'
    )
  );
}

export async function writeTranslations() {
  const commonJSONPath = resolve(config.cwd, 'public/locales/en/common.json');

  await mkdirp(dirname(commonJSONPath));

  if (existsSync(commonJSONPath)) {
    console.log(`"${commonJSONPath}" already exists!`);
    return;
  }

  await writeFile(
    commonJSONPath,
    await formatPrettier(
      `
  {
    "greeting": "Hello!"
  }
  
  `,
      'json'
    )
  );
}

export async function writeApp() {
  const pagesAppPath = resolve(config.cwd, 'src/pages/_app.tsx');

  await mkdirp(dirname(pagesAppPath));

  if (existsSync(pagesAppPath)) {
    console.log(`"${pagesAppPath}" already exists!`);
    return;
  }

  await writeFile(
    pagesAppPath,
    await formatPrettier(
      `
import "remark-admonitions/styles/classic.css";
import "remark-admonitions/styles/infima.css";
import "prism-themes/themes/prism-dracula.css";

import { appWithTranslation } from "next-i18next";
import { ReactNode, useMemo } from "react";
import { MDXProvider } from "@mdx-js/react"

import { Box, ChakraProvider, extendTheme, Stack } from "@chakra-ui/react";

import { NextNProgress, MdxInternalProps, MDXNavigation, iterateRoutes, components } from "guild-docs";

import type { AppProps } from "next/app";

const theme = extendTheme({
  colors: {},
});

export function AppThemeProvider({ children }: { children: ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}

const serializedMdx = process.env.SERIALIZED_MDX_ROUTES;
const mdxRoutesData = serializedMdx && JSON.parse(serializedMdx);

function App({ Component, pageProps }: AppProps) {
  const mdxRoutes: MdxInternalProps["mdxRoutes"] | undefined = pageProps.mdxRoutes;
  const Navigation = useMemo(() => {
    if (!mdxRoutes) return null;

    if (mdxRoutes === 1) {
      if (!mdxRoutesData) return null;

      return <MDXNavigation paths={iterateRoutes(mdxRoutesData)} />;
    }

    return <MDXNavigation paths={iterateRoutes(mdxRoutes)} />;
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
    )
  );
}
