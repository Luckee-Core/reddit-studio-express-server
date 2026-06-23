/**
 * Setup Early Middleware
 * Configures CORS, body parsing, and other early middleware
 */

import cors from 'cors';
import express, { Express } from 'express';

const isLocalDevOrigin = (origin: string): boolean =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

export const setupEarlyMiddleware = (app: Express): void => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.NEXT_PUBLIC_WEB_ORIGIN,
    process.env.CITY_NONPROFITS_WEB_ORIGIN,
    process.env.CITY_NONPROFITS_EXPRESS_ORIGIN,
  ].filter(Boolean) as string[];

  const isDev = process.env.NODE_ENV !== 'production';

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        if (isDev && isLocalDevOrigin(origin)) {
          callback(null, true);
          return;
        }
        callback(null, false);
      },
      allowedHeaders: ['Content-Type', 'X-Business-Account-Id'],
    }),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};
