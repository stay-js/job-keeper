export function parseCultureInvariantFloat(value: string | null | undefined) {
  if (!value || value.trim() === '') return null;

  return Number(value.trim().replace(',', '.'));
}
