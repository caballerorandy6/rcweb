"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import Image from "next/image";
import CookieConsent from "./CookieConsent";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const FACEBOOK_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
const LINKEDIN_PARTNER_ID = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID;
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

export default function CookieConsentProvider() {
  const [hasConsent, setHasConsent] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    const consent = localStorage.getItem("cookie-consent");
    if (consent === "accepted") {
      setHasConsent(true);
      setShowBanner(false);
    } else if (consent === "rejected") {
      setHasConsent(false);
      setShowBanner(false);
    }
  }, []);

  const handleAccept = () => {
    setHasConsent(true);
    setShowBanner(false);
  };

  const handleReject = () => {
    setHasConsent(false);
    setShowBanner(false);
  };

  return (
    <>
      {/* Cookie Consent Banner */}
      {showBanner && (
        <CookieConsent onAccept={handleAccept} onReject={handleReject} />
      )}

      {/* Only load tracking scripts if user has consented */}
      {hasConsent && (
        <>
          {/* Preconnect to tracking domains for better performance */}
          <link rel="preconnect" href="https://www.googletagmanager.com" />
          {GOOGLE_ADS_ID && (
            <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
          )}
          {FACEBOOK_PIXEL_ID && (
            <>
              <link rel="preconnect" href="https://connect.facebook.net" />
              <link rel="dns-prefetch" href="https://www.facebook.com" />
            </>
          )}
          {LINKEDIN_PARTNER_ID && (
            <link rel="dns-prefetch" href="https://snap.licdn.com" />
          )}

          {/* Google Tag Manager */}
          {GTM_ID && (
            <>
              <Script id="google-tag-manager" strategy="afterInteractive">
                {`
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${GTM_ID}');
                `}
              </Script>
              <noscript>
                <iframe
                  src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                  height="0"
                  width="0"
                  style={{ display: "none", visibility: "hidden" }}
                />
              </noscript>
            </>
          )}

          {/* Facebook Pixel */}
          {FACEBOOK_PIXEL_ID && (
            <>
              <Script id="facebook-pixel" strategy="lazyOnload">
                {`
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${FACEBOOK_PIXEL_ID}');
                  fbq('track', 'PageView');
                `}
              </Script>
              <noscript>
                <Image
                  height="1"
                  width="1"
                  style={{ display: "none" }}
                  src={`https://www.facebook.com/tr?id=${FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
                  alt=""
                />
              </noscript>
            </>
          )}

          {/* LinkedIn Insight Tag */}
          {LINKEDIN_PARTNER_ID && (
            <>
              <Script id="linkedin-insight" strategy="lazyOnload">
                {`
                  _linkedin_partner_id = "${LINKEDIN_PARTNER_ID}";
                  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
                  window._linkedin_data_partner_ids.push(_linkedin_partner_id);
                  (function(l) {
                    if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
                    window.lintrk.q=[]}
                    var s = document.getElementsByTagName("script")[0];
                    var b = document.createElement("script");
                    b.type = "text/javascript";b.async = true;
                    b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
                    s.parentNode.insertBefore(b, s);
                  })(window.lintrk);
                `}
              </Script>
              <noscript>
                <Image
                  height="1"
                  width="1"
                  style={{ display: "none" }}
                  alt=""
                  src={`https://px.ads.linkedin.com/collect/?pid=${LINKEDIN_PARTNER_ID}&fmt=gif`}
                />
              </noscript>
            </>
          )}

          {/* Google Ads Conversion Tracking */}
          {GOOGLE_ADS_ID && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
                strategy="afterInteractive"
              />
              <Script id="google-ads-config" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GOOGLE_ADS_ID}');
                `}
              </Script>
            </>
          )}

          {/* Google Analytics */}
          {GA_MEASUREMENT_ID && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                strategy="afterInteractive"
              />
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                  });
                `}
              </Script>
            </>
          )}
        </>
      )}
    </>
  );
}
