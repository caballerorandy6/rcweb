/**
 * Chunk plan for FILE_UPLOAD (TikTok Media Transfer Guide): chunks of 5-64 MB
 * uploaded in order, `total_chunk_count = floor(video_size / chunk_size)`,
 * and the trailing bytes merge into the last chunk (up to 128 MB). Files
 * under 5 MB go in one request with `chunk_size` equal to the file size.
 */

export const MIN_CHUNK_BYTES = 5 * 1024 * 1024;
export const MAX_CHUNK_BYTES = 64 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 4 * 1024 * 1024 * 1024;
const DEFAULT_CHUNK_BYTES = 10_000_000;

export type ChunkRange = { start: number; end: number };

export type ChunkPlan = {
  chunkSize: number;
  totalChunkCount: number;
  ranges: ChunkRange[];
};

export function planChunks(videoSize: number): ChunkPlan {
  if (!Number.isInteger(videoSize) || videoSize <= 0) {
    throw new Error("videoSize must be a positive integer");
  }
  if (videoSize > MAX_VIDEO_BYTES) {
    throw new Error("Video exceeds TikTok's 4 GB limit");
  }

  // Anything that does not fit at least one default chunk is sent whole.
  const chunkSize = videoSize < DEFAULT_CHUNK_BYTES ? videoSize : DEFAULT_CHUNK_BYTES;
  const totalChunkCount = Math.max(1, Math.floor(videoSize / chunkSize));

  const ranges: ChunkRange[] = [];
  for (let index = 0; index < totalChunkCount; index++) {
    const start = index * chunkSize;
    const end = index === totalChunkCount - 1 ? videoSize - 1 : start + chunkSize - 1;
    ranges.push({ start, end });
  }

  return { chunkSize, totalChunkCount, ranges };
}
