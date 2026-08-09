/**
 * Privacy-preserving anonymous analytics module.
 * Logs high-level tool usage events without capturing file contents, filenames, or user PII.
 */

export interface AnalyticsEvent {
  event: string;
  tool?: string;
  timestamp: number;
}

const STORAGE_KEY = "flip_analytics_events";

/**
 * Tracks an anonymous tool usage event in browser memory & localStorage.
 */
export function trackToolUsage(toolName: string) {
  if (typeof window === "undefined") return;

  try {
    const payload: AnalyticsEvent = {
      event: "tool_used",
      tool: toolName,
      timestamp: Date.now(),
    };

    // 1. Console log for development feedback
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics Event]", payload);
    }

    // 2. Persist aggregated event counts in localStorage
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    const events: AnalyticsEvent[] = existingRaw ? JSON.parse(existingRaw) : [];
    events.push(payload);

    // Keep last 100 anonymous events
    const trimmed = events.slice(-100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (err) {
    // Fail silently to preserve UI experience
  }
}

/**
 * Retrieves local anonymous tool usage statistics.
 */
export function getToolStats(): Record<string, number> {
  if (typeof window === "undefined") return {};

  try {
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    const events: AnalyticsEvent[] = existingRaw ? JSON.parse(existingRaw) : [];
    const stats: Record<string, number> = {};

    events.forEach((evt) => {
      if (evt.tool) {
        stats[evt.tool] = (stats[evt.tool] || 0) + 1;
      }
    });

    return stats;
  } catch (err) {
    return {};
  }
}
