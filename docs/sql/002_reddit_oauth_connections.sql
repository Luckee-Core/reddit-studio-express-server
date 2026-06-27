-- Reddit OAuth refresh tokens per business account

CREATE TABLE IF NOT EXISTS public.reddit_oauth_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_account_id UUID NOT NULL UNIQUE REFERENCES public.business_accounts (id) ON DELETE CASCADE,
  refresh_token TEXT NOT NULL,
  access_token TEXT,
  expires_at TIMESTAMPTZ,
  reddit_user_id TEXT,
  reddit_username TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reddit_oauth_connections_business_account_id
  ON public.reddit_oauth_connections (business_account_id);

COMMENT ON TABLE public.reddit_oauth_connections IS 'Reddit user OAuth tokens for publish (one row per business account)';
