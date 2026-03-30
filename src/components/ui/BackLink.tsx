import Link from "next/link";
import type { Route } from "next";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

type BackLinkProps = {
  href: string;
  label: string;
};

export default function BackLink({ href, label }: BackLinkProps) {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-28 sm:pt-32">
      <Link
        href={href as Route}
        className="inline-flex items-center gap-2 text-sm font-inter text-gold/70 hover:text-gold transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        {label}
      </Link>
    </div>
  );
}
