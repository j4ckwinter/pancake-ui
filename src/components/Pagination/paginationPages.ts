export function paginationPages(page: number, pageCount: number) {
  const count = Number.isFinite(pageCount)
    ? Math.min(Number.MAX_SAFE_INTEGER, Math.max(0, Math.trunc(pageCount)))
    : 0;
  const current = count
    ? Math.min(count, Math.max(1, Math.trunc(Number.isFinite(page) ? page : 1)))
    : 0;
  const pages =
    count <= 7
      ? Array.from({ length: count }, (_, index) => index + 1)
      : [...new Set([1, current - 1, current, current + 1, count])]
          .filter((value) => value >= 1 && value <= count)
          .sort((left, right) => left - right);
  return { count, current, pages };
}
