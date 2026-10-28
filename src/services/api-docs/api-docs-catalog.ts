import type { ApiDocsCatalog, ApiDocsGroup } from './types';

const DEFAULT_PORT = 3010;
const ts = '2026-06-27T12:00:00.000Z';

const dataSuccess = { success: true, data: {} };
const dataError = { success: false, error: 'Error message' };
const envelopeResponses = [
  { status: 200, description: 'Success', example: dataSuccess },
  { status: 400, description: 'Validation error', example: dataError },
  { status: 500, description: 'Server error', example: dataError },
];

const buildOverviewGroup = (): ApiDocsGroup => ({
  name: 'Overview',
  description: [
    'REST API for Reddit Studio — business-account tenancy, Reddit OAuth connect, and markdown self-post publishing.',
    'Browser calls same-origin `/api/*` on the Next.js app; Next rewrites to this Express server (`EXPRESS_API_URL`).',
    'Data routes use `{ success: true, data }`. Publish uses flat `{ success: true, postId, permalink }`.',
    'Scoped routes require header `X-Business-Account-Id`. v1 has no auth on publish — local/trusted network only.',
  ].join('\n\n'),
  endpoints: [],
});

/**
 * Builds the full API documentation catalog for Reddit Studio Express.
 */
export const buildApiDocsCatalog = (): ApiDocsCatalog => {
  const portFromEnv = Number(process.env.PORT);
  const port = Number.isFinite(portFromEnv) && portFromEnv > 0 ? portFromEnv : DEFAULT_PORT;
  const baseUrl =
    process.env.PUBLIC_API_URL?.trim().replace(/\/$/, '') || `http://localhost:${port}`;

  const groups: ApiDocsGroup[] = [
    buildOverviewGroup(),
    {
      name: 'Health',
      description: 'Liveness probe.',
      endpoints: [
        {
          method: 'GET',
          path: '/api/health',
          summary: 'Health check',
          responses: [
            {
              status: 200,
              description: 'Server is running',
              example: {
                status: 'ok',
                message: 'Reddit Studio Express Server is running',
                timestamp: ts,
                environment: 'development',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'Business accounts',
      description: 'Tenant list for OAuth connect UI.',
      endpoints: [
        {
          method: 'GET',
          path: '/api/data/business-account/list',
          summary: 'List business accounts',
          responses: envelopeResponses,
        },
      ],
    },
    {
      name: 'Reddit OAuth',
      description: 'Connect a Reddit account once per business account.',
      endpoints: [
        {
          method: 'GET',
          path: '/api/reddit/oauth/start',
          summary: 'Start OAuth (browser redirect)',
          queryParams: [
            { name: 'businessAccountId', description: 'Business account UUID', required: true },
          ],
          responses: envelopeResponses,
        },
        {
          method: 'GET',
          path: '/api/reddit/oauth/start-url',
          summary: 'OAuth URL JSON for connect button',
          responses: [
            {
              status: 200,
              description: 'Authorization URL',
              example: { success: true, data: { url: 'https://www.reddit.com/api/v1/authorize?...' } },
            },
          ],
        },
        {
          method: 'GET',
          path: '/api/reddit/oauth/callback',
          summary: 'Reddit OAuth callback (redirects to web)',
          queryParams: [
            { name: 'code', description: 'OAuth authorization code', required: true },
            { name: 'state', description: 'Business account UUID', required: true },
          ],
          responses: [{ status: 302, description: 'Redirect to /settings-reddit', example: {} }],
        },
      ],
    },
    {
      name: 'Reddit scrape (Apify proxy)',
      description:
        'Same contract as reddit-scraper-express-server — used when free-reddit-scraper-web points REDDIT_SCRAPER_EXPRESS_URL at this host.',
      endpoints: [
        {
          method: 'POST',
          path: '/api/services/get-reddit-thread-data',
          summary: 'Scrape Reddit thread or listing via Apify',
          description: 'Requires header `x-scraper-api-key` matching `SCRAPER_API_KEY`.',
          requestBody: {
            contentType: 'application/json',
            example: { url: 'https://www.reddit.com/r/test/comments/abc123/title/', mode: 'thread' },
          },
          responses: envelopeResponses,
        },
      ],
    },
    {
      name: 'Reddit publish',
      description: 'Publish markdown self-posts via stored OAuth tokens.',
      endpoints: [
        {
          method: 'POST',
          path: '/api/reddit/publish-text-post',
          summary: 'Publish text post to subreddit',
          requestBody: {
            contentType: 'application/json',
            example: {
              subreddit: 'test',
              title: 'Hello',
              text: 'Markdown body',
            },
          },
          responses: [
            {
              status: 200,
              description: 'Published',
              example: {
                success: true,
                postId: 't3_abc123',
                permalink: 'https://www.reddit.com/r/test/comments/abc123/',
              },
            },
            { status: 400, description: 'Error', example: { success: false, error: 'Not connected' } },
          ],
        },
      ],
    },
  ];

  return {
    version: '1.0.0',
    baseUrl,
    responseEnvelope: 'data: { success, data } | publish: { success, postId?, permalink?, error? }',
    groups,
  };
};
