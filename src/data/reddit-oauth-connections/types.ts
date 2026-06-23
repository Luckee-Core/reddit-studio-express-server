export type RedditOauthConnectionRow = {
  id: string;
  business_account_id: string;
  refresh_token: string;
  access_token: string | null;
  expires_at: string | null;
  reddit_user_id: string | null;
  reddit_username: string | null;
  created_at: string;
  updated_at: string;
};

export type UpsertRedditOauthConnectionInput = {
  businessAccountId: string;
  refreshToken: string;
  accessToken?: string | null;
  expiresAt?: string | null;
  redditUserId?: string | null;
  redditUsername?: string | null;
};
