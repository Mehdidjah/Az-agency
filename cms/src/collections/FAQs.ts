import type { CollectionConfig } from "payload";

export const FAQs: CollectionConfig = {
  slug: "faqs",
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "order"],
    description:
      "Modifiez ici uniquement les questions et les reponses de la FAQ. Le slider visuel du passeport reste fixe dans le frontend et n'est pas editable depuis le CMS.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "question",
      type: "text",
      required: true,
      label: "Question",
    },
    {
      name: "answer",
      type: "textarea",
      required: true,
      label: "Réponse",
    },
    {
      name: "order",
      type: "number",
      label: "Ordre d'affichage",
      admin: { position: "sidebar" },
    },
  ],
};
