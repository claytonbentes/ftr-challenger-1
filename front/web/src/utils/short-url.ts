import { APP_URL } from "./constants";

export function getShortUrl(slug: string) {
  return `${APP_URL}/${slug}`;
}