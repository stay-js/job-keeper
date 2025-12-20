export function truncateText(value: string, max: number) {
  return value.length > max ? value.slice(0, max) + '…' : value;
}