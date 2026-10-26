import { siteConfig } from "@/config/site";

type BlogPostOgImageProps = {
  title: string;
  description: string;
  /** Shown as the kicker above the title */
  tag?: string;
  author: string;
  /** Already formatted for display, e.g. "March 30, 2026" */
  date: string;
};

const GOLD = "#cbb26a";
const BACKGROUND = "#080808";

/** Iceland is condensed; long titles still need to fit in three lines */
function titleFontSize(title: string): number {
  if (title.length <= 50) return 88;
  if (title.length <= 75) return 72;
  return 60;
}

/** Satori ignores `lineClamp` here, so keep the description to about two lines */
function truncate(text: string, max = 150): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 0)).replace(/[,;:.]$/, "")}…`;
}

/**
 * 1200×630 card rendered by `next/og` for every blog post. Satori only
 * supports flexbox, so every box with several children declares `display: flex`.
 */
export function BlogPostOgImage({ title, description, tag, author, date }: BlogPostOgImageProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: BACKGROUND,
        color: "#ffffff",
        fontFamily: "Inter",
      }}
    >
      <div style={{ width: 14, height: "100%", background: GOLD }} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "52px 64px 48px 56px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "Iceland", fontSize: 44, color: GOLD, letterSpacing: 1 }}>
            {siteConfig.siteNameShort}
          </div>
          <div style={{ fontSize: 24, color: "rgba(255,255,255,0.55)" }}>rcweb.dev/blog</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {tag ? (
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: GOLD,
                letterSpacing: 4,
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              {tag}
            </div>
          ) : null}
          <div
            style={{
              fontFamily: "Iceland",
              fontSize: titleFontSize(title),
              lineHeight: 1.05,
              color: GOLD,
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 22,
              fontSize: 27,
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.78)",
            }}
          >
            {truncate(description)}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 24,
            paddingTop: 24,
            borderTop: "1px solid rgba(203,178,106,0.35)",
          }}
        >
          <div style={{ fontWeight: 600 }}>{author}</div>
          <div style={{ color: "rgba(255,255,255,0.45)" }}>·</div>
          <div style={{ color: "rgba(255,255,255,0.65)" }}>{date}</div>
        </div>
      </div>
    </div>
  );
}
