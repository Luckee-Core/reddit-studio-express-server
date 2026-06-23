const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Returns true when value looks like a UUID v4.
 */
export const isValidUuid = (value: string): boolean => UUID_RE.test(value.trim());
