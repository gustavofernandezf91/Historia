type AnalyticsEvent = {
  name: string;
  timestamp: number;
  payload?: Record<string, string | number | boolean>;
};

const STORAGE_KEY = "historiapp:events";

export function trackEvent(name: string, payload?: AnalyticsEvent["payload"]) {
  if (typeof window === "undefined") return;
  const event: AnalyticsEvent = {
    name,
    timestamp: Date.now(),
    payload,
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const events = raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
    events.push(event);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {}
}
