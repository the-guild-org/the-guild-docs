import { useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router.js';
import Script from 'next/script.js';
import React, { FC, useEffect, useMemo, useState } from 'react';

export interface GiscusProps {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
}

let GiscusKeyInc = 0;

const Giscus: FC<GiscusProps> = ({ category, categoryId, repo, repoId }) => {
  const { asPath } = useRouter();

  const dataTheme = useColorModeValue('light', 'dark');

  const key = useMemo(() => `${dataTheme}${asPath}${++GiscusKeyInc}`.replace(/\//g, '_'), [dataTheme, asPath]);

  const isBrowser = typeof window !== 'undefined';

  if (!isBrowser) return null;

  return (
    <>
      <GiscusScript
        key={key}
        scriptKey={key}
        category={category}
        categoryId={categoryId}
        repo={repo}
        repoId={repoId}
        asPath={asPath}
        dataTheme={dataTheme}
      />
      <div className="giscus" />
    </>
  );
};

const GiscusScript: FC<GiscusProps & { asPath: string; scriptKey: string; dataTheme: string }> = ({
  category,
  categoryId,
  repo,
  repoId,
  asPath,
  scriptKey,
  dataTheme,
}) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) return;

    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    iframe?.contentWindow?.postMessage({ giscus: { setConfig: { term: asPath.split('?')[0] } } }, window.location.origin);
  }, [asPath, loaded]);

  return (
    <Script
      src={`https://giscus.app/client.js?key=${scriptKey}`}
      data-repo={repo}
      data-repo-id={repoId}
      data-category={category}
      data-category-id={categoryId}
      data-mapping="pathname"
      data-reactions-enabled="1"
      data-emit-metadata="0"
      data-input-position="bottom"
      data-theme={dataTheme}
      data-lang="en"
      crossOrigin="anonymous"
      async
      strategy="lazyOnload"
      onLoad={() => {
        setLoaded(true);
      }}
    />
  );
};

export default Giscus;
