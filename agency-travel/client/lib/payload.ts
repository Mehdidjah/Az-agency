/**
 * Payload CMS REST API client.
 *
 * Every public collection in Payload is exposed at:
 *   GET  {CMS_URL}/api/{collection}          → list
 *   GET  {CMS_URL}/api/{collection}/{id}     → single doc
 *
 * The response shape for lists is:
 *   { docs: T[], totalDocs, limit, page, totalPages, … }
 */

const CMS_ORIGIN =
  import.meta.env.VITE_CMS_URL?.replace(/\/$/, "") || "http://localhost:3001";
const CMS_API_BASE = import.meta.env.DEV ? "/cms-api" : `${CMS_ORIGIN}/api`;

const buildCMSApiUrl = (
  path: string,
  params?: Record<string, string | number | boolean>,
) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = `${CMS_API_BASE}${normalizedPath}`;

  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }

  const searchParams = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    searchParams.set(key, String(val));
  }

  return `${baseUrl}?${searchParams.toString()}`;
};

const cmsFetch = (input: string) =>
  fetch(input, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });

/* ── Generic fetcher ── */

interface PayloadListResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

export async function fetchGlobal<T>(
  globalSlug: string,
  params?: Record<string, string | number | boolean>,
): Promise<T> {
  const res = await cmsFetch(buildCMSApiUrl(`/globals/${globalSlug}`, params));
  if (!res.ok) throw new Error(`CMS fetch error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchCollection<T>(
  collection: string,
  params?: Record<string, string | number | boolean>,
): Promise<PayloadListResponse<T>> {
  const res = await cmsFetch(buildCMSApiUrl(`/${collection}`, params));
  if (!res.ok) throw new Error(`CMS fetch error: ${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchDocument<T>(
  collection: string,
  id: string,
): Promise<T> {
  const res = await cmsFetch(buildCMSApiUrl(`/${collection}/${id}`));
  if (!res.ok) throw new Error(`CMS fetch error: ${res.status} ${res.statusText}`);
  return res.json();
}

/**
 * Fetch by a field value (e.g. slug).
 * Payload where-query syntax: ?where[field][equals]=value
 */
export async function fetchByField<T>(
  collection: string,
  field: string,
  value: string,
): Promise<T | null> {
  const res = await cmsFetch(
    buildCMSApiUrl(`/${collection}`, {
      [`where[${field}][equals]`]: value,
      limit: 1,
      depth: 2,
    }),
  );
  if (!res.ok) throw new Error(`CMS fetch error: ${res.status} ${res.statusText}`);
  const data: PayloadListResponse<T> = await res.json();
  return data.docs[0] ?? null;
}

/* ── Image URL helper ── */

/**
 * Resolve an image URL from a Payload upload field or fallback text URL.
 */
export function resolveImageUrl(
  uploadField?: string | { url?: string } | null,
  fallbackUrl?: string,
): string {
  if (typeof uploadField === "string") {
    return fallbackUrl || "";
  }

  if (uploadField?.url) {
    // If the URL is relative, prepend the CMS URL
    return uploadField.url.startsWith("http")
      ? uploadField.url
      : `${CMS_ORIGIN}${uploadField.url}`;
  }
  return fallbackUrl || "";
}

/**
 * Resolve an array of gallery images (each may have upload or fallback URL).
 */
export function resolveGalleryUrls(
  items?: Array<{ image?: string | { url?: string } | null; imageUrl?: string }>,
): string[] {
  if (!items) return [];
  return items
    .map((item) => resolveImageUrl(item.image, item.imageUrl))
    .filter(Boolean);
}
