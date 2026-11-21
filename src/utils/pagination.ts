/**
 * Turns the ?page value into a page number inside 1..totalPages.
 * Missing, non-numeric and fractional values fall back to a whole number,
 * values below 1 become 1 and values above the last page become the last page.
 */
export const getValidPage = (
  pageParam: string | null,
  totalPages: number,
): number => {
  const requestedPage = Math.trunc(Number(pageParam)) || 1;

  return Math.min(Math.max(requestedPage, 1), Math.max(totalPages, 1));
};
