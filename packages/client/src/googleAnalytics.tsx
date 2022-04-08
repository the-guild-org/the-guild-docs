import { useEffect } from 'react';
import { useRouter } from 'next/router.js';
import Script from 'next/script.js';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
const pageview = (url: string, trackingId: string) => {
  (window as any).gtag('config', trackingId, {
    page_path: url,
  });
};

export function GoogleAnalytics({ trackingId }: { trackingId: string }) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url, trackingId);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`} />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${trackingId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
