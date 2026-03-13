import { Link } from "react-router-dom";
import {
    Calendar,
    Plane,
    Building,
    Bus,
} from "lucide-react";
import { Lens } from "@/components/magicui/lens";

export interface OfferCardProps {
    /** Image source URL */
    src: string;
    /** Offer name / destination title */
    name: string;
    /** Emoji flag (fallback) */
    flag?: string;
    /** Image URL for flag */
    flagSrc?: string;
    /** Travel dates (e.g. "12–19 avril") */
    dates: string;
    /** Trip duration (e.g. "7 Jours") */
    duration: string;
    /** Price displayed (e.g. "145 000") */
    price: string;
    /** Currency label (default: "DZD") */
    currency?: string;
    /** Optional badge tag (e.g. "Coup de coeur", "Nouveau") */
    tag?: string;
    /** Whether flight is included (default: true) */
    includesFlight?: boolean;
    /** Whether hotel is included (default: true) */
    includesHotel?: boolean;
    /** Whether transport is included (default: true) */
    includesTransport?: boolean;
    /** CTA button label (default: "Voir l'offre") */
    ctaLabel?: string;
    /** Callback when CTA is clicked */
    onCtaClick?: () => void;
    /** Link to the offer detail page */
    href?: string;
}

const OfferCard = ({
    src,
    name,
    flag,
    flagSrc,
    dates,
    duration,
    price,
    currency = "DZD",
    tag,
    includesFlight = true,
    includesHotel = true,
    includesTransport = true,
    ctaLabel = "Voir l'offre",
    onCtaClick,
    href,
}: OfferCardProps) => {
    const Wrapper = href
        ? ({ children, className }: { children: React.ReactNode; className?: string }) => (
              <Link to={href} className={className}>{children}</Link>
          )
        : ({ children, className }: { children: React.ReactNode; className?: string }) => (
              <div className={className}>{children}</div>
          );

    return (
        <Wrapper className="bg-white rounded-2xl overflow-hidden border border-separator-90 hover:border-gold-100 hover:shadow-xl transition-all duration-300 group block">
            {/* Image */}
            <div className="relative overflow-hidden h-[320px]">
                <Lens
                    zoomFactor={1.5}
                    lensSize={138}
                    ariaLabel={`Zoom ${name}`}
                >
                    <img
                        src={src}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                </Lens>
                {tag && (
                    <span className="absolute top-4 left-4 bg-navy-100 text-white text-xs font-semibold tracking-tight px-3 py-1 rounded-full shadow">
                        {tag}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-5">
                    <h3 className="font-jakarta font-semibold text-xl tracking-tight text-black-100 flex-1">
                        {name}
                    </h3>
                    {flagSrc ? (
                        <img src={flagSrc} alt={`Drapeau`} className="w-6 h-6 object-cover rounded-full shadow-sm flex-shrink-0 mt-1" />
                    ) : flag ? (
                        <span className="text-xl flex-shrink-0 mt-0.5">{flag}</span>
                    ) : null}
                </div>

                <div className="space-y-3 mb-4">
                    {/* Dates & Duration */}
                    <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-black-30" />
                        <div className="flex items-center gap-2">
                            <span className="text-black-80 text-base tracking-tight">
                                {dates}
                            </span>
                            <div className="w-px h-3 bg-separator-100"></div>
                            <span className="text-black-80 text-base tracking-tight">
                                {duration}
                            </span>
                        </div>
                    </div>

                    {/* Flight */}
                    {includesFlight && (
                        <div className="flex items-center gap-3">
                            <Plane className="w-4 h-4 text-black-30" />
                            <span className="text-black-80 text-base tracking-tight">
                                Vol Aller/Retour
                            </span>
                        </div>
                    )}

                    {/* Hotel */}
                    {includesHotel && (
                        <div className="flex items-center gap-3">
                            <Building className="w-4 h-4 text-black-30" />
                            <span className="text-black-80 text-base tracking-tight">
                                Hotel
                            </span>
                        </div>
                    )}

                    {/* Transport */}
                    {includesTransport && (
                        <div className="flex items-center gap-3">
                            <Bus className="w-4 h-4 text-black-30" />
                            <span className="text-black-80 text-base tracking-tight">
                                Transport Aller/Retour
                            </span>
                        </div>
                    )}
                </div>

                <div className="w-full h-px bg-separator-90 mb-4"></div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <span className="text-black-80 text-sm tracking-tight">À partir de</span>
                        <div className="font-jakarta font-extrabold text-2xl tracking-tight text-black-100">
                            {price} {currency}
                        </div>
                    </div>
                    <span
                        className="bg-navy-100 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-navy-90 transition-colors duration-300"
                    >
                        {ctaLabel}
                    </span>
                </div>
            </div>
        </Wrapper>
    );
};

export default OfferCard;
