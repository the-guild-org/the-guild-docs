import type { ReactElement } from 'react';
import type { AppProps } from 'next/app';
import { Header, Footer, ThemeProvider } from '@theguild/components';
import '@guild-docs/client/styles.css';

const accentColor = '#1cc8ee';

export default function App({ Component, pageProps }: AppProps): ReactElement {
  // @ts-expect-error
  const { getLayout } = Component;
  // @ts-ignore
  const childComponent = <Component {...pageProps} />;

  return (
    <ThemeProvider>
      <Header accentColor={accentColor} activeLink='/open-source' themeSwitch />
      {getLayout ? getLayout(childComponent) : childComponent}
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
