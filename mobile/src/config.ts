// API base URL
export const API_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5050').replace(/\/$/, '');

export const SERIES = ['Pulse Pro', 'Pulse', 'Active', 'Lite', 'Trail', 'Classic'] as const;

// Same as web
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'best-selling', label: 'Best selling' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]['value'];

export const SPEC_LABELS: Record<string, string> = {
  caseSize: 'Case size',
  caseMaterial: 'Case material',
  strap: 'Strap',
  display: 'Display',
  battery: 'Battery',
  gps: 'GPS',
  waterResistance: 'Water resistance',
  connectivity: 'Connectivity',
  compatibility: 'Compatibility',
};
