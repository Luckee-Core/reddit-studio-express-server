export type PublishTextPostInput = {
  subreddit: string;
  title: string;
  text: string;
};

export type PublishTextPostResult =
  | { success: true; postId: string; permalink: string }
  | { success: false; error: string };

export type RedditAccessTokenResult =
  | { ok: true; accessToken: string }
  | { ok: false; error: string };
