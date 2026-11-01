import NextLink from "next/link";
import type { Route } from "next";
import { Link, type Href } from "@/i18n/navigation";
import { isAdminPath, type AdminHref } from "@/config/adminRoutes";
import clsx from "clsx";
import type { ReactNode, MouseEventHandler } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

/** Destinations rendered as a plain anchor: other sites, dialer, mail, downloadable files */
export type ExternalHref =
  | `http://${string}`
  | `https://${string}`
  | `tel:${string}`
  | `mailto:${string}`
  | `/${string}.${string}`;
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Internal page (locale-aware) or an external/tel/mailto/file URL */
  href?: Href | ExternalHref | AdminHref;
  external?: boolean;
  /** Download attribute for file links (served as a plain anchor) */
  download?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  "aria-label"?: string;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-6 py-4 text-base sm:text-lg",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "text-black bg-linear-to-r from-gold via-gold-light to-gold hover:from-gold-light hover:via-gold hover:to-gold-light shadow-lg hover:shadow-gold/25 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
  secondary:
    "text-gold border-2 border-gold/50 hover:bg-gold/10 hover:border-gold disabled:opacity-50 disabled:cursor-not-allowed",
  danger:
    "text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed",
};

/**
 * CTA unificado de la marca: dorado sólido de la paleta (gold/gold-light),
 * un solo radio y el shimmer del primario en un único lugar.
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  href,
  external = false,
  download,
  type = "button",
  disabled = false,
  fullWidth = false,
  className,
  onClick,
  "aria-label": ariaLabel,
}: ButtonProps) => {
  const classes = clsx(
    "relative inline-flex items-center justify-center gap-2 font-inter font-semibold rounded-xl transition duration-300 overflow-hidden group",
    sizeClasses[size],
    variantClasses[variant],
    fullWidth && "w-full",
    className
  );

  const content = (
    <>
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"
        />
      )}
      <span className="relative flex items-center justify-center gap-2">
        {children}
      </span>
    </>
  );

  if (href) {
    const isPlainAnchor = typeof href === "string" && (external || /^(https?:|tel:|mailto:)|\.\w+$/.test(href));
    // tel:/mailto: open the dialer or mail client: plain anchor, same tab
    if (typeof href === "string" && /^(tel|mailto):/.test(href)) {
      return (
        <a href={href} className={classes} onClick={onClick} aria-label={ariaLabel}>
          {content}
        </a>
      );
    }
    if (isPlainAnchor) {
      return (
        <a
          href={href as string}
          target="_blank"
          rel="noopener noreferrer"
          download={download}
          className={classes}
          onClick={onClick}
          aria-label={ariaLabel}
        >
          {content}
        </a>
      );
    }
    // Admin pages have no locale: plain next/link
    if (typeof href === "string" && isAdminPath(href.split(/[?#]/)[0])) {
      return (
        <NextLink href={href as Route} className={classes} onClick={onClick} aria-label={ariaLabel}>
          {content}
        </NextLink>
      );
    }
    return (
      <Link
        href={href as Href}
        className={classes}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={classes}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
};

export default Button;
