/**
 * Reddit API requires a descriptive User-Agent.
 * Override with REDDIT_USER_AGENT in env if needed.
 */
export const getRedditUserAgent = (): string =>
  process.env.REDDIT_USER_AGENT?.trim() ||
  'web:reddit-studio-express-server:1.0.0 (by /u/reddit-studio)';
