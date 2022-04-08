import { useEffect } from 'react';
import type { NextRouter } from 'next/router';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
const pageview = (url: string, trackingId: string) => {
  (window as any).gtag('config', trackingId, {
    page_path: url,
  });
};

// Why not a component? Next.js + CJS goes crazy when I use `next/router.js` and `next/script.js`.
// I get: https://reactjs.org/docs/error-decoder.html/?invariant=130&args%5B%5D=object&args%5B%5D=
// Probably because of two different versions of React or something. Not sure...
export function useGoogleAnalytics({ trackingId, router }: { trackingId: string; router: NextRouter }) {
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url, trackingId);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events, trackingId]);

  return {
    loadScriptProps: {
      strategy: 'afterInteractive',
      src: `https://www.googletagmanager.com/gtag/js?id=${trackingId}`,
    },
    configScriptProps: {
      id: 'gtag-init',
      strategy: 'afterInteractive',
      dangerouslySetInnerHTML: {
        __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${trackingId}', {
              page_path: window.location.pathname,
            });
          `,
      },
    },
  };
}
