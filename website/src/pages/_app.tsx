import type { ReactElement } from 'react';
import type { AppProps } from 'next/app';
import { Header, Footer, ThemeProvider } from '@theguild/components';
import 'guild-docs/style.css';

export default function App({ Component, pageProps }: AppProps): ReactElement {
  // @ts-expect-error -- getLayout is custom function from nextra
  const { getLayout = page => page } = Component;
  return (
    <ThemeProvider>
      <Header accentColor="#1cc8ee" themeSwitch searchBarProps={{ version: 'v2' }} />
      {getLayout(<Component {...pageProps} />)}
      <Footer />
    </ThemeProvider>
  );
}

// const defaultSeo: AppSeoProps = {
//   title: 'Guild Docs',
//   description: 'Guild Docs Example',
//   logo: {
//     url: 'https://the-guild-docs.vercel.app/assets/subheader-logo.png',
//     width: 50,
//     height: 54,
//   },
// };
