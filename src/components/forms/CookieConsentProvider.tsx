"use client";

import { useState, useEffect } from "react";
// COMMENTED: Not using ads - uncomment if running ad campaigns
// import Script from "next/script";
// import Image from "next/image";
import CookieConsent from "./CookieConsent";
import ClientOnly from "@/components/ui/ClientOnly";

// COMMENTED: Not using ads - uncomment if running ad campaigns
// const FACEBOOK_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
// const LINKEDIN_PARTNER_ID = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID;
// const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

export default function CookieConsentProvider() {
  const [hasConsent, setHasConsent] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    const consent = localStorage.getItem("cookie-consent");
    if (consent === "accepted") {
      setHasConsent(true);
      setShowBanner(false);

      // Update consent mode for returning visitors
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
          'ad_storage': 'granted',
          'ad_user_data': 'granted',
          'ad_personalization': 'granted',
          'analytics_storage': 'granted',
          'functionality_storage': 'granted',
          'personalization_storage': 'granted'
        });
      }
    } else if (consent === "rejected") {
      setHasConsent(false);
      setShowBanner(false);
    }
  }, []);

  const handleAccept = () => {
    setHasConsent(true);
    setShowBanner(false);

    // Update Google Consent Mode to allow tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted',
        'analytics_storage': 'granted',
        'functionality_storage': 'granted',
        'personalization_storage': 'granted'
      });
    }
  };

  const handleReject = () => {
    setHasConsent(false);
    setShowBanner(false);

    // Keep consent denied (already set as default)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied',
        'functionality_storage': 'denied',
        'personalization_storage': 'denied'
      });
    }
  };

  return (
    <ClientOnly>
      {/* Cookie Consent Banner */}
      {showBanner && (
        <CookieConsent onAccept={handleAccept} onReject={handleReject} />
      )}

      {/* Only load tracking scripts if user has consented */}
      {/* COMMENTED: Not using ads - uncomment if running ad campaigns
      {hasConsent && (
        <>
          {/* Preconnect to tracking domains for better performance */}
          {/* <link rel="preconnect" href="https://www.googletagmanager.com" />
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

          {/* Facebook Pixel */}
          {/* {FACEBOOK_PIXEL_ID && (
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
          {/* {LINKEDIN_PARTNER_ID && (
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
          {/* {GOOGLE_ADS_ID && (
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

        </>
      )}
      */}
    </ClientOnly>
  );
}
