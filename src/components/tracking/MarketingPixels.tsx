"use client";

import Script from "next/script";
import Image from "next/image";
import { useAnalyticsOptOut } from "@/lib/analyticsOptOut";

const FACEBOOK_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
const LINKEDIN_PARTNER_ID = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID;
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

/**
 * Ad-platform pixels for paid campaigns (Meta, LinkedIn, Google Ads).
 *
 * Nothing is rendered unless the matching variable is set, so with no
 * campaign running there is no pixel and no extra JavaScript. To measure a
 * campaign again, set NEXT_PUBLIC_FACEBOOK_PIXEL_ID,
 * NEXT_PUBLIC_LINKEDIN_PARTNER_ID and/or NEXT_PUBLIC_GOOGLE_ADS_ID in Vercel
 * and redeploy; the IDs are kept in ~/.config/rcweb/marketing-pixels.env.
 * A visitor who switched measurement off in the Privacy Policy never gets them.
 */
export default function MarketingPixels() {
  const optedOut = useAnalyticsOptOut();
  if (optedOut) return null;

  return (
    <>
      {FACEBOOK_PIXEL_ID ? (
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
              height={1}
              width={1}
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      ) : null}

      {LINKEDIN_PARTNER_ID ? (
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
              height={1}
              width={1}
              style={{ display: "none" }}
              alt=""
              src={`https://px.ads.linkedin.com/collect/?pid=${LINKEDIN_PARTNER_ID}&fmt=gif`}
            />
          </noscript>
        </>
      ) : null}

      {/* Google Ads conversion tracking. gtag.js is already loaded once by
          the root layout for Analytics; a second config call is all Ads
          needs, and the dataLayer queues it until the library runs. */}
      {GOOGLE_ADS_ID ? (
        <Script id="google-ads-config" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('config', '${GOOGLE_ADS_ID}');
          `}
        </Script>
      ) : null}
    </>
  );
}
