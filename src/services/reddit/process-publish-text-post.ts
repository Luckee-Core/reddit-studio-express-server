import type { SupabaseClient } from '@supabase/supabase-js';
import { getRedditUserAgent, normalizeSubreddit } from '../../utils/reddit';
import { upsertRedditOauthConnection } from '../../data/reddit-oauth-connections';
import { processRefreshRedditAccessToken } from './process-refresh-reddit-access-token';
import type { PublishTextPostInput, PublishTextPostResult } from './types';

type RedditSubmitResponse = {
  json?: {
    errors?: unknown[];
    data?: {
      id?: string;
      name?: string;
      url?: string;
    };
  };
};

/**
 * Submits a markdown self-post to Reddit for the given business account.
 */
export const processPublishTextPost = async (
  supabase: SupabaseClient,
  businessAccountId: string,
  input: PublishTextPostInput,
): Promise<PublishTextPostResult> => {
  const subreddit = normalizeSubreddit(input.subreddit);
  const title = input.title.trim();
  const text = input.text.trim();

  if (!subreddit) {
    return { success: false, error: 'subreddit is required' };
  }
  if (!title) {
    return { success: false, error: 'title is required' };
  }
  if (title.length > 300) {
    return { success: false, error: 'title must be 300 characters or fewer' };
  }
  if (!text) {
    return { success: false, error: 'text is required' };
  }

  const tokenResult = await processRefreshRedditAccessToken(supabase, businessAccountId);
  if (!tokenResult.ok) {
    return { success: false, error: tokenResult.error };
  }

  const body = new URLSearchParams({
    api_type: 'json',
    kind: 'self',
    sr: subreddit,
    title,
    text,
  });

  console.log('📥 [reddit.processPublishTextPost]', { subreddit, titleLength: title.length });

  const res = await fetch('https://oauth.reddit.com/api/submit', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokenResult.accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': getRedditUserAgent(),
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const errText = await res.text();
    return {
      success: false,
      error: `Reddit submit failed (${res.status}): ${errText.slice(0, 240)}`,
    };
  }

  const payload = (await res.json()) as RedditSubmitResponse;
  const errors = payload.json?.errors;
  if (errors && errors.length > 0) {
    return { success: false, error: `Reddit API error: ${JSON.stringify(errors)}` };
  }

  const data = payload.json?.data;
  const postId = data?.name || data?.id || '';
  const permalink = data?.url || '';

  if (!postId) {
    return { success: false, error: 'Reddit submit succeeded but post id was missing' };
  }

  console.log('✅ [reddit.processPublishTextPost]', { postId, permalink });
  return { success: true, postId, permalink };
};
