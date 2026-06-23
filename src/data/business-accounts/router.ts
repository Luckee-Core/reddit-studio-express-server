import { Router } from 'express';
import { getListHandler } from './get-list-handler';

/**
 * Business account metadata (no OAuth tokens).
 */
export const createBusinessAccountDataRouter = (): Router => {
  const router = Router();
  router.get('/list', getListHandler);
  return router;
};
