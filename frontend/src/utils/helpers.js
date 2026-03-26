/**
 * PlaceIQ — shared utility helpers
 */

/** Round to N decimal places */
export const round = (n, d = 2) => Math.round(n * 10 ** d) / 10 ** d;

/** Format probability as percentage string */
export const fmtPct = (v, d = 1) => `${(v * 100).toFixed(d)}%`;

/** Clamp a value between min and max */
export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/** Sleep promise */
export const sleep = ms => new Promise(r => setTimeout(r, ms));

/** Risk colour for a probability value */
export const riskColor = p =>
  p >= 0.7 ? "#84cc16" :
  p >= 0.5 ? "#f59e0b" :
  p >= 0.3 ? "#f97316" : "#f43f5e";

/** Risk label */
export const riskLabel = p =>
  p >= 0.7 ? "High"     :
  p >= 0.5 ? "Medium"   :
  p >= 0.3 ? "At Risk"  : "Critical";

/** Tailwind badge class by risk */
export const riskBadgeClass = p =>
  p >= 0.7 ? "badge-volt"  :
  p >= 0.5 ? "badge-amber" : "badge-rose";

/** CGPA colour */
export const cgpaColor = cgpa =>
  cgpa >= 8 ? "#84cc16" :
  cgpa >= 7 ? "#0ea5e9" :
  cgpa >= 6 ? "#f59e0b" : "#f43f5e";

/** Stagger animation delay for lists */
export const stagger = (i, base = 0.04) => i * base;

/** Generate animation variants for framer-motion */
export const fadeUpVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

export const scaleInVariants = {
  hidden:  { opacity: 0, scale: 0.9 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { delay: i * 0.07, duration: 0.4, type: "spring", stiffness: 200 },
  }),
};

/** Format large numbers */
export const fmtNum = n => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
};

/** Truncate long strings */
export const truncate = (str, n = 24) =>
  str.length > n ? str.slice(0, n - 1) + "…" : str;

/** Deep clone */
export const clone = obj => JSON.parse(JSON.stringify(obj));

/** Debounce */
export function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
