import { useState, useMemo } from "react";
import { User, CheckCircle, ChevronDown, Plus, Minus } from "lucide-react";

export interface PriceSidebarProps {
  summary?: string;
  adults?: number;
  pricePerAdult: string;
  priceAmount?: number;
  currency?: string;
  childrenPricing?: Array<{ label: string; priceAmount: number }>;
  travellersLabel?: string;
  travellersText?: string;
  detailsTitle?: string;
  totalLabel?: string;
  reserveButtonLabel?: string;
  confirmationText?: string;
  onReserve?: () => void;
}

const PriceSidebar = ({
  summary,
  adults = 1,
  pricePerAdult,
  priceAmount = 0,
  currency = "DZD",
  childrenPricing = [],
  travellersLabel = "Voyageurs *",
  detailsTitle = "Récapitulatif tarifaire",
  totalLabel = "Total estimé",
  reserveButtonLabel = "Réserver cette offre",
  confirmationText = "Disponibilité confirmée avant validation",
  onReserve,
}: PriceSidebarProps) => {
  const [adultCount, setAdultCount] = useState(adults);
  const [childCount, setChildCount] = useState(0);
  
  // Store the selected price option index for each child
  const [childSelections, setChildSelections] = useState<number[]>([]);

  // Calculate totals
  const totalAdults = adultCount * priceAmount;
  
  const totalChildren = useMemo(() => {
    return childSelections.reduce((acc, selectedIndex) => {
      const option = childrenPricing[selectedIndex];
      return acc + (option?.priceAmount || 0);
    }, 0);
  }, [childSelections, childrenPricing]);

  const grandTotal = totalAdults + totalChildren;

  // Handlers for steppers
  const handleAddAdult = () => setAdultCount((prev) => prev + 1);
  const handleRemoveAdult = () => setAdultCount((prev) => Math.max(1, prev - 1));

  const handleAddChild = () => {
    setChildCount((prev) => prev + 1);
    setChildSelections((prev) => [...prev, -1]); // -1 means no selection yet
  };

  const handleRemoveChild = () => {
    setChildCount((prev) => {
      if (prev > 0) {
        setChildSelections((sel) => sel.slice(0, -1));
        return prev - 1;
      }
      return 0;
    });
  };

  const handleChildSelection = (childIndex: number, optionIndex: number) => {
    setChildSelections((prev) => {
      const next = [...prev];
      next[childIndex] = optionIndex;
      return next;
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-separator-90 p-6 sticky top-20">
      {summary && (
        <p className="text-black-60 text-sm leading-relaxed tracking-tight mb-5 pb-5 border-b border-separator-90">
          {summary}
        </p>
      )}

      {/* Title */}
      <h3 className="font-jakarta text-black-100 font-medium text-base mb-4">
        {travellersLabel}
      </h3>

      {/* Travelers controls wrapper */}
      <div className="border border-separator-90 rounded-xl p-4 mb-8">
        
        {/* Adultes */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-gold-100">
              <User className="w-[18px] h-[18px]" />
              <span className="text-sm font-medium tracking-tight">Adultes</span>
            </div>
            <div className="ml-6">
              <span className="text-black-100 font-bold text-[15px] tracking-tight">{priceAmount > 0 ? priceAmount.toLocaleString("fr-FR").replace(/,/g, " ") : pricePerAdult.replace(/\/ pers.*/, '').trim()}</span>
              {currency && <span className="text-black-100 font-bold text-[15px] tracking-tight"> {currency}</span>}
              <span className="text-black-60 text-[13px] tracking-tight"> / pers</span>
            </div>
          </div>

          <div className="flex items-center border border-separator-90 rounded-full overflow-hidden">
            <button
              onClick={handleRemoveAdult}
              className="w-10 h-8 flex items-center justify-center text-black-80 hover:bg-gray-50 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-sm font-medium text-black-100">
              {adultCount}
            </span>
            <button
              onClick={handleAddAdult}
              className="w-10 h-8 flex items-center justify-center text-black-80 hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {childrenPricing && childrenPricing.length > 0 && (
          <>
            <div className="w-full h-px bg-separator-90 my-5" />

            {/* Enfants */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-gold-100">
                  <User className="w-[18px] h-[18px]" />
                  <span className="text-sm font-medium tracking-tight">Enfants</span>
                </div>
                <div className="ml-6">
                  <span className="text-black-60 text-[13px] tracking-tight">
                    Jusqu'à 11 ans
                  </span>
                </div>
              </div>

              <div className="flex items-center border border-separator-90 rounded-full overflow-hidden">
                <button
                  onClick={handleRemoveChild}
                  className="w-10 h-8 flex items-center justify-center text-black-80 hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-medium text-black-100">
                  {childCount}
                </span>
                <button
                  onClick={handleAddChild}
                  className="w-10 h-8 flex items-center justify-center text-black-80 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Render age dropdowns if children exist */}
            {childCount > 0 && (
              <div className="space-y-4">
                {Array.from({ length: childCount }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-black-80">
                      Enfant {i + 1} — tranche d'âge <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={childSelections[i]}
                        onChange={(e) => handleChildSelection(i, Number(e.target.value))}
                        className="w-full appearance-none border border-separator-90 rounded-lg py-2.5 px-4 text-sm text-black-80 bg-white focus:outline-none focus:border-gold-100 transition-colors"
                      >
                        <option value={-1} disabled>Sélectionner l'âge</option>
                        {childrenPricing.map((opt, idx) => (
                          <option key={idx} value={idx}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black-100 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Recapitulatif tarifaire */}
      <div className="border border-separator-90 rounded-xl p-4 mb-6">
        <h4 className="font-jakarta font-medium text-sm text-black-100 mb-4">
          {detailsTitle}
        </h4>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-black-60 tracking-tight">
              Adultes ({adultCount} × {priceAmount > 0 ? priceAmount.toLocaleString("fr-FR").replace(/,/g, " ") : pricePerAdult.replace(/\/ pers.*/, '').trim()} {currency})
            </span>
            <span className="text-black-100 font-medium tracking-tight">
              {totalAdults.toLocaleString("fr-FR").replace(/,/g, " ")} {currency}
            </span>
          </div>

          {childSelections.map((selIdx, childIdx) => {
             if (selIdx === -1) return null;
             const opt = childrenPricing[selIdx];
             return (
               <div key={childIdx} className="flex items-center justify-between text-sm">
                 <span className="text-black-60 tracking-tight">
                   Enfant ({1} × {opt.priceAmount.toLocaleString("fr-FR").replace(/,/g, " ")} {currency})
                 </span>
                 <span className="text-black-100 font-medium tracking-tight">
                   {opt.priceAmount.toLocaleString("fr-FR").replace(/,/g, " ")} {currency}
                 </span>
               </div>
             );
          })}
        </div>

        <div className="w-full h-px bg-separator-90 mb-3" />

        <div className="flex items-center justify-between">
          <span className="font-jakarta font-semibold text-[15px] text-black-100">
            {totalLabel}
          </span>
          <span className="font-jakarta font-bold text-[17px] text-gold-100">
            {grandTotal.toLocaleString("fr-FR").replace(/,/g, " ")} {currency}
          </span>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onReserve}
        className="w-full bg-navy-100 text-white flex justify-center py-3.5 rounded-full font-medium text-[15px] hover:bg-navy-90 transition-all duration-300 hover:shadow-lg mb-4"
      >
        {reserveButtonLabel}
      </button>

      {/* Confirmation hint */}
      {confirmationText && (
        <div className="flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="text-green-700 text-[13px] font-medium tracking-tight">
            {confirmationText}
          </span>
        </div>
      )}
    </div>
  );
};

export default PriceSidebar;
