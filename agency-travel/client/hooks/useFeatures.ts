import { useQuery } from "@tanstack/react-query";
import { fetchCollection, resolveImageUrl } from "../lib/payload";

export interface FeatureItem {
  id: string;
  text: string;
  image?: { url?: string };
  imageUrl?: string;
  order?: number;
}

export interface BookingStepItem {
  id: string;
  num: string;
  title: string;
  description: string;
  order?: number;
}

export function useFeatures() {
  return useQuery<FeatureItem[]>({
    queryKey: ["features"],
    queryFn: async () => {
      const res = await fetchCollection<FeatureItem>("features", {
        limit: 100,
        sort: "order",
      });
      return res.docs;
    },
  });
}

export function useBookingSteps() {
  return useQuery<BookingStepItem[]>({
    queryKey: ["booking-steps"],
    queryFn: async () => {
      const res = await fetchCollection<BookingStepItem>("booking-steps", {
        limit: 100,
        sort: "order",
      });
      return res.docs;
    },
  });
}

export function getFeatureImageSrc(feature: FeatureItem): string {
  return resolveImageUrl(feature.image, feature.imageUrl);
}
