import { useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import ScriptPkg from 'next/script';
import React, { useEffect, useMemo, useState } from 'react';
import { getDefault, useIsBrowserSSRSafe } from './utils';

const Script = getDefault(ScriptPkg);

export interface GiscusProps {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
}

let GiscusKeyInc = 0;

export function Giscus({ category, categoryId, repo, repoId }: GiscusProps) {
  const { asPath } = useRouter();

  const dataTheme = useColorModeValue('light', 'dark');

  const key = useMemo(() => {
    return `${dataTheme}${asPath}${++GiscusKeyInc}`.replace(/\//g, '_');
  }, [dataTheme, asPath]);

  const isBrowser = useIsBrowserSSRSafe();

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
}

function GiscusScript({
  category,
  categoryId,
  repo,
  repoId,
  asPath,
  scriptKey,
  dataTheme,
}: GiscusProps & { asPath: string; scriptKey: string; dataTheme: string }) {
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
}
