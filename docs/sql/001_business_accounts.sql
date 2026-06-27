-- Reddit Studio: add reddit_username to shared business_accounts (do not recreate table if it exists).

ALTER TABLE public.business_accounts
  ADD COLUMN IF NOT EXISTS reddit_username TEXT;

COMMENT ON COLUMN public.business_accounts.reddit_username IS
  'Connected Reddit username (OAuth); populated after reddit-studio connect';
