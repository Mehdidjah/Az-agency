import { useQuery } from "@tanstack/react-query";
import { fetchCollection } from "../lib/payload";
import { fallbackFaqs } from "../lib/fallback-content";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order?: number;
}

export function useFAQs() {
  return useQuery<FAQItem[]>({
    queryKey: ["faqs"],
    queryFn: async () => {
      const mergeFaqs = (cmsFaqs: FAQItem[]) => {
        const seen = new Set(
          cmsFaqs.map((faq) => faq.question.trim().toLowerCase()),
        );
        const merged = [...cmsFaqs];

        for (const faq of fallbackFaqs) {
          const key = faq.question.trim().toLowerCase();
          if (seen.has(key)) {
            continue;
          }

          merged.push(faq);
          seen.add(key);
        }

        return merged
          .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER))
          .slice(0, fallbackFaqs.length);
      };

      try {
        const res = await fetchCollection<FAQItem>("faqs", {
          limit: 100,
          sort: "order",
        });
        return mergeFaqs(res.docs);
      } catch (error) {
        console.warn("FAQ CMS fetch failed, using fallback FAQs.", error);
      }

      return fallbackFaqs;
    },
  });
}
