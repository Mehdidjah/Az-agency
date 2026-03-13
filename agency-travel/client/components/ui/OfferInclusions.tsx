import {
  Plane,
  Building,
  Bus,
  Headphones,
  Check,
  Utensils,
  MapPin,
  Calendar,
} from "lucide-react";
import { ReactNode } from "react";

export interface InclusionItem {
  icon: ReactNode;
  label: string;
}

export interface OfferInclusionEntry {
  label: string;
  icon?: string;
}

export interface OfferInclusionsProps {
  /** Pre-built items with custom icons (legacy) */
  items?: InclusionItem[];
  /** CMS entries with label + icon key */
  entries?: OfferInclusionEntry[];
  /** Simple string labels from CMS – rendered with a checkmark icon */
  labels?: string[];
  /** Also display exclusions from CMS */
  exclusions?: string[];
}

const getInclusionIcon = (iconKey?: string) => {
  const className = "w-5 h-5 text-gold-100";

  switch (iconKey) {
    case "plane":
      return <Plane className={className} />;
    case "hotel":
      return <Building className={className} />;
    case "transfer":
      return <Bus className={className} />;
    case "assistance":
      return <Headphones className={className} />;
    case "meal":
      return <Utensils className={className} />;
    case "map":
      return <MapPin className={className} />;
    case "calendar":
      return <Calendar className={className} />;
    default:
      return <Check className={className} />;
  }
};

const OfferInclusions = ({ items, entries, labels, exclusions }: OfferInclusionsProps) => {
  const displayItems: InclusionItem[] = entries?.length
    ? entries.map((entry) => ({
        icon: getInclusionIcon(entry.icon),
        label: entry.label,
      }))
    : labels
    ? labels.map((label) => ({
        icon: <Check className="w-5 h-5 text-gold-100" />,
        label,
      }))
    : items ?? [];

  if (!displayItems.length && !(exclusions && exclusions.length > 0)) {
    return null;
  }

  return (
    <div>
      <h2 className="font-jakarta font-bold text-[24px] sm:text-[28px] tracking-[-1.2px] mb-6">
        <span className="text-black-100">Ce qui est </span>
        <span className="text-gold-100 italic">inclus</span>
      </h2>

      <div className="space-y-3">
        {displayItems.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-4 bg-navy-10/40 border border-separator-90 rounded-xl px-5 py-4"
          >
            <div className="flex-shrink-0">{item.icon}</div>
            <span className="text-black-80 text-[15px] tracking-tight">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Exclusions section */}
      {exclusions && exclusions.length > 0 && (
        <div className="mt-8">
          <h3 className="font-jakarta font-semibold text-lg tracking-[-0.5px] mb-4 text-black-80">
            Non inclus
          </h3>
          <div className="space-y-2">
            {exclusions.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border border-separator-90 rounded-xl px-5 py-3"
              >
                <span className="text-red-400 font-bold text-sm">✕</span>
                <span className="text-black-60 text-[15px] tracking-tight">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferInclusions;
