"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import type { PrivacyLevel, PublishStatus, TikTokCreatorInfo, TikTokUserInfo } from "@/lib/tiktok/api";
import type { ChunkRange } from "@/lib/tiktok/chunks";
import {
  TIKTOK_BRANDED_CONTENT_POLICY_URL,
  TIKTOK_MUSIC_USAGE_URL,
  TIKTOK_TOOL_PATH,
} from "@/lib/tiktok/config";

/**
 * Direct Post form following TikTok's reviewed UX guidelines: creator info
 * fetched on every render, privacy chosen explicitly from the creator's
 * options, interaction toggles off by default, commercial content disclosure
 * and the consent line before the publish button.
 */

const API = `${TIKTOK_TOOL_PATH}/api`;
const ACCEPTED_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const STATUS_POLL_MS = 4000;
const STATUS_POLL_LIMIT = 90; // 6 minutes

const PRIVACY_LABELS: Record<string, string> = {
  PUBLIC_TO_EVERYONE: "Everyone",
  MUTUAL_FOLLOW_FRIENDS: "Friends",
  FOLLOWER_OF_CREATOR: "Followers",
  SELF_ONLY: "Only you",
};

const STATUS_LABELS: Record<string, string> = {
  PROCESSING_UPLOAD: "TikTok is processing the upload…",
  PROCESSING_DOWNLOAD: "TikTok is downloading the video…",
  SEND_TO_USER_INBOX: "Sent to your TikTok inbox to finish in the app.",
  PUBLISH_COMPLETE: "Published! It may take a few minutes to appear on your profile.",
  FAILED: "TikTok could not publish the video.",
};

const FAIL_REASONS: Record<string, string> = {
  file_format_check_failed: "Unsupported video format.",
  duration_check_failed: "The video is too long or too short for this account.",
  frame_rate_check_failed: "Unsupported frame rate.",
  picture_size_check_failed: "Unsupported resolution.",
  internal: "Temporary TikTok error. Please try again in a moment.",
  auth_removed: "Access was revoked while publishing. Reconnect and try again.",
  spam_risk_too_many_posts: "Daily posting limit reached for this account.",
  spam_risk_user_banned_from_posting: "This account is not allowed to post right now.",
  spam_risk_text: "TikTok flagged the caption. Edit it and try again.",
  spam_risk: "TikTok flagged this request. Try again later.",
};

type Account = { user: TikTokUserInfo; creator: TikTokCreatorInfo };
type ApiError = { error: { code: string; message: string } };

function isApiError(body: unknown): body is ApiError {
  return typeof body === "object" && body !== null && "error" in body;
}

async function readJson<T>(response: Response): Promise<T> {
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok || body === null) {
    if (isApiError(body)) throw new PublisherError(body.error.code, body.error.message);
    throw new PublisherError("http_error", `Request failed (${response.status}).`);
  }
  return body as T;
}

class PublisherError extends Error {
  constructor(
    public readonly code: string,
    message: string
  ) {
    super(message);
  }
}

export default function TikTokPublisher() {
  const router = useRouter();
  const [account, setAccount] = useState<Account | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API}/me`, { cache: "no-store" })
      .then((response) => readJson<Account>(response))
      .then((data) => {
        if (!cancelled) setAccount(data);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof PublisherError && error.code === "not_connected") {
          router.refresh();
          return;
        }
        setLoadError(error instanceof Error ? error.message : "Could not load your TikTok account.");
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  const disconnect = async () => {
    setDisconnecting(true);
    try {
      await fetch(`${API}/disconnect`, { method: "POST" });
    } finally {
      router.refresh();
    }
  };

  if (loadError) {
    return (
      <div className="font-inter text-center">
        <p role="alert" className="text-red-300">
          {loadError}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="secondary" onClick={() => router.refresh()}>
            Try again
          </Button>
          <Button variant="danger" onClick={disconnect} disabled={disconnecting}>
            Disconnect
          </Button>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <p className="font-inter text-gray-300 text-center" role="status">
        <ArrowPathIcon className="inline w-5 h-5 animate-spin mr-2" aria-hidden="true" />
        Loading your TikTok account…
      </p>
    );
  }

  const { user, creator } = account;
  const name = creator.creator_nickname || user.display_name || "TikTok creator";
  const avatar = creator.creator_avatar_url || user.avatar_url_100 || user.avatar_url;

  return (
    <div className="font-inter">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold/10 pb-6">
        <div className="flex items-center gap-4">
          {avatar ? (
            <Image
              src={avatar}
              alt=""
              width={56}
              height={56}
              unoptimized
              className="h-14 w-14 rounded-full border border-gold/30 object-cover"
            />
          ) : (
            <div className="h-14 w-14 rounded-full bg-gray-800 border border-gold/30" aria-hidden="true" />
          )}
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">Posting as</p>
            <p className="text-lg font-semibold text-white">{name}</p>
            {creator.creator_username ? (
              <p className="text-sm text-gray-400">@{creator.creator_username}</p>
            ) : null}
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={disconnect} disabled={disconnecting}>
          {disconnecting ? "Disconnecting…" : "Disconnect"}
        </Button>
      </div>

      <PublishForm creator={creator} />
    </div>
  );
}

type Phase =
  | { kind: "idle" }
  | { kind: "uploading"; uploadedBytes: number; totalBytes: number }
  | { kind: "polling"; publishId: string; status: PublishStatus | null }
  | { kind: "done"; status: PublishStatus }
  | { kind: "error"; message: string };

function PublishForm({ creator }: { creator: TikTokCreatorInfo }) {
  const [title, setTitle] = useState("");
  const [privacy, setPrivacy] = useState<PrivacyLevel | "">("");
  const [allowComment, setAllowComment] = useState(false);
  const [allowDuet, setAllowDuet] = useState(false);
  const [allowStitch, setAllowStitch] = useState(false);
  const [commercial, setCommercial] = useState(false);
  const [yourBrand, setYourBrand] = useState(false);
  const [brandedContent, setBrandedContent] = useState(false);
  const [privacyNote, setPrivacyNote] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const maxDuration = creator.max_video_post_duration_sec;
  const privacyOptions = creator.privacy_level_options;
  const busy = phase.kind === "uploading" || phase.kind === "polling";

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0] ?? null;
    setFile(next);
    setDuration(null);
    setFileError(null);
    setPreviewUrl(next ? URL.createObjectURL(next) : null);
    if (next && next.type && !ACCEPTED_TYPES.includes(next.type)) {
      setFileError("Choose an MP4, MOV or WebM video.");
    }
  };

  const onMetadata = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const seconds = event.currentTarget.duration;
    if (!Number.isFinite(seconds)) return;
    setDuration(seconds);
    if (maxDuration && seconds > maxDuration) {
      setFileError(
        `This video is ${formatSeconds(seconds)} long; this account can post up to ${formatSeconds(maxDuration)}.`
      );
    }
  };

  const onBrandedContentChange = (checked: boolean) => {
    setBrandedContent(checked);
    if (checked && privacy === "SELF_ONLY") {
      setPrivacy("");
      setPrivacyNote("Branded content cannot be private. Please choose another audience.");
    } else {
      setPrivacyNote(null);
    }
  };

  const commercialIncomplete = commercial && !yourBrand && !brandedContent;
  const canPublish =
    !busy && !!file && !fileError && !!privacy && !commercialIncomplete && duration !== null;

  const publishBlockedReason = commercialIncomplete
    ? "You need to indicate if your content promotes yourself, a third party, or both."
    : !file
      ? "Choose a video to publish."
      : fileError
        ? fileError
        : !privacy
          ? "Choose who can view this video."
          : null;

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canPublish || !file || !privacy) return;

    try {
      setPhase({ kind: "uploading", uploadedBytes: 0, totalBytes: file.size });
      const init = await readJson<{ publishId: string; uploadUrl: string; ranges: ChunkRange[] }>(
        await fetch(`${API}/publish/init`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim() || undefined,
            privacyLevel: privacy,
            allowComment,
            allowDuet,
            allowStitch,
            commercialContent: commercial,
            yourBrand: commercial && yourBrand,
            brandedContent: commercial && brandedContent,
            videoSize: file.size,
          }),
        })
      );

      for (const range of init.ranges) {
        const chunk = file.slice(range.start, range.end + 1);
        const response = await fetch(init.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type || "video/mp4",
            "Content-Range": `bytes ${range.start}-${range.end}/${file.size}`,
          },
          body: chunk,
        });
        if (!response.ok) {
          throw new PublisherError("upload_failed", `TikTok rejected a chunk (HTTP ${response.status}).`);
        }
        setPhase({ kind: "uploading", uploadedBytes: range.end + 1, totalBytes: file.size });
      }

      setPhase({ kind: "polling", publishId: init.publishId, status: null });
      await pollStatus(init.publishId, (status) => setPhase({ kind: "polling", publishId: init.publishId, status }))
        .then((status) => setPhase({ kind: "done", status }));
    } catch (error) {
      setPhase({
        kind: "error",
        message: error instanceof Error ? error.message : "Publishing failed. Please try again.",
      });
    }
  };

  const reset = () => {
    setPhase({ kind: "idle" });
    setFile(null);
    setPreviewUrl(null);
    setDuration(null);
    setFileError(null);
    setTitle("");
    setPrivacy("");
    setAllowComment(false);
    setAllowDuet(false);
    setAllowStitch(false);
    setCommercial(false);
    setYourBrand(false);
    setBrandedContent(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (privacyOptions.length === 0) {
    return (
      <p role="alert" className="mt-6 text-amber-200">
        This account cannot post right now. Please try again later.
      </p>
    );
  }

  const inputClasses =
    "mt-2 block w-full rounded-xl border border-gold/20 bg-gray-800/60 px-4 py-3 text-white placeholder:text-gray-500 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40 disabled:opacity-60";
  const checkboxClasses =
    "h-5 w-5 rounded border-gold/40 bg-gray-800 text-gold focus:ring-gold/40 disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-8" aria-busy={busy}>
      {/* Video */}
      <div>
        <label htmlFor="tiktok-video" className="block text-sm font-semibold text-white">
          Video
        </label>
        <p className="mt-1 text-sm text-gray-400">
          MP4, MOV or WebM.
          {maxDuration ? ` Up to ${formatSeconds(maxDuration)} for this account.` : ""}
        </p>
        <input
          ref={fileInputRef}
          id="tiktok-video"
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={onFileChange}
          disabled={busy}
          className="mt-3 block w-full text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-gold/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gold hover:file:bg-gold/30"
        />
        {previewUrl && (
          <div className="mt-4">
            <video
              src={previewUrl}
              controls
              playsInline
              onLoadedMetadata={onMetadata}
              className="max-h-96 w-full rounded-xl border border-gold/10 bg-black"
            />
            {file && (
              <p className="mt-2 text-xs text-gray-400">
                {file.name} · {formatBytes(file.size)}
                {duration !== null ? ` · ${formatSeconds(duration)}` : ""}
              </p>
            )}
          </div>
        )}
        {fileError && (
          <p role="alert" className="mt-2 text-sm text-red-300">
            {fileError}
          </p>
        )}
      </div>

      {/* Title */}
      <div>
        <label htmlFor="tiktok-title" className="block text-sm font-semibold text-white">
          Caption
        </label>
        <textarea
          id="tiktok-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={2200}
          rows={3}
          disabled={busy}
          placeholder="Write a caption, add #hashtags or @mentions"
          className={inputClasses}
        />
        <p className="mt-1 text-right text-xs text-gray-500">{title.length}/2200</p>
      </div>

      {/* Privacy */}
      <div>
        <label htmlFor="tiktok-privacy" className="block text-sm font-semibold text-white">
          Who can view this video
        </label>
        <select
          id="tiktok-privacy"
          value={privacy}
          onChange={(event) => {
            setPrivacy(event.target.value as PrivacyLevel | "");
            setPrivacyNote(null);
          }}
          required
          disabled={busy}
          className={inputClasses}
        >
          <option value="" disabled>
            Select an audience
          </option>
          {privacyOptions.map((option) => {
            const isPrivate = option === "SELF_ONLY";
            const blocked = isPrivate && commercial && brandedContent;
            return (
              <option
                key={option}
                value={option}
                disabled={blocked}
                title={blocked ? "Branded content visibility cannot be set to private." : undefined}
              >
                {PRIVACY_LABELS[option] || option}
                {blocked ? " (not available for branded content)" : ""}
              </option>
            );
          })}
        </select>
        {privacyNote && <p className="mt-2 text-sm text-amber-200">{privacyNote}</p>}
      </div>

      {/* Interactions */}
      <fieldset>
        <legend className="text-sm font-semibold text-white">Allow users to</legend>
        <div className="mt-3 flex flex-wrap gap-6">
          <CheckboxField
            id="tiktok-comment"
            label="Comment"
            checked={allowComment}
            onChange={setAllowComment}
            disabled={busy || creator.comment_disabled}
            hint={creator.comment_disabled ? "Comments are turned off in your TikTok settings." : undefined}
            className={checkboxClasses}
          />
          <CheckboxField
            id="tiktok-duet"
            label="Duet"
            checked={allowDuet}
            onChange={setAllowDuet}
            disabled={busy || creator.duet_disabled}
            hint={creator.duet_disabled ? "Duets are turned off in your TikTok settings." : undefined}
            className={checkboxClasses}
          />
          <CheckboxField
            id="tiktok-stitch"
            label="Stitch"
            checked={allowStitch}
            onChange={setAllowStitch}
            disabled={busy || creator.stitch_disabled}
            hint={creator.stitch_disabled ? "Stitches are turned off in your TikTok settings." : undefined}
            className={checkboxClasses}
          />
        </div>
      </fieldset>

      {/* Commercial content disclosure */}
      <fieldset className="rounded-xl border border-gold/10 bg-gray-800/40 p-4">
        <legend className="sr-only">Disclose video content</legend>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white">Disclose video content</p>
            <p className="mt-1 text-sm text-gray-400">
              Turn on to disclose that this video promotes goods or services in exchange for
              something of value. Your video could promote yourself, a third party, or both.
            </p>
          </div>
          <label className="relative inline-flex shrink-0 cursor-pointer items-center">
            <input
              type="checkbox"
              role="switch"
              aria-checked={commercial}
              checked={commercial}
              onChange={(event) => {
                const on = event.target.checked;
                setCommercial(on);
                if (!on) {
                  setYourBrand(false);
                  onBrandedContentChange(false);
                }
              }}
              disabled={busy}
              className="peer sr-only"
            />
            <span className="h-6 w-11 rounded-full bg-gray-600 transition peer-checked:bg-gold peer-focus-visible:ring-2 peer-focus-visible:ring-gold/60" />
            <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
            <span className="sr-only">Disclose commercial content</span>
          </label>
        </div>

        {commercial && (
          <div className="mt-4 space-y-4 border-t border-gold/10 pt-4">
            <CheckboxField
              id="tiktok-your-brand"
              label="Your brand"
              description="You are promoting yourself or your own business. This video will be classified as Brand Organic."
              checked={yourBrand}
              onChange={setYourBrand}
              disabled={busy}
              className={checkboxClasses}
            />
            <CheckboxField
              id="tiktok-branded-content"
              label="Branded content"
              description="You are promoting another brand or a third party. This video will be classified as Branded Content."
              checked={brandedContent}
              onChange={onBrandedContentChange}
              disabled={busy}
              className={checkboxClasses}
            />
            {commercialIncomplete ? (
              <p className="text-sm text-amber-200">
                You need to indicate if your content promotes yourself, a third party, or both.
              </p>
            ) : (
              <p className="text-sm text-gray-300">
                {brandedContent
                  ? "Your video will be labeled as “Paid partnership”."
                  : "Your video will be labeled as “Promotional content”."}
              </p>
            )}
          </div>
        )}
      </fieldset>

      {/* Consent */}
      <p className="text-sm text-gray-300">
        By posting, you agree to TikTok&apos;s{" "}
        {commercial && brandedContent && (
          <>
            <a
              href={TIKTOK_BRANDED_CONTENT_POLICY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline underline-offset-2"
            >
              Branded Content Policy
            </a>{" "}
            and{" "}
          </>
        )}
        <a
          href={TIKTOK_MUSIC_USAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold underline underline-offset-2"
        >
          Music Usage Confirmation
        </a>
        .
      </p>

      {/* Publish */}
      {phase.kind === "idle" || phase.kind === "error" ? (
        <div>
          {phase.kind === "error" && (
            <p role="alert" className="mb-4 flex items-start gap-2 text-sm text-red-300">
              <XCircleIcon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              {phase.message}
            </p>
          )}
          <span className="inline-block" title={publishBlockedReason ?? undefined}>
            <Button type="submit" size="lg" disabled={!canPublish}>
              Publish to TikTok
            </Button>
          </span>
          {publishBlockedReason && (
            <p className="mt-2 text-xs text-gray-500">{publishBlockedReason}</p>
          )}
        </div>
      ) : (
        <PublishProgress phase={phase} onReset={reset} />
      )}
    </form>
  );
}

function PublishProgress({ phase, onReset }: { phase: Phase; onReset: () => void }) {
  if (phase.kind === "uploading") {
    const percent = Math.round((phase.uploadedBytes / phase.totalBytes) * 100);
    return (
      <div role="status" aria-live="polite">
        <p className="text-sm text-gray-300">
          Uploading to TikTok… {percent}% ({formatBytes(phase.uploadedBytes)} of {formatBytes(phase.totalBytes)})
        </p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-700">
          <div className="h-full bg-gold transition-[width]" style={{ width: `${percent}%` }} />
        </div>
      </div>
    );
  }

  if (phase.kind === "polling") {
    const status = phase.status?.status;
    return (
      <div role="status" aria-live="polite" className="text-sm text-gray-300">
        <p className="flex items-center gap-2">
          <ArrowPathIcon className="h-5 w-5 animate-spin text-gold" aria-hidden="true" />
          {status ? STATUS_LABELS[status] || status : "Upload complete. Waiting for TikTok…"}
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Processing may take a few minutes; the post can take that long to appear on your profile.
          Publish ID: {phase.publishId}
        </p>
      </div>
    );
  }

  if (phase.kind === "done") {
    const failed = phase.status.status === "FAILED";
    const reason = phase.status.fail_reason;
    const postIds = phase.status.publicaly_available_post_id ?? [];
    return (
      <div role="status" aria-live="polite">
        <p className={`flex items-start gap-2 text-sm ${failed ? "text-red-300" : "text-green-300"}`}>
          {failed ? (
            <XCircleIcon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          ) : (
            <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          )}
          <span>
            {STATUS_LABELS[phase.status.status] || phase.status.status}
            {failed && reason ? ` ${FAIL_REASONS[reason] || reason}` : ""}
          </span>
        </p>
        {!failed && postIds.length > 0 && (
          <p className="mt-2 text-xs text-gray-500">Post ID: {postIds.join(", ")}</p>
        )}
        {!failed && postIds.length === 0 && (
          <p className="mt-2 text-xs text-gray-500">
            Public posts go through moderation first; the post ID appears once it is approved.
          </p>
        )}
        <div className="mt-6">
          <Button variant="secondary" onClick={onReset}>
            Publish another video
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

function CheckboxField({
  id,
  label,
  description,
  hint,
  checked,
  onChange,
  disabled,
  className,
}: {
  id: string;
  label: string;
  description?: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className: string;
}) {
  return (
    <div className="flex items-start gap-3" title={hint}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        disabled={disabled}
        aria-describedby={description || hint ? `${id}-description` : undefined}
        className={`mt-0.5 ${className}`}
      />
      <div>
        <label htmlFor={id} className={`text-sm ${disabled ? "text-gray-500" : "text-white"}`}>
          {label}
        </label>
        {(description || hint) && (
          <p id={`${id}-description`} className="mt-0.5 text-xs text-gray-400">
            {hint || description}
          </p>
        )}
      </div>
    </div>
  );
}

async function pollStatus(publishId: string, onUpdate: (status: PublishStatus) => void): Promise<PublishStatus> {
  for (let attempt = 0; attempt < STATUS_POLL_LIMIT; attempt++) {
    const status = await readJson<PublishStatus>(
      await fetch(`${API}/publish/status?publishId=${encodeURIComponent(publishId)}`, { cache: "no-store" })
    );
    onUpdate(status);
    if (status.status === "PUBLISH_COMPLETE" || status.status === "FAILED") return status;
    await new Promise((resolve) => setTimeout(resolve, STATUS_POLL_MS));
  }
  throw new PublisherError(
    "status_timeout",
    "TikTok is still processing the video. Check your profile in a few minutes."
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatSeconds(seconds: number): string {
  const whole = Math.round(seconds);
  const minutes = Math.floor(whole / 60);
  const rest = whole % 60;
  return minutes > 0 ? `${minutes} min ${rest} s` : `${rest} s`;
}
