export const SITE_URL = "https://ethanogrady.com";

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}
