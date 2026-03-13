import { useQuery } from "@tanstack/react-query";
import { fetchCollection, resolveImageUrl } from "../lib/payload";

export interface DestinationItem {
  id: string;
  name: string;
  country: string;
  slug?: string;
  image?: { url?: string };
  imageUrl?: string;
  category: string;
  cardDescription?: string;
  cardTags?: Array<{ label: string }>;
  href?: string;
}

export function useDestinations() {
  return useQuery<DestinationItem[]>({
    queryKey: ["destinations"],
    queryFn: async () => {
      const res = await fetchCollection<DestinationItem>("destinations", { limit: 100 });
      return res.docs;
    },
  });
}

export function getDestinationImageSrc(dest: DestinationItem): string {
  return resolveImageUrl(dest.image, dest.imageUrl);
}
