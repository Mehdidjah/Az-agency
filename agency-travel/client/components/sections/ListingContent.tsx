import { useEffect, useMemo, useState } from "react";
import FilterSidebar from "../ui/FilterSidebar";
import CategoryTabs from "../ui/CategoryTabs";
import SortDropdown from "../ui/SortDropdown";
import ListingCard from "../ui/ListingCard";
import { useOffers, getOfferImageSrc, getOfferFlagSrc } from "@/hooks/useOffers";

const categories = ["Tout", "Turquie", "Europe", "Moyen-Orient", "Asie", "Afrique"];

const sortOptions = [
  { value: "recommended", label: "Recommandées" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "date", label: "Date de départ" },
];
interface ListingContentProps {
  searchQuery?: string;
  initialCountry?: string;
}

const parsePriceValue = (value?: string) => {
  if (!value) return 0;
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number.parseInt(digits, 10) : 0;
};

const parseDateValue = (value?: string) => {
  if (!value) return Number.MAX_SAFE_INTEGER;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
};

const normalizeText = (value?: string) =>
  (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const inclusionKeywordMap: Record<string, string[]> = {
  flight: ["vol", "avion", "flight", "plane"],
  hotel: ["hotel", "hebergement", "hébergement"],
  transfer: ["transfert", "transfer", "aeroport", "aéroport"],
  assistance: ["assistance", "support", "accompagnement"],
};

const iconAliasMap: Record<string, string[]> = {
  flight: ["plane"],
  hotel: ["hotel"],
  transfer: ["transfer"],
  assistance: ["assistance"],
};

const offerHasInclusion = (
  offerInclusions: Array<{ item: string; icon?: string }>,
  selectedFilter: string,
) => {
  const keywords = inclusionKeywordMap[selectedFilter] ?? [selectedFilter];
  const iconAliases = iconAliasMap[selectedFilter] ?? [selectedFilter];

  return offerInclusions.some((entry) => {
    const icon = normalizeText(entry.icon || "");
    const label = normalizeText(entry.item || "");

    const matchesIcon = iconAliases.some((alias) => icon === normalizeText(alias));
    const matchesLabel = keywords.some((keyword) => label.includes(normalizeText(keyword)));

    return matchesIcon || matchesLabel;
  });
};

const offerHasLinkedHotels = (
  hotels?: Array<string | { id?: string; name?: string }>,
) => Array.isArray(hotels) && hotels.length > 0;

const ListingContent = ({
  searchQuery = "",
  initialCountry = "all",
}: ListingContentProps) => {
  const { data: cmsOffers, isLoading } = useOffers();

  /* Map CMS offers to card shape */
  const offers = (cmsOffers ?? []).map((o) => ({
    src: getOfferImageSrc(o),
    destination: o.destination,
    country: o.country,
    flag: o.flag ?? "",
    flagSrc: getOfferFlagSrc(o),
    dates: o.dates ?? "",
    duration: o.duration ?? "",
    price: o.price,
    badge: o.badge,
    badgeVariant: o.badgeVariant,
    region: o.region ?? "",
    status: o.status,
    durationDays: o.durationDays,
    startDate: o.startDate,
    inclusions: o.inclusions ?? [],
    hotels: o.hotels ?? [],
    slug: o.slug,
  }));

  /* Derive country list from CMS data */
  const countries = [...new Set(offers.map((o) => o.country))];
  /* Filter state */
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [sortBy, setSortBy] = useState("recommended");
  const [selectedCountry, setSelectedCountry] = useState(initialCountry || "all");
  const [availability, setAvailability] = useState("all");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [duration, setDuration] = useState("all");
  const [inclusions, setInclusions] = useState<string[]>([]);

  useEffect(() => {
    setSelectedCountry(initialCountry || "all");
  }, [initialCountry]);

  const resetFilters = () => {
    setActiveCategory("Tout");
    setSelectedCountry("all");
    setAvailability("all");
    setBudgetMin("");
    setBudgetMax("");
    setDuration("all");
    setInclusions([]);
    setSortBy("recommended");
  };

  const searchNeedle = normalizeText(searchQuery.trim());
  const normalizedSelectedCountry = normalizeText(selectedCountry.trim());

  const filteredOffers = useMemo(() => {
    const minBudget = parsePriceValue(budgetMin);
    const maxBudget = parsePriceValue(budgetMax);

    const byFilters = offers.filter((offer) => {
      if (activeCategory !== "Tout" && offer.region !== activeCategory) {
        return false;
      }

      if (
        normalizedSelectedCountry !== "all" &&
        normalizeText(offer.country) !== normalizedSelectedCountry
      ) {
        return false;
      }

      if (availability === "available") {
        const availableByStatus = offer.status === "available";
        const availableByBadge = offer.badgeVariant !== "warning" && offer.badgeVariant !== "danger";
        if (!availableByStatus && !availableByBadge) {
          return false;
        }
      }

      if (availability === "almost") {
        const almostByStatus = offer.status === "almost-full";
        const almostByBadge = offer.badgeVariant === "warning";
        if (!almostByStatus && !almostByBadge) {
          return false;
        }
      }

      const offerPrice = parsePriceValue(offer.price);
      if (budgetMin && offerPrice < minBudget) {
        return false;
      }
      if (budgetMax && offerPrice > maxBudget) {
        return false;
      }

      if (duration !== "all") {
        const days = offer.durationDays ?? 0;
        if (duration === "3-4" && !(days >= 3 && days <= 4)) {
          return false;
        }
        if (duration === "5-6" && !(days >= 5 && days <= 6)) {
          return false;
        }
        if (duration === "7+" && days < 7) {
          return false;
        }
      }

      if (inclusions.length > 0) {
        const allSelectedInclusionsMatch = inclusions.every((selectedInclusion) =>
          selectedInclusion === "hotel"
            ? offerHasInclusion(offer.inclusions, selectedInclusion) ||
              offerHasLinkedHotels(offer.hotels)
            : offerHasInclusion(offer.inclusions, selectedInclusion),
        );

        if (!allSelectedInclusionsMatch) {
          return false;
        }
      }

      if (searchNeedle) {
        const haystack = [offer.destination, offer.country, offer.region]
          .map((entry) => normalizeText(entry))
          .join(" ");
        if (!haystack.includes(searchNeedle)) {
          return false;
        }
      }

      return true;
    });

    const sorted = [...byFilters];
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => parsePriceValue(a.price) - parsePriceValue(b.price));
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => parsePriceValue(b.price) - parsePriceValue(a.price));
    } else if (sortBy === "date") {
      sorted.sort((a, b) => parseDateValue(a.startDate) - parseDateValue(b.startDate));
    }

    return sorted;
  }, [
    activeCategory,
    availability,
    budgetMax,
    budgetMin,
    duration,
    inclusions,
    offers,
    searchNeedle,
    selectedCountry,
    normalizedSelectedCountry,
    sortBy,
  ]);

  return (
    <section className="px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <FilterSidebar
          countries={countries}
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
          availability={availability}
          onAvailabilityChange={setAvailability}
          budgetMin={budgetMin}
          budgetMax={budgetMax}
          onBudgetMinChange={setBudgetMin}
          onBudgetMaxChange={setBudgetMax}
          duration={duration}
          onDurationChange={setDuration}
          inclusions={inclusions}
          onInclusionsChange={setInclusions}
          onReset={resetFilters}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Top Bar: Tabs + Sort */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
            <SortDropdown
              value={sortBy}
              options={sortOptions}
              onChange={setSortBy}
            />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-separator-90 animate-pulse">
                  <div className="h-[200px] bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-px bg-gray-200" />
                    <div className="flex justify-between">
                      <div className="h-6 bg-gray-200 rounded w-1/3" />
                      <div className="h-9 w-9 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cards Grid */}
          {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOffers.map((offer, index) => (
              <ListingCard
                key={`${offer.destination}-${offer.country}-${index}`}
                src={offer.src}
                destination={offer.destination}
                country={offer.country}
                flag={offer.flag}
                flagSrc={offer.flagSrc}
                dates={offer.dates}
                duration={offer.duration}
                price={offer.price}
                badge={offer.badge}
                badgeVariant={offer.badgeVariant as "warning" | "danger" | undefined}
                href={offer.slug ? `/offer/${offer.slug}` : undefined}
              />
            ))}
          </div>
          )}

          {/* Empty State */}
          {filteredOffers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-black-50 text-lg mb-2">
                Aucune offre trouvée
              </p>
              <p className="text-black-30 text-sm">
                Essayez de modifier vos filtres pour voir plus de résultats.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 text-navy-100 font-medium text-sm hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ListingContent;
