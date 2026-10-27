import { getUserInfo, queryCreatorInfo } from "@/lib/tiktok/api";
import { withTikTokSession } from "@/lib/tiktok/handler";

/**
 * Identity (user.info.basic) plus the creator info TikTok requires before
 * every post form render: privacy options, interaction flags and limits.
 */
export async function GET() {
  return withTikTokSession(async (session) => {
    const [user, creator] = await Promise.all([
      getUserInfo(session.accessToken),
      queryCreatorInfo(session.accessToken),
    ]);
    return { user, creator };
  });
}
