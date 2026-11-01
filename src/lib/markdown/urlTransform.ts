import { defaultUrlTransform } from "react-markdown";

/**
 * react-markdown drops any URL whose protocol is not http(s), mailto, irc or
 * xmpp. The site's phone links are `tel:`, so let those through unchanged
 * and keep the default sanitising for everything else.
 */
export function urlTransform(url: string): string {
  return url.startsWith("tel:") ? url : defaultUrlTransform(url);
}
