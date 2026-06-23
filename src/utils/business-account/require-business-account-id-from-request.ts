import type { Request } from 'express';
import { BUSINESS_ACCOUNT_ID_HEADER } from './business-account-id-header';
import { isValidUuid } from './is-valid-uuid';

export type RequireBusinessAccountIdResult =
  | { ok: true; businessAccountId: string }
  | { ok: false; error: string };

/**
 * Parses and validates `X-Business-Account-Id` from an Express request.
 */
export const requireBusinessAccountIdFromRequest = (
  req: Request,
): RequireBusinessAccountIdResult => {
  const raw = req.header(BUSINESS_ACCOUNT_ID_HEADER);
  const businessAccountId = typeof raw === 'string' ? raw.trim() : '';
  if (!businessAccountId) {
    return { ok: false, error: `${BUSINESS_ACCOUNT_ID_HEADER} header is required` };
  }
  if (!isValidUuid(businessAccountId)) {
    return { ok: false, error: `${BUSINESS_ACCOUNT_ID_HEADER} must be a valid UUID` };
  }
  return { ok: true, businessAccountId };
};
