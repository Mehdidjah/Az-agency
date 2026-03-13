import type { CollectionConfig } from "payload";

export const Destinations: CollectionConfig = {
  slug: "destinations",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "country", "category"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Nom",
    },
    {
      name: "country",
      type: "text",
      required: true,
      label: "Pays (filtre listing)",
      admin: {
        description: "Doit correspondre au champ country des offres, ex: Turquie",
      },
    },
    {
      name: "slug",
      type: "text",
      unique: true,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Image",
    },
    {
      name: "imageUrl",
      type: "text",
      label: "Image URL (fallback)",
    },
    {
      name: "category",
      type: "select",
      required: true,
      label: "Catégorie",
      options: [
        { label: "Turquie", value: "turquie" },
        { label: "Europe", value: "europe" },
        { label: "Afrique/Orient", value: "afrique" },
        { label: "Asie", value: "asie" },
        { label: "Océanie", value: "oceanie" },
        { label: "Omra", value: "omra" },
      ],
    },
    {
      name: "cardDescription",
      type: "textarea",
      label: "Description carte",
    },
    {
      name: "cardTags",
      type: "array",
      label: "Tags carte",
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          label: "Texte",
        },
      ],
    },
    {
      name: "href",
      type: "text",
      label: "Lien",
      admin: {
        description:
          "Laisser vide pour utiliser automatiquement /listing?country=<country>",
      },
    },
  ],

  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data && !data.slug && data.name) {
          data.slug = data.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        }

        if (data && !data.href && data.country) {
          data.href = `/listing?country=${encodeURIComponent(String(data.country))}`;
        }

        return data;
      },
    ],
  },
};
