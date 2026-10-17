export const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:5050").replace(/\/$/, "");

export const SERIES = ["Pulse Pro", "Pulse", "Active", "Lite", "Trail", "Classic"];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "best-selling", label: "Best selling" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];
