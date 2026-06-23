import { Router } from 'express';
import {
  getOauthCallbackHandler,
  getOauthStartHandler,
  getOauthStartUrlHandler,
  postPublishTextPostHandler,
} from './routes';

/**
 * Reddit OAuth and publish routes.
 */
export const createRedditRouter = (): Router => {
  const router = Router();
  router.get('/oauth/start', getOauthStartHandler);
  router.get('/oauth/start-url', getOauthStartUrlHandler);
  router.get('/oauth/callback', getOauthCallbackHandler);
  router.post('/publish-text-post', postPublishTextPostHandler);
  return router;
};
