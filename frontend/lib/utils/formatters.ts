export function formatMetricValue(value: number, precision = 2) {
  return Number(value.toFixed(precision)).toLocaleString();
}
