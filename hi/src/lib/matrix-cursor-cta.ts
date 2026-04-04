/** Mark card CTAs with this attribute so matrix/text cursors show the language label only there. */
export const MATRIX_CTA_SELECTOR = "[data-matrix-cta]";

export function closestMatrixCta(el: HTMLElement | null): HTMLElement | null {
  if (!el) return null;
  return el.closest(MATRIX_CTA_SELECTOR) as HTMLElement | null;
}
