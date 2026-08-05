export function encodeScenario(value: unknown): string {
  const encoded = encodeURIComponent(JSON.stringify(value));
  return btoa(encoded);
}

export function decodeScenario<T>(value: string): T | null {
  try {
    return JSON.parse(decodeURIComponent(atob(value))) as T;
  } catch {
    return null;
  }
}

export async function copyScenarioUrl(value: unknown): Promise<void> {
  const url = new URL(window.location.href);
  url.searchParams.set("s", encodeScenario(value));
  await navigator.clipboard.writeText(url.toString());
}
