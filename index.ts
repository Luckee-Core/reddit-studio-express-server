import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT) || 3010;

const bootstrap = async (): Promise<void> => {
  console.log('🚀 Starting reddit-studio-express-server bootstrap');

  const { initManagedClients } = await import('./src/services/managed');
  await initManagedClients();

  const app = express();

  const { setupEarlyMiddleware } = await import('./src/services/middleware');
  setupEarlyMiddleware(app);

  const { createHealthRouter } = await import('./src/services/health');
  app.use('/', createHealthRouter());
  app.use('/api/health', createHealthRouter());

  const { createRedditRouter } = await import('./src/services/reddit');
  app.use('/api/reddit', createRedditRouter());

  const { createBusinessAccountDataRouter } = await import('./src/data/business-accounts');
  app.use('/api/data/business-account', createBusinessAccountDataRouter());

  const { createApiDocsRouter } = await import('./src/services/api-docs');
  app.use('/', createApiDocsRouter());
  console.log('✅ [bootstrap] API docs mounted at GET /api-docs.json');

  const { setupErrorHandling } = await import('./src/services/middleware');
  setupErrorHandling(app);

  const { startServer } = await import('./src/services/server');
  startServer(app, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
  });
};

bootstrap().catch((err) => {
  console.error('❌ [bootstrap] Failed to start server', err);
  process.exit(1);
});

export {};
