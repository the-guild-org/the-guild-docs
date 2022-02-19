import type { DefaultSeoProps, OpenGraphMedia } from 'next-seo/lib/types';
import { DefaultSeo } from 'next-seo';
import React, { useMemo, createContext, useContext, Dispatch, SetStateAction } from 'react';
import type { ReactNode } from 'react';

export interface SeoProps extends DefaultSeoProps {
  title: string;
  description: string;
  logo: OpenGraphMedia;
}

interface IContextProps {
  default: SeoProps;
  disableDefault: Dispatch<SetStateAction<boolean>>;
}

const SeoContext = createContext<Partial<IContextProps>>({});

export function useSeo() {
  return useContext(SeoContext);
}

export function Seo({ children, value }: { children: ReactNode; value: SeoProps }) {
  const [disabled, setDisabled] = React.useState(false);

  const DefaultSEO = useMemo(() => {
    if (!value) throw Error('No `defaultSeo` specified in CombinedThemeProvider');
    const { logo, ...rest } = value;

    if (!rest?.title) throw Error(`No defaultSeo.title specified!`);

    if (!rest.description) throw Error(`No defaultSeo.description specified!`);

    (rest.openGraph ||= {}).type ||= 'website';

    if (!logo?.url?.startsWith('https://')) throw Error(`No defaultSeo.logo.url specified with absolute https url!`);

    rest.openGraph.images ||= [logo];

    return <DefaultSeo {...rest} />;
  }, [value]);

  return (
    <SeoContext.Provider value={{ disableDefault: setDisabled, default: value }}>
      {!disabled && DefaultSEO}
      {children}
    </SeoContext.Provider>
  );
}
