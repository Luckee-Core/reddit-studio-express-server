import type { Request, Response } from 'express';
import { requireBusinessAccountIdFromRequest } from '../../../utils/business-account';
import { getRedditUserAgent } from '../../../utils/reddit';

const OAUTH_SCOPES = ['identity', 'read', 'submit'].join(' ');

/**
 * GET /api/reddit/oauth/start — redirect to Reddit authorize URL.
 */
export const getOauthStartHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 [reddit.getOauthStartHandler]');

  const businessAccount = requireBusinessAccountIdFromRequest(req);
  if (!businessAccount.ok) {
    res.status(400).json({ success: false, error: businessAccount.error });
    return;
  }

  const clientId = process.env.REDDIT_CLIENT_ID?.trim();
  const redirectUri = process.env.REDDIT_OAUTH_REDIRECT_URI?.trim();
  if (!clientId || !redirectUri) {
    res.status(500).json({
      success: false,
      error: 'REDDIT_CLIENT_ID and REDDIT_OAUTH_REDIRECT_URI must be configured',
    });
    return;
  }

  const state = businessAccount.businessAccountId;
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    state,
    redirect_uri: redirectUri,
    duration: 'permanent',
    scope: OAUTH_SCOPES,
  });

  const authorizeUrl = `https://www.reddit.com/api/v1/authorize?${params.toString()}`;
  console.log('📤 [reddit.getOauthStartHandler] Redirect');
  res.redirect(authorizeUrl);
};

/**
 * GET /api/reddit/oauth/start-url — returns authorize URL JSON (for SPA redirect).
 */
export const getOauthStartUrlHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 [reddit.getOauthStartUrlHandler]');

  const businessAccount = requireBusinessAccountIdFromRequest(req);
  if (!businessAccount.ok) {
    res.status(400).json({ success: false, error: businessAccount.error });
    return;
  }

  const clientId = process.env.REDDIT_CLIENT_ID?.trim();
  const redirectUri = process.env.REDDIT_OAUTH_REDIRECT_URI?.trim();
  if (!clientId || !redirectUri) {
    res.status(500).json({
      success: false,
      error: 'REDDIT_CLIENT_ID and REDDIT_OAUTH_REDIRECT_URI must be configured',
    });
    return;
  }

  const state = businessAccount.businessAccountId;
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    state,
    redirect_uri: redirectUri,
    duration: 'permanent',
    scope: OAUTH_SCOPES,
  });

  const authorizeUrl = `https://www.reddit.com/api/v1/authorize?${params.toString()}&user_agent=${encodeURIComponent(getRedditUserAgent())}`;

  res.status(200).json({ success: true, data: { authorizeUrl } });
};
