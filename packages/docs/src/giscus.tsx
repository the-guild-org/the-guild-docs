import { useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router.js';
import ScriptImport from 'next/script.js';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { getDefault } from './utils.js';

const Script = getDefault(ScriptImport);

export interface GiscusProps {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
}

let GiscusKeyInc = 0;

export const Giscus = ({ category, categoryId, repo, repoId }: GiscusProps): ReactElement | null => {
  const { asPath } = useRouter();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) return;

    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    iframe?.contentWindow?.postMessage(
      {
        giscus: {
          setConfig: {
            term: asPath.split('?')[0],
          },
        },
      },
      window.location.origin
    );
  }, [asPath, loaded]);

  const dataTheme = useColorModeValue('light', 'dark');

  const scriptKey = useMemo(() => `${dataTheme}${asPath}${++GiscusKeyInc}`.replace(/\//g, '_'), [dataTheme, asPath]);

  const isBrowser = !!globalThis.window;

  if (!isBrowser) return null;

  return (
    <>
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
      <div className="giscus" style={{ marginTop: 8 }} />
    </>
  );
};
