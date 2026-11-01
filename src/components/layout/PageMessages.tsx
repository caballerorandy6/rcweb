import { NextIntlClientProvider, type Messages } from "next-intl";
import { getMessages } from "next-intl/server";
import { pickClientMessages } from "@/i18n/clientMessages";

/**
 * Gives the client islands of one page their own namespaces on top of the
 * site-wide ones, so rarely visited flows (quote, payments, subscription) do
 * not ship their copy with every page.
 */
export default async function PageMessages({
  namespaces,
  children,
}: {
  namespaces: readonly (keyof Messages)[];
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={pickClientMessages(messages, namespaces)}>
      {children}
    </NextIntlClientProvider>
  );
}
