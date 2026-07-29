export function formatCalories(value: number): string {
  return Math.round(value).toString();
}

export function formatMacro(value: number): string {
  return value.toFixed(1);
}