import type { Request, Response } from 'express';
import { getManagedSupabaseClient } from '../../services/managed';
import { selectBusinessAccountList } from './select-list';

/**
 * GET /api/data/business-account/list
 */
export const getListHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 [business-account.getListHandler]');
  const supabase = getManagedSupabaseClient();
  if (!supabase) {
    res.status(500).json({ success: false, error: 'Database client unavailable' });
    return;
  }

  try {
    const result = await selectBusinessAccountList(supabase);
    if ('error' in result) {
      res.status(500).json({ success: false, error: result.error });
      return;
    }

    const data = result.rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      label: row.label,
      redditUsername: row.reddit_username,
      sortOrder: row.sort_order,
    }));

    console.log('📤 [business-account.getListHandler] Success');
    res.status(200).json({ success: true, data });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('❌ [business-account.getListHandler]', msg);
    res.status(500).json({ success: false, error: msg });
  }
};
