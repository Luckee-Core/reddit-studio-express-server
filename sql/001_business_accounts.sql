-- Reddit Studio business account columns on shared Supabase (Instagram Studio tenancy).
-- Do NOT recreate business_accounts if Instagram Studio already created it.
-- Subreddit targets are configured in city-nonprofits-express, not here.

ALTER TABLE public.business_accounts
  ADD COLUMN IF NOT EXISTS reddit_username TEXT;

COMMENT ON COLUMN public.business_accounts.reddit_username IS
  'Connected Reddit username (OAuth); populated after reddit-studio connect';
