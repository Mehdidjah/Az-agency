import { useState } from "react";
import DestinationCard from "../ui/DestinationCard";
import { useDestinations, getDestinationImageSrc } from "@/hooks/useDestinations";
import { BlurFade } from "@/components/magicui/blur-fade";

const DestinationsSection = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const { data: cmsDestinations } = useDestinations();

  const filters = [
    { label: "Tout", value: "all" },
    { label: "Turquie", value: "turquie" },
    { label: "Europe", value: "europe" },
    { label: "Afrique/Orient", value: "afrique" },
    { label: "Asie", value: "asie" },
    { label: "Océanie", value: "oceanie" },
    { label: "Omra", value: "omra" },
  ];

  /* ── Static fallback ── */
  const fallbackDestinations = [
    {
      id: "1",
      name: "Istanbul",
      country: "Turquie",
      imageUrl: "/assets/figma/5a02729a3418047c872b3399e3fcaaa7fd8876e1.jpg",
      category: "turquie",
      cardDescription:
        "Entre mosquées majestueuses, ruelles animées et vues sur le Bosphore, un séjour parfait pour city break, shopping et découvertes",
      cardTags: [{ label: "Famille" }, { label: "Histoire" }],
    },
    {
      id: "2",
      name: "Rome",
      country: "Italie",
      imageUrl: "/assets/figma/7d83481de93cb3515133271899e0d62e56c401e5.jpg",
      category: "europe",
      cardDescription:
        "Un patrimoine unique, des places mythiques et une ambiance méditerranéenne idéale pour une escapade culturelle.",
      cardTags: [{ label: "Culture" }, { label: "City Break" }],
    },
    {
      id: "3",
      name: "Le Caire",
      country: "Egypte",
      imageUrl: "/assets/figma/cf0410856b991c188fcf3b7f24a87b6fed7eb6e8.jpg",
      category: "afrique",
      cardDescription:
        "Des pyramides aux souks vibrants, vivez un voyage entre histoire antique et énergie orientale.",
      cardTags: [{ label: "Histoire" }, { label: "Aventure" }],
    },
    {
      id: "4",
      name: "Agra",
      country: "Inde",
      imageUrl: "/assets/figma/e34c3efe581f3c46ab4d29d681117654609f65b9.jpg",
      category: "asie",
      cardDescription:
        "Le Taj Mahal et des sites emblématiques pour un séjour riche en émotions et en découvertes.",
      cardTags: [{ label: "Monuments" }, { label: "Famille" }],
    },
  ];

  const destinations = (cmsDestinations?.length ? cmsDestinations : fallbackDestinations).map((d: any) => {
    const country = d.country || d.name;

    return {
    src: getDestinationImageSrc(d),
    alt: d.name,
    title: d.country ? `${d.name}, ${d.country}` : d.name,
    description: d.cardDescription ?? "",
    tags: (d.cardTags ?? []).map((tag: any) => tag.label).filter(Boolean),
    category: d.category,
    href: `/listing?country=${encodeURIComponent(country)}`,
  };
  });

  const filteredDestinations =
    activeFilter === "all"
      ? destinations
      : destinations.filter((dest: any) => dest.category === activeFilter);

  return (
    <section id="destinations" className="bg-[#F3F3F3] px-6 sm:px-10 lg:px-16 pt-20">
      <div className="text-center mb-10">
        <h2 className="font-jakarta font-bold text-[36px] sm:text-[40px] tracking-[-2px] mb-5">
          <span className="text-black-100">Explorez </span>
          <span className="text-gold-100">nos destinations</span>
        </h2>
        <p className="text-black-50 text-lg sm:text-xl leading-[29px] tracking-tight max-w-[640px] mx-auto">
          Découvrez nos destinations les plus demandées et les offres disponibles selon la saison.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            aria-pressed={activeFilter === filter.value}
            className={`px-5 py-2 rounded-full font-medium text-base tracking-tight transition-all duration-300 ${activeFilter === filter.value
              ? "bg-navy-100 text-white"
              : "bg-white text-black-80 border border-separator-100 hover:bg-navy-10 hover:border-navy-20"
              }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Destination Scroll */}
      <div className="flex gap-4 overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory no-scrollbar mb-12 mt-10">
        {filteredDestinations.map((dest, index) => (
          <BlurFade
            key={dest.alt}
            className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[340px] snap-start"
            delay={0.12 + index * 0.08}
            duration={0.95}
            inView
          >
            <DestinationCard
              src={dest.src}
              alt={dest.alt}
              title={dest.title}
              description={dest.description}
              tags={dest.tags}
              href={dest.href}
            />
          </BlurFade>
        ))}
      </div>
    </section>
  );
};

export default DestinationsSection;
