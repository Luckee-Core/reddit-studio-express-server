import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../managed';
import { requireBusinessAccountIdFromRequest } from '../../../utils/business-account';
import { processPublishTextPost } from '../process-publish-text-post';

type PublishTextPostBody = {
  subreddit?: unknown;
  title?: unknown;
  text?: unknown;
};

/**
 * POST /api/reddit/publish-text-post
 */
export const postPublishTextPostHandler = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 [reddit.postPublishTextPostHandler]');

  const businessAccount = requireBusinessAccountIdFromRequest(req);
  if (!businessAccount.ok) {
    res.status(400).json({ success: false, error: businessAccount.error });
    return;
  }

  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Database client unavailable' });
    return;
  }

  const body = (req.body || {}) as PublishTextPostBody;
  const subreddit = typeof body.subreddit === 'string' ? body.subreddit : '';
  const title = typeof body.title === 'string' ? body.title : '';
  const text = typeof body.text === 'string' ? body.text : '';

  try {
    const result = await processPublishTextPost(supabase, businessAccount.businessAccountId, {
      subreddit,
      title,
      text,
    });

    if (!result.success) {
      console.error('❌ [reddit.postPublishTextPostHandler]', result.error);
      res.status(500).json({ success: false, error: result.error });
      return;
    }

    console.log('📤 [reddit.postPublishTextPostHandler] Success');
    res.status(200).json({
      success: true,
      postId: result.postId,
      permalink: result.permalink,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('❌ [reddit.postPublishTextPostHandler]', msg);
    res.status(500).json({ success: false, error: msg });
  }
};
