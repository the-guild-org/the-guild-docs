import { config } from './cliConfig';
import { writeFileFormatIfNotExists } from './writeFormat';

export async function writeNextConfig() {
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
  
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
  
  module.exports = withBundleAnalyzer(
    withGuildDocs({
      i18n,
      getRoutes,
    })
  );
    `,
    'typescript'
  );
}

export async function writei18Config() {
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

export async function writeRoutes() {
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
          docs: {
            $name: 'Docs',
            $routes: ["README"],
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
        `,

    'typescript'
  );
}

export async function writeTranslations() {
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

export async function writeApp() {
  await Promise.all([
    writeFileFormatIfNotExists(
      [config.cwd, 'src/pages/_app.tsx'],
      `
    import 'remark-admonitions/styles/infima.css';
    import 'prism-themes/themes/prism-atom-dark.css';
    import '../../public/style.css';
    
    import { appWithTranslation } from 'next-i18next';
    
    import { extendTheme, theme as chakraTheme } from '@chakra-ui/react';
    import { mode } from '@chakra-ui/theme-tools';
    import { ExtendComponents, handlePushRoute, CombinedThemeProvider, DocsPage, AppSeoProps } from '@guild-docs/client';
    import { Header, Subheader, Footer } from '@theguild/components';
    
    import type { AppProps } from 'next/app';
    
    ExtendComponents({
      HelloWorld() {
        return <p>Hello World!</p>;
      },
    });
    
    const styles: typeof chakraTheme['styles'] = {
      global: props => ({
        body: {
          bg: mode('white', 'gray.850')(props),
        },
      }),
    };
    
    const theme = extendTheme({
      colors: {
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          850: '#1b1b1b',
          900: '#171717',
        },
      },
      fonts: {
        heading: 'TGCFont, sans-serif',
        body: 'TGCFont, sans-serif',
      },
      config: {
        initialColorMode: 'light',
        useSystemColorMode: false,
      },
      styles,
    });
    
    const accentColor = '#1CC8EE';

    const serializedMdx = process.env.SERIALIZED_MDX_ROUTES;
    const mdxRoutes = { data: serializedMdx && JSON.parse(serializedMdx) };
    
    function AppContent(appProps: AppProps) {
      const { Component, pageProps, router } = appProps;
      const isDocs = router.asPath.startsWith('/docs');
    
      return (
        <>
          <Header accentColor={accentColor} activeLink="/open-source" themeSwitch />
          <Subheader
            activeLink={router.asPath}
            product={{
              title: 'Docs',
              description: 'Lorem ipsum dolor sit amet',
              image: {
                src: '/assets/subheader-logo.svg',
                alt: 'Docs',
              },
              onClick: e => handlePushRoute('/', e),
            }}
            links={[
              {
                children: 'Home',
                title: 'Read about Guild Docs',
                href: '/',
                onClick: e => handlePushRoute('/', e),
              },
              {
                children: 'Docs',
                title: 'View examples',
                href: '/docs',
                onClick: e => handlePushRoute('/docs', e),
              },
            ]}
            cta={{
              children: 'Get Started',
              title: 'Start using The Guild Docs',
              href: 'https://github.com/the-guild-org/the-guild-docs',
              target: '_blank',
              rel: 'noopener noreferrer',
            }}
          />
          {isDocs ? <DocsPage appProps={appProps} accentColor={accentColor} mdxRoutes={mdxRoutes} /> : <Component {...pageProps} />}
          <Footer />
        </>
      );
    }
    
    const AppContentWrapper = appWithTranslation(function TranslatedApp(appProps) {
      return <AppContent {...appProps} />;
    });

    const defaultSeo: AppSeoProps = {
      title: 'Guild Docs',
      description: 'Guild Docs Example',
      logo: {
        url: 'https://the-guild-docs.vercel.app/assets/subheader-logo.png',
        width: 50,
        height: 54,
      },
    };
    
    export default function App(appProps: AppProps) {
      return (
        <CombinedThemeProvider theme={theme} accentColor={accentColor} defaultSeo={defaultSeo}>
          <AppContentWrapper {...appProps} />
        </CombinedThemeProvider>
      );
    }
            `,
      'typescript'
    ),
    writeFileFormatIfNotExists(
      [config.cwd, 'public/style.css'],
      `
code[class*='language-'],
pre[class*='language-'] {
  white-space: pre-wrap !important;
  word-break: break-word !important;
}

code,
code * {
  font-family: 'SF Mono', 'Source Code Pro', Menlo, monospace;
}

article {
  width: 100%;
  overflow-x: auto;
}

#__next {
  font-family: TGCFont, sans-serif;
}

    `,
      'css'
    ),
    writeFileFormatIfNotExists(
      [config.cwd, 'public/assets/subheader-logo.svg'],
      `
    <svg width="50" height="54" viewBox="0 0 50 54" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2.02821 17.9612C0.79364 17.2557 0 15.933 0 14.4338C0 12.2293 1.85189 10.3774 4.05647 10.3774C4.67376 10.3774 5.20285 10.4656 5.64377 10.7302L22.6632 0.941839C23.4568 0.500922 24.4268 0.236328 25.3087 0.236328C26.2787 0.236328 27.1605 0.500922 27.9542 0.941839L42.4163 9.31927C41.3581 10.0247 40.5644 11.0829 40.0353 12.3174L26.0141 4.20459C25.7496 4.02822 25.4851 4.02826 25.2205 4.02826C24.956 4.02826 24.6914 4.1164 24.4268 4.20459L7.84835 13.7284C7.84835 13.993 7.93651 14.1693 7.93651 14.4338C7.93651 16.1975 6.79013 17.6085 5.29101 18.2258C5.20283 18.2258 5.02649 18.3139 4.93831 18.3139H4.85009C4.76191 18.3139 4.58557 18.4021 4.49739 18.4021H4.40917C4.23281 18.4021 4.14462 18.4021 3.96826 18.4021C3.79189 18.4021 3.61554 18.4021 3.43918 18.4021H3.35096C3.26278 18.4021 3.08644 18.4021 2.99826 18.3139H2.91004C2.64549 18.2258 2.29276 18.1376 2.02821 17.9612ZM50.0001 14.4338C50.0001 15.6684 49.471 16.7266 48.5891 17.4321V36.5679C48.5891 38.5079 47.5309 40.2716 45.9436 41.2417L31.4815 49.5309C31.4815 48.2082 31.0406 46.8854 30.2469 45.9154L44.0036 37.9789C44.5327 37.7144 44.7972 37.1852 44.7972 36.5679V18.3139C43.1217 17.7848 41.8872 16.2857 41.8872 14.4338C41.8872 13.552 42.1517 12.7584 42.6808 12.0529C42.769 11.9648 42.8572 11.7884 42.9454 11.7002C43.2099 11.4356 43.3863 11.2593 43.6508 11.0829C43.6508 11.0829 43.739 11.0829 43.739 10.9947C43.8272 10.9065 43.9154 10.9065 44.0917 10.8183C44.0917 10.8183 44.18 10.8184 44.18 10.7302C44.3563 10.642 44.4445 10.6419 44.6209 10.5538C44.9736 10.4656 45.4145 10.3774 45.8554 10.3774C48.1482 10.3774 50.0001 12.2293 50.0001 14.4338ZM29.3651 49.7072C29.3651 49.8836 29.3651 50.1482 29.2769 50.3246V50.4128C28.9242 52.2646 27.3369 53.7637 25.3087 53.7637C23.545 53.7637 22.0459 52.6173 21.5168 51.03L4.76193 41.3298C3.08644 40.3598 2.11643 38.5962 2.11643 36.6562V20.3422C2.73371 20.5186 3.43919 20.6949 4.05647 20.6949C4.67376 20.6949 5.29104 20.6067 5.82014 20.4304V36.6562C5.82014 37.2734 6.17284 37.8025 6.61376 38.0671L22.3104 47.1499C23.0159 46.2681 24.1623 45.739 25.3968 45.739C26.7196 45.739 27.866 46.3563 28.6596 47.4145C28.6596 47.4145 28.6596 47.4145 28.6596 47.5027C28.7478 47.5908 28.7478 47.6791 28.836 47.7673C28.836 47.7673 28.836 47.8554 28.9242 47.8554C28.9242 47.9436 29.0124 48.0317 29.0124 48.0317C29.0124 48.0317 29.0124 48.12 29.1006 48.12C29.1006 48.2082 29.1888 48.2963 29.1888 48.2963C29.1888 48.3845 29.1887 48.3845 29.2769 48.4727C29.2769 48.5608 29.3651 48.5609 29.3651 48.6491C29.3651 48.7373 29.3651 48.7372 29.4533 48.8254C29.4533 48.9136 29.4533 48.9137 29.4533 49.0018C29.4533 49.09 29.4533 49.1781 29.4533 49.2663C29.4533 49.3545 29.4533 49.3546 29.4533 49.4428C29.3651 49.4428 29.3651 49.5309 29.3651 49.7072Z" fill="#1CC8EE"/>
<path d="M18.2891 35V17.9375H23.7852C25.293 17.9375 26.6484 18.2812 27.8516 18.9688C29.0547 19.6484 29.9922 20.6133 30.6641 21.8633C31.3438 23.1055 31.6875 24.5 31.6953 26.0469V26.832C31.6953 28.3945 31.3633 29.7969 30.6992 31.0391C30.043 32.2734 29.1133 33.2422 27.9102 33.9453C26.7148 34.6406 25.3789 34.9922 23.9023 35H18.2891ZM22.4023 21.1133V31.8359H23.832C25.0117 31.8359 25.918 31.418 26.5508 30.582C27.1836 29.7383 27.5 28.4883 27.5 26.832V26.0938C27.5 24.4453 27.1836 23.2031 26.5508 22.3672C25.918 21.5312 24.9961 21.1133 23.7852 21.1133H22.4023Z" fill="#1CC8EE"/>
</svg>

    `,
      'html'
    ),
  ]);
}

export async function writeDocPages() {
  const w1 = writeFileFormatIfNotExists(
    [config.cwd, 'src/pages/docs/[[...slug]].tsx'],
    `
    import Head from 'next/head';

    import { DocsContent, DocsTOC, MDXPage } from '@guild-docs/client';
    import { MDXPaths, MDXProps } from '@guild-docs/server';
    
    import { getRoutes } from '../../../routes';
    
    import type { GetStaticPaths, GetStaticProps } from 'next';
    
    export default MDXPage(function PostPage({ content, TOC, MetaHead, BottomNavigation }) {
      return (
        <>
          <Head>{MetaHead}</Head>
          <DocsContent>{content}</DocsContent>
          <DocsTOC>
            <TOC />
            <BottomNavigation />
          </DocsTOC>
        </>
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
    import { HeroGradient, InfoList } from '@theguild/components';

    import { handlePushRoute } from '@guild-docs/client';
    
    export default function Index() {
      return (
        <>
          <HeroGradient
            title="The Guild Docs"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at gravida lacus"
            link={{
              href: '/docs',
              children: 'Get Started',
              title: 'Get started with The Guild Docs',
              onClick: e => handlePushRoute('/docs', e),
            }}
            version="0.0.12"
            colors={['#000000', '#1CC8EE']}
          />
    
          <InfoList
            title="First steps"
            items={[
              {
                title: 'Install',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas euismod amet duis quisque semper.',
              },
              {
                title: 'Configure',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas euismod amet duis quisque semper.',
              },
              {
                title: 'Enjoy',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas euismod amet duis quisque semper.',
              },
            ]}
          />
        </>
      );
    }
      `,
    'typescript'
  );

  await Promise.all([w1, w2]);
}

export async function writeDocsDirectory() {
  await writeFileFormatIfNotExists(
    [config.cwd, 'docs/README.mdx'],
    `
---
title: Getting Started - Guild Docs
sidebar_label: Getting Started
---

# Index Docs Page

<Translated>greeting</Translated>
&nbsp;This is the <Tooltip label="This is a tooltip">Index</Tooltip> of the Documentation Page!

:dog: :+1:

<HelloWorld />

## Heading 2

<PackageInstall packages={['@guild-docs/client @guild-docs/server', '-D @types/node']} />

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nascetur ridiculus mus mauris vitae ultricies leo integer. Duis at consectetur lorem donec massa sapien. Ipsum dolor sit amet consectetur adipiscing. Habitasse platea dictumst vestibulum rhoncus est pellentesque. Est pellentesque elit ullamcorper dignissim cras tincidunt. Gravida dictum fusce ut placerat orci nulla. Augue lacus viverra vitae congue eu. Risus quis varius quam quisque id diam vel. Imperdiet massa tincidunt nunc pulvinar. Amet tellus cras adipiscing enim eu turpis. Velit scelerisque in dictum non consectetur. In fermentum posuere urna nec.

### Heading 3

Lobortis mattis aliquam faucibus purus. Aliquam eleifend mi in nulla posuere sollicitudin aliquam ultrices. In tellus integer feugiat scelerisque varius morbi enim. In ante metus dictum at tempor. Nunc faucibus a pellentesque sit amet porttitor eget dolor. Eu turpis egestas pretium aenean pharetra magna ac placerat vestibulum. Porttitor rhoncus dolor purus non enim praesent elementum facilisis leo. Lectus vestibulum mattis ullamcorper velit sed ullamcorper. Enim praesent elementum facilisis leo vel fringilla est ullamcorper eget. Suspendisse potenti nullam ac tortor vitae purus faucibus ornare. In dictum non consectetur a erat. Faucibus interdum posuere lorem ipsum dolor. Morbi tristique senectus et netus et malesuada fames ac.

Senectus et netus et malesuada fames. Ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget. Lacus luctus accumsan tortor posuere ac ut consequat. Velit laoreet id donec ultrices. Pellentesque habitant morbi tristique senectus et netus et malesuada fames. Interdum velit euismod in pellentesque. Mauris in aliquam sem fringilla ut morbi tincidunt. Aliquet nec ullamcorper sit amet risus nullam eget felis. Vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique. Dui nunc mattis enim ut tellus. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Mauris nunc congue nisi vitae suscipit tellus. Duis convallis convallis tellus id. Ultricies integer quis auctor elit sed. Vitae congue mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Faucibus a pellentesque sit amet porttitor eget dolor morbi. Et malesuada fames ac turpis egestas sed tempus. Ut sem nulla pharetra diam sit. Ultricies integer quis auctor elit sed.

Rhoncus mattis rhoncus urna neque. Habitasse platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim. Ultricies mi quis hendrerit dolor magna eget est lorem ipsum. Urna et pharetra pharetra massa massa ultricies. Amet purus gravida quis blandit turpis cursus in hac habitasse. Leo vel orci porta non. Consectetur lorem donec massa sapien faucibus. Nibh venenatis cras sed felis eget velit aliquet sagittis id. Laoreet sit amet cursus sit amet dictum. Eros donec ac odio tempor orci dapibus. Enim nec dui nunc mattis enim ut tellus elementum sagittis. Hac habitasse platea dictumst quisque sagittis purus sit amet. Tellus id interdum velit laoreet id. Adipiscing tristique risus nec feugiat in. Ligula ullamcorper malesuada proin libero. Gravida dictum fusce ut placerat orci nulla pellentesque dignissim enim. Pulvinar etiam non quam lacus suspendisse faucibus interdum. Sit amet aliquam id diam maecenas. Arcu odio ut sem nulla pharetra. Tempor nec feugiat nisl pretium fusce id.

Odio ut enim blandit volutpat maecenas volutpat blandit. Fermentum et sollicitudin ac orci phasellus egestas. Ut tortor pretium viverra suspendisse potenti nullam ac tortor. Risus nec feugiat in fermentum. Cursus sit amet dictum sit. Dictumst quisque sagittis purus sit amet volutpat consequat mauris nunc. Nisi vitae suscipit tellus mauris a. Aliquam sem fringilla ut morbi tincidunt. Ornare lectus sit amet est placerat in egestas. Sit amet luctus venenatis lectus magna fringilla. A lacus vestibulum sed arcu non odio. Ut enim blandit volutpat maecenas volutpat blandit aliquam. Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi.

Eget mi proin sed libero enim sed. Vitae sapien pellentesque habitant morbi tristique senectus. Elit eget gravida cum sociis natoque penatibus et magnis dis. Pellentesque diam volutpat commodo sed egestas. Faucibus scelerisque eleifend donec pretium vulputate. Adipiscing elit ut aliquam purus sit. Duis ultricies lacus sed turpis tincidunt id. In vitae turpis massa sed. Eget lorem dolor sed viverra ipsum nunc aliquet bibendum enim. Augue eget arcu dictum varius duis at consectetur lorem. Quam quisque id diam vel quam elementum pulvinar etiam. Nunc mattis enim ut tellus elementum sagittis. Praesent elementum facilisis leo vel fringilla est. Urna cursus eget nunc scelerisque viverra mauris in aliquam. Nisl rhoncus mattis rhoncus urna. Sit amet dictum sit amet justo. Donec ac odio tempor orci dapibus ultrices in. Facilisis leo vel fringilla est ullamcorper eget nulla facilisi. Adipiscing commodo elit at imperdiet dui. A diam sollicitudin tempor id eu nisl nunc.

#### Heading 4

Volutpat ac tincidunt vitae semper quis lectus. Risus viverra adipiscing at in. Et malesuada fames ac turpis egestas integer eget aliquet. Sed nisi lacus sed viverra tellus in hac habitasse platea. In iaculis nunc sed augue. Ornare massa eget egestas purus viverra accumsan in. Eu mi bibendum neque egestas congue quisque egestas diam. Placerat orci nulla pellentesque dignissim enim. Augue interdum velit euismod in pellentesque. Lobortis elementum nibh tellus molestie nunc non blandit massa enim. Pellentesque elit ullamcorper dignissim cras tincidunt lobortis. Non blandit massa enim nec. Placerat in egestas erat imperdiet. Nisl pretium fusce id velit ut. Urna molestie at elementum eu facilisis sed odio. Maecenas volutpat blandit aliquam etiam erat velit scelerisque. Curabitur vitae nunc sed velit dignissim sodales ut. A cras semper auctor neque vitae tempus quam. Diam volutpat commodo sed egestas egestas. Tempus iaculis urna id volutpat.

## New Item

Senectus et netus et malesuada fames. Ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget. Lacus luctus accumsan tortor posuere ac ut consequat. Velit laoreet id donec ultrices. Pellentesque habitant morbi tristique senectus et netus et malesuada fames. Interdum velit euismod in pellentesque. Mauris in aliquam sem fringilla ut morbi tincidunt. Aliquet nec ullamcorper sit amet risus nullam eget felis. Vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique. Dui nunc mattis enim ut tellus. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Mauris nunc congue nisi vitae suscipit tellus. Duis convallis convallis tellus id. Ultricies integer quis auctor elit sed. Vitae congue mauris rhoncus aenean vel elit scelerisque mauris pellentesque. Faucibus a pellentesque sit amet porttitor eget dolor morbi. Et malesuada fames ac turpis egestas sed tempus. Ut sem nulla pharetra diam sit. Ultricies integer quis auctor elit sed.

Dolor sit amet consectetur adipiscing elit ut aliquam. Venenatis tellus in metus vulputate eu scelerisque felis imperdiet proin. Iaculis eu non diam phasellus. In dictum non consectetur a erat nam. Est placerat in egestas erat imperdiet sed euismod nisi. Erat imperdiet sed euismod nisi porta lorem mollis. Urna et pharetra pharetra massa massa ultricies mi quis. Pulvinar neque laoreet suspendisse interdum consectetur libero id faucibus nisl. Pellentesque elit ullamcorper dignissim cras. Pellentesque elit eget gravida cum. Dictumst quisque sagittis purus sit amet volutpat consequat. Justo laoreet sit amet cursus sit amet dictum sit. Nibh mauris cursus mattis molestie a iaculis at erat. Malesuada pellentesque elit eget gravida cum sociis. Nunc scelerisque viverra mauris in. Diam quam nulla porttitor massa id neque aliquam vestibulum. At auctor urna nunc id cursus metus aliquam eleifend mi.
              `,
    'mdx'
  );
}

export async function writeTSConfig() {
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

export async function writeDocument() {
  await writeFileFormatIfNotExists(
    [config.cwd, 'src/pages/_document.tsx'],
    `
    import Document, { Head, Html, Main, NextScript } from 'next/document';

    import { ColorModeScript } from '@chakra-ui/react';
    
    export default class MyDocument extends Document {
      render() {
        return (
          <Html>
            <Head />
            <head>
              <link rel="preconnect" href="https://fonts.gstatic.com" />
              <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap" rel="stylesheet" />
            </head>
            <body>
              <ColorModeScript initialColorMode="light" />
              <Main />
              <NextScript />
            </body>
          </Html>
        );
      }
    }
      `,
    'typescript'
  );
}
