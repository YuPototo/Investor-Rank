export function toPercent(num: number): string {
  return `${Math.round(num * 1000) / 10}%`;
}
