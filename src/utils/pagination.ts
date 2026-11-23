export const getValidPage = (
  pageParam: string | null,
  totalPages: number,
): number => {
  const requestedPage = Math.trunc(Number(pageParam)) || 1;

  return Math.min(Math.max(requestedPage, 1), Math.max(totalPages, 1));
};
