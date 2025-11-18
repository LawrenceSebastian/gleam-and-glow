export function isJakartaDaytime() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60_000;

  // Jakarta is UTC+7
  const jkt = new Date(utc + 7 * 60_000 * 60);

  const hour = jkt.getHours();
  return hour >= 6 && hour < 18; // 06:00–17:59 is daytime
}

export function getJakartaTime() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60_000;
  return new Date(utc + 7 * 60_000 * 60);
}
