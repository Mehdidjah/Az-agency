import { useQuery } from "@tanstack/react-query";
import { fetchCollection } from "../lib/payload";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order?: number;
}

const fallbackFaqs: FAQItem[] = [
  {
    id: "faq-1",
    question: "Quels documents faut-il pour réserver un voyage ?",
    answer:
      "Une copie du passeport, un numéro de téléphone joignable et le règlement de l'acompte suffisent pour lancer le dossier. L'équipe vous confirme ensuite les pièces éventuelles selon la destination.",
    order: 1,
  },
  {
    id: "faq-2",
    question: "Est-ce que le vol, l'hôtel et les transferts sont inclus ?",
    answer:
      "Oui, la plupart des offres affichées incluent le vol aller-retour, l'hôtel et les transferts. Les inclusions exactes sont reprises sur chaque offre avant confirmation.",
    order: 2,
  },
  {
    id: "faq-3",
    question: "Puis-je demander un voyage sur mesure ?",
    answer:
      "Oui. Le formulaire de voyage sur mesure permet d'indiquer la destination, le budget, les dates et le nombre de voyageurs pour recevoir une proposition adaptée.",
    order: 3,
  },
  {
    id: "faq-4",
    question: "Comment se passe la confirmation après la demande ?",
    answer:
      "Après l'envoi de la demande, l'agence reprend contact pour confirmer les disponibilités, le tarif final et les étapes de paiement avant émission.",
    order: 4,
  },
];

export function useFAQs() {
  return useQuery<FAQItem[]>({
    queryKey: ["faqs"],
    queryFn: async () => {
      try {
        const res = await fetchCollection<FAQItem>("faqs", {
          limit: 100,
          sort: "order",
        });

        if (res.docs.length > 0) {
          return res.docs;
        }
      } catch (error) {
        console.warn("FAQ CMS fetch failed, using fallback FAQs.", error);
      }

      return fallbackFaqs;
    },
  });
}
