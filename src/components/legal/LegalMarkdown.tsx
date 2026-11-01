import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import clsx from "clsx";
import { Link, type Href } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import PhoneLink from "@/components/tracking/PhoneLink";
import remarkCallouts, { type CalloutTone } from "@/lib/markdown/remarkCallouts";
import { urlTransform } from "@/lib/markdown/urlTransform";

const LINK_CLASS = "text-gold hover:text-gold/80 underline";

const CALLOUT_CLASS: Record<CalloutTone, string> = {
  note: "bg-gold/10 border-gold/30",
  warning: "bg-amber-500/10 border-amber-500/30",
  danger: "bg-red-500/10 border-red-500/30",
  success: "bg-green-500/10 border-green-500/30",
};

/**
 * `/manage-subscription` or `/#pricing` written in the Markdown becomes a
 * locale-aware Link to the translated URL; anything that is not a known
 * static page stays a plain anchor.
 */
function internalHref(href: string): Href | null {
  const [pathname, hash] = href.split("#");
  const key = pathname || "/";
  if (!(key in routing.pathnames) || key.includes("[")) return null;
  // Narrowed to a static key of routing.pathnames just above
  return (hash ? { pathname: key, hash } : key) as Href;
}

function LegalLink({ href = "", children }: { href?: string; children?: React.ReactNode }) {
  if (href.startsWith("tel:")) {
    return (
      <PhoneLink href={href} className={LINK_CLASS}>
        {children}
      </PhoneLink>
    );
  }
  if (href.startsWith("/")) {
    const internal = internalHref(href);
    if (internal) {
      return (
        <Link href={internal} className={LINK_CLASS}>
          {children}
        </Link>
      );
    }
  }
  const external = /^https?:/.test(href);
  return (
    <a
      href={href}
      className={LINK_CLASS}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

const components: Components = {
  a: ({ href, children }) => <LegalLink href={href}>{children}</LegalLink>,
  // Callouts (see remarkCallouts). A note box, not a quotation.
  blockquote: ({ node, children }) => {
    const tone = (node?.properties?.dataTone as CalloutTone | undefined) ?? "note";
    return (
      <div role="note" className={clsx("callout", CALLOUT_CLASS[tone])}>
        {children}
      </div>
    );
  },
};

type LegalMarkdownProps = {
  children: string;
  /** Overrides for the intro card, whose paragraphs are larger than the body's */
  overrides?: Components;
};

/** Markdown of a legal document, styled by the `legal-prose` utility of the parent */
export default function LegalMarkdown({ children, overrides }: LegalMarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkCallouts]}
      urlTransform={urlTransform}
      components={overrides ? { ...components, ...overrides } : components}
    >
      {children}
    </ReactMarkdown>
  );
}
