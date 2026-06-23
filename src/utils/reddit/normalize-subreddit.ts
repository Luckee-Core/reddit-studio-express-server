/**
 * Strips r/ prefix and lowercases subreddit name for Reddit API sr param.
 */
export const normalizeSubreddit = (subreddit: string): string => {
  const trimmed = subreddit.trim();
  if (!trimmed) return '';
  return trimmed.replace(/^r\//i, '').toLowerCase();
};
