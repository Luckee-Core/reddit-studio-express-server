import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../managed';
import { isValidUuid } from '../../../utils/business-account';
import { processOauthCallback } from '../process-oauth-callback';

/**
 * GET /api/reddit/oauth/callback — Reddit OAuth redirect handler.
 */
export const getOauthCallbackHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 [reddit.getOauthCallbackHandler]');

  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Database client unavailable' });
    return;
  }

  const errorParam = typeof req.query.error === 'string' ? req.query.error : '';
  if (errorParam) {
    res.status(400).json({ success: false, error: `Reddit OAuth denied: ${errorParam}` });
    return;
  }

  const code = typeof req.query.code === 'string' ? req.query.code.trim() : '';
  const state = typeof req.query.state === 'string' ? req.query.state.trim() : '';

  if (!code) {
    res.status(400).json({ success: false, error: 'Missing OAuth code' });
    return;
  }
  if (!state || !isValidUuid(state)) {
    res.status(400).json({ success: false, error: 'Invalid OAuth state (business account id)' });
    return;
  }

  try {
    const result = await processOauthCallback(supabase, {
      businessAccountId: state,
      code,
    });

    if (!result.success) {
      console.error('❌ [reddit.getOauthCallbackHandler]', result.error);
      res.status(500).json({ success: false, error: result.error });
      return;
    }

    const webOrigin =
      process.env.NEWSLETTER_ADMIN_WEB_ORIGIN?.trim() ||
      process.env.CITY_NONPROFITS_WEB_ORIGIN?.trim() ||
      process.env.NEXT_PUBLIC_WEB_ORIGIN?.trim() ||
      'http://localhost:3000';
    const redirectTarget = `${webOrigin.replace(/\/$/, '')}/reddit?reddit_connected=1&username=${encodeURIComponent(result.redditUsername || '')}`;
    console.log('📤 [reddit.getOauthCallbackHandler] Success');
    res.redirect(redirectTarget);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('❌ [reddit.getOauthCallbackHandler]', msg);
    res.status(500).json({ success: false, error: msg });
  }
};
