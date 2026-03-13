import { useQuery } from "@tanstack/react-query";
import { fetchCollection, resolveImageUrl } from "../lib/payload";

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

const fallbackOffers: OfferItem[] = [
  {
    id: "fallback-istanbul",
    title: "Istanbul Escapade",
    destination: "Istanbul",
    country: "Turquie",
    region: "Turquie",
    shortDescription: "City break avec visites, hôtel et transferts inclus.",
    mainImageUrl: "/assets/figma/47915728ec2c232de145d04fe195c0cf46027056.jpg",
    flag: "🇹🇷",
    dates: "12 - 18 avril",
    startDate: "2026-04-12",
    duration: "7 jours",
    durationDays: 7,
    price: "145 000",
    tag: "Populaire",
    badge: "Disponible",
    badgeVariant: "info",
    status: "available",
    showOnHomepage: true,
    inclusions: [
      { item: "Vol aller / retour", icon: "plane" },
      { item: "Hôtel 4 étoiles", icon: "hotel" },
      { item: "Transfert aéroport", icon: "transfer" },
    ],
    hotels: [{ name: "Golden Horn Hotel" }],
  },
  {
    id: "fallback-dubai",
    title: "Dubai Signature",
    destination: "Dubai",
    country: "Émirats arabes unis",
    region: "Moyen-Orient",
    shortDescription: "Séjour premium avec hôtel, assistance et expériences iconiques.",
    mainImageUrl: "/assets/figma/41f508fbba5d9a76394c60f6d497d92a6820690a.jpg",
    flag: "🇦🇪",
    dates: "03 - 08 mai",
    startDate: "2026-05-03",
    duration: "6 jours",
    durationDays: 6,
    price: "198 000",
    tag: "Nouveau",
    badge: "Places limitées",
    badgeVariant: "warning",
    status: "almost-full",
    showOnHomepage: true,
    inclusions: [
      { item: "Vol aller / retour", icon: "plane" },
      { item: "Hôtel 5 étoiles", icon: "hotel" },
      { item: "Assistance sur place", icon: "assistance" },
    ],
    hotels: [{ name: "Marina Sky Resort" }],
  },
  {
    id: "fallback-cairo",
    title: "Le Caire & Pyramides",
    destination: "Le Caire",
    country: "Égypte",
    region: "Afrique",
    shortDescription: "Circuit culturel avec visites guidées et transport organisé.",
    mainImageUrl: "/assets/figma/e34c3efe581f3c46ab4d29d681117654609f65b9.jpg",
    flag: "🇪🇬",
    dates: "20 - 25 juin",
    startDate: "2026-06-20",
    duration: "6 jours",
    durationDays: 6,
    price: "132 000",
    tag: "Culture",
    badge: "Disponible",
    badgeVariant: "info",
    status: "available",
    showOnHomepage: true,
    inclusions: [
      { item: "Vol aller / retour", icon: "plane" },
      { item: "Hôtel au centre-ville", icon: "hotel" },
      { item: "Transport local", icon: "transfer" },
    ],
    hotels: [{ name: "Nile View Hotel" }],
  },
  {
    id: "fallback-kuala-lumpur",
    title: "Kuala Lumpur Discovery",
    destination: "Kuala Lumpur",
    country: "Malaisie",
    region: "Asie",
    shortDescription: "Voyage urbain avec shopping, découvertes et hôtel central.",
    mainImageUrl: "/assets/figma/59963752338377140a89306e9be22526a08262a9.jpg",
    flag: "🇲🇾",
    dates: "07 - 14 juillet",
    startDate: "2026-07-07",
    duration: "8 jours",
    durationDays: 8,
    price: "221 000",
    tag: "Tendance",
    badge: "Disponible",
    badgeVariant: "info",
    status: "available",
    showOnHomepage: false,
    inclusions: [
      { item: "Vol aller / retour", icon: "plane" },
      { item: "Hôtel 4 étoiles", icon: "hotel" },
      { item: "Assistance visa", icon: "assistance" },
    ],
    hotels: [{ name: "Bukit Bintang Suites" }],
  },
  {
    id: "fallback-rome",
    title: "Rome Classique",
    destination: "Rome",
    country: "Italie",
    region: "Europe",
    shortDescription: "Week-end prolongé entre patrimoine, gastronomie et hôtel bien situé.",
    mainImageUrl: "/assets/figma/7d83481de93cb3515133271899e0d62e56c401e5.jpg",
    flag: "🇮🇹",
    dates: "15 - 19 septembre",
    startDate: "2026-09-15",
    duration: "5 jours",
    durationDays: 5,
    price: "174 000",
    tag: "Europe",
    badge: "Disponible",
    badgeVariant: "info",
    status: "available",
    showOnHomepage: false,
    inclusions: [
      { item: "Vol aller / retour", icon: "plane" },
      { item: "Hôtel 4 étoiles", icon: "hotel" },
      { item: "Transfert aéroport", icon: "transfer" },
    ],
    hotels: [{ name: "Colosseo Central Inn" }],
  },
];

/**
 * Fetch all offers from the CMS. Optionally filter by region.
 * Pass `homepage: true` to only get offers marked for the homepage.
 */
export function useOffers(region?: string, opts?: { homepage?: boolean }) {
  return useQuery<OfferItem[]>({
    queryKey: ["offers", region, opts?.homepage ? "homepage" : "all"],
    queryFn: async () => {
      const getFallbackOffers = () =>
        fallbackOffers.filter((offer) => {
          if (region && region !== "Tout" && offer.region !== region) {
            return false;
          }

          if (opts?.homepage && !offer.showOnHomepage) {
            return false;
          }

          return true;
        });

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

        if (res.docs.length > 0) {
          return res.docs;
        }
      } catch (error) {
        console.warn("Offers CMS fetch failed, using fallback offers.", error);
      }

      return getFallbackOffers();
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
