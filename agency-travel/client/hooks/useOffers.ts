import { useQuery } from "@tanstack/react-query";
import { fetchCollection, resolveImageUrl } from "../lib/payload";
import { getFallbackOfferDetails } from "../lib/fallback-content";

export interface OfferItem {
  id: string;
  title: string;
  slug?: string;
  destination: string;
  country: string;
  flag?: string; // Obsolete emoji flag
  flagMedia?: { url?: string };
  flagUrl?: string;
  region?: string;
  shortDescription?: string;
  mainImage?: { url?: string };
  mainImageUrl?: string;
  dates?: string;
  startDate?: string;
  duration?: string;
  durationDays?: number;
  price: string;
  tag?: string;
  badge?: string;
  badgeVariant?: "info" | "warning" | "danger";
  status?: string;
  inclusions?: Array<{ item: string; icon?: string }>;
  hotels?: Array<string | { id?: string; name?: string }>;
  showOnHomepage?: boolean;
}

/**
 * Fetch all offers from the CMS. Optionally filter by region.
 * Pass `homepage: true` to only get offers marked for the homepage.
 */
export function useOffers(region?: string, opts?: { homepage?: boolean }) {
  return useQuery<OfferItem[]>({
    queryKey: ["offers", region, opts?.homepage ? "homepage" : "all"],
    queryFn: async () => {
      const fallbackOffers = getFallbackOfferDetails({
        region,
        homepage: opts?.homepage,
      });
      const minimumCount = opts?.homepage ? 5 : 10;
      const mergeOffers = (cmsOffers: OfferItem[]) => {
        const seen = new Set(
          cmsOffers.map((offer) => offer.slug || offer.id || offer.title),
        );
        const merged = [...cmsOffers];

        for (const offer of fallbackOffers) {
          const key = offer.slug || offer.id || offer.title;
          if (seen.has(key)) {
            continue;
          }

          merged.push(offer);
          seen.add(key);

          if (merged.length >= minimumCount) {
            break;
          }
        }

        return merged;
      };

      try {
        const params: Record<string, string | number> = {
          limit: 100,
          depth: 1,
          sort: "createdAt",
        };
        if (region && region !== "Tout") {
          params["where[region][equals]"] = region;
        }
        if (opts?.homepage) {
          params["where[showOnHomepage][equals]"] = "true";
        }
        const res = await fetchCollection<OfferItem>("offers", params);
        return mergeOffers(res.docs);
      } catch (error) {
        console.warn("Offers CMS fetch failed, using fallback offers.", error);
      }

      return fallbackOffers;
    },
  });
}

/**
 * Helper: resolve the image src for an offer.
 */
export function getOfferImageSrc(offer: OfferItem): string {
  return resolveImageUrl(offer.mainImage, offer.mainImageUrl);
}

/**
 * Helper: resolve the flag image src for an offer.
 */
export function getOfferFlagSrc(offer: OfferItem): string {
  return resolveImageUrl(offer.flagMedia, offer.flagUrl);
}
