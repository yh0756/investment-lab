export function decodeScenario<T>(value: string): T | null {
  try {
    return JSON.parse(decodeURIComponent(atob(value))) as T;
  } catch {
    return null;
  }
}
