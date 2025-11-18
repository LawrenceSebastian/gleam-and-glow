// src/lib/bloom.js
export function todayKeyJKT() {
  // Get current time in Jakarta (WIB, UTC+7)
  const now = new Date();

  // Convert manually to JKT by adding +7 hours
  const jkt = new Date(now.getTime() + 7 * 60 * 60 * 1000);

  const y = jkt.getUTCFullYear();
  const m = String(jkt.getUTCMonth() + 1).padStart(2, "0");
  const d = String(jkt.getUTCDate()).padStart(2, "0");

  // YYYY-MM-DD key
  return `${y}-${m}-${d}`;
}


export function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}
