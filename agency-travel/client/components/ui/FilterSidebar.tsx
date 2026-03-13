import { ChevronDown, Info } from "lucide-react";

export interface FilterSidebarProps {
  /* Country */
  countries: string[];
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  /* Availability */
  availability: string;
  onAvailabilityChange: (value: string) => void;
  /* Budget */
  budgetMin: string;
  budgetMax: string;
  onBudgetMinChange: (value: string) => void;
  onBudgetMaxChange: (value: string) => void;
  /* Duration */
  duration: string;
  onDurationChange: (value: string) => void;
  /* Inclusions */
  inclusions: string[];
  onInclusionsChange: (inclusions: string[]) => void;
  /* Reset */
  onReset: () => void;
}

const availabilityOptions = [
  { value: "all", label: "Toutes les offres" },
  { value: "available", label: "Disponible" },
  { value: "almost", label: "Bientôt complet" },
];

const durationOptions = [
  { value: "all", label: "Toutes les durées" },
  { value: "3-4", label: "3 - 4 nuits" },
  { value: "5-6", label: "5 - 6 nuits" },
  { value: "7+", label: "7 nuits et plus" },
];

const inclusionOptions = [
  { value: "flight", label: "Vol aller-retour" },
  { value: "hotel", label: "Hôtel" },
  { value: "transfer", label: "Transfert aéroport" },
  { value: "assistance", label: "Assistance 24h/24" },
];

const FilterSidebar = ({
  countries,
  selectedCountry,
  onCountryChange,
  availability,
  onAvailabilityChange,
  budgetMin,
  budgetMax,
  onBudgetMinChange,
  onBudgetMaxChange,
  duration,
  onDurationChange,
  inclusions,
  onInclusionsChange,
  onReset,
}: FilterSidebarProps) => {
  const toggleInclusion = (value: string) => {
    if (inclusions.includes(value)) {
      onInclusionsChange(inclusions.filter((i) => i !== value));
    } else {
      onInclusionsChange([...inclusions, value]);
    }
  };

  return (
    <aside className="w-full lg:w-[260px] flex-shrink-0">
      <div className="bg-white rounded-2xl border border-separator-90 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-jakarta font-bold text-xl tracking-tight text-black-100">
            Filtres
          </h3>
          <button
            onClick={onReset}
            className="text-black-50 text-sm tracking-tight hover:text-black-80 transition-colors"
          >
            Réinitialiser
          </button>
        </div>

        {/* PAYS */}
        <div className="mb-6">
          <h4 className="text-gold-100 font-semibold text-xs uppercase tracking-wider mb-3">
            Pays
          </h4>
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => onCountryChange(e.target.value)}
              className="w-full appearance-none bg-white border border-separator-90 rounded-xl px-4 py-3 text-sm text-black-80 tracking-tight focus:outline-none focus:border-navy-40 cursor-pointer"
            >
              <option value="all">Tous les pays</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black-30 pointer-events-none" />
          </div>
        </div>

        {/* DISPONIBILITÉ */}
        <div className="mb-6">
          <h4 className="text-gold-100 font-semibold text-xs uppercase tracking-wider mb-3">
            Disponibilité
          </h4>
          <div className="space-y-2.5">
            {availabilityOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="availability"
                  value={opt.value}
                  checked={availability === opt.value}
                  onChange={(e) => onAvailabilityChange(e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    availability === opt.value
                      ? "border-navy-100"
                      : "border-black-20 group-hover:border-black-50"
                  }`}
                >
                  {availability === opt.value && (
                    <div className="w-2 h-2 rounded-full bg-navy-100" />
                  )}
                </div>
                <span className="text-sm text-black-70 tracking-tight">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* BUDGET MAX (DA/PERS) */}
        <div className="mb-6">
          <h4 className="text-gold-100 font-semibold text-xs uppercase tracking-wider mb-3">
            Budget max (DA/pers)
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-xs text-black-50">Minimum</span>
            <span className="flex-1" />
            <span className="text-xs text-black-50">Maximum</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value={budgetMin}
              onChange={(e) => onBudgetMinChange(e.target.value)}
              placeholder="0,00"
              className="w-full border border-separator-90 rounded-lg px-3 py-2 text-sm text-black-80 tracking-tight focus:outline-none focus:border-navy-40"
            />
            <span className="text-xs text-black-30 flex-shrink-0">DZD</span>
            <input
              type="text"
              value={budgetMax}
              onChange={(e) => onBudgetMaxChange(e.target.value)}
              placeholder="100 000"
              className="w-full border border-separator-90 rounded-lg px-3 py-2 text-sm text-black-80 tracking-tight focus:outline-none focus:border-navy-40"
            />
            <span className="text-xs text-black-30 flex-shrink-0">DZD</span>
          </div>
        </div>

        {/* DURÉE DU SÉJOUR */}
        <div className="mb-6">
          <h4 className="text-gold-100 font-semibold text-xs uppercase tracking-wider mb-3">
            Durée du séjour
          </h4>
          <div className="space-y-2.5">
            {durationOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="duration"
                  value={opt.value}
                  checked={duration === opt.value}
                  onChange={(e) => onDurationChange(e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    duration === opt.value
                      ? "border-navy-100"
                      : "border-black-20 group-hover:border-black-50"
                  }`}
                >
                  {duration === opt.value && (
                    <div className="w-2 h-2 rounded-full bg-navy-100" />
                  )}
                </div>
                <span className="text-sm text-black-70 tracking-tight">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* INCLUSIONS */}
        <div className="mb-6">
          <h4 className="text-gold-100 font-semibold text-xs uppercase tracking-wider mb-3">
            Inclusions
          </h4>
          <div className="space-y-2.5">
            {inclusionOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={inclusions.includes(opt.value)}
                  onChange={() => toggleInclusion(opt.value)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    inclusions.includes(opt.value)
                      ? "bg-navy-100 border-navy-100"
                      : "border-black-20 group-hover:border-black-50"
                  }`}
                >
                  {inclusions.includes(opt.value) && (
                    <svg
                      className="w-3 h-3 text-white"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2.5 6L5 8.5L9.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-black-70 tracking-tight">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-gold-100/10 rounded-xl p-4 flex gap-3">
          <Info className="w-5 h-5 text-gold-100 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-black-60 leading-relaxed">
            Les tarifs et disponibilités peuvent évoluer. Disponibilité confirmée avant
            validation.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
