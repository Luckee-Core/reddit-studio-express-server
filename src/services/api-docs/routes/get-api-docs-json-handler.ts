import type { Request, Response } from 'express';
import { processGetApiDocsJson } from '../process-get-api-docs-json';

/**
 * Handles GET /api-docs.json — returns the API documentation catalog (metadata only).
 */
export const getApiDocsJsonHandler = async (_req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api-docs.json');

  try {
    const catalog = processGetApiDocsJson();
    console.log('✅ GET /api-docs.json');
    res.status(200).json({ success: true, data: catalog });
  } catch (error) {
    console.error('❌ GET /api-docs.json', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};
