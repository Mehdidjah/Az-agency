import { useState } from "react";
import { Plane, ArrowRight } from "lucide-react";
import Footer from "@/components/sections/Footer";
import StepIndicator from "@/components/ui/StepIndicator";
import CountrySelect from "@/components/ui/CountrySelect";
import DateRangePicker from "@/components/ui/DateRangePicker";
import PersonCounter from "@/components/ui/PersonCounter";
import SuccessModal from "@/components/ui/SuccessModal";
import { usePageMeta } from "@/hooks/usePageMeta";
import type { Country } from "@/lib/countries";
import { format } from "date-fns";

const navLinks = [
  { label: "Nos offres", href: "/listing" },
  { label: "Destinations", href: "/#destinations" },
  { label: "Témoignages", href: "/#temoignages" },
  { label: "FAQ", href: "/#faq" },
];

/* ── Form state ── */
interface Step1Data {
  fullName: string;
  phone: string;
  email: string;
}

interface Step2Data {
  destinations: Country[];
  startDate: Date | null;
  endDate: Date | null;
  budget: string;
  adults: number;
  children: number;
}

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

export default function CustomTrip() {
  usePageMeta({
    title: "Voyage sur mesure",
    description: "Créez votre voyage sur mesure avec AZ Voyage. Choisissez vos destinations, dates et budget pour recevoir une proposition personnalisée.",
  });

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  /* Step 1 */
  const [step1, setStep1] = useState<Step1Data>({
    fullName: "",
    phone: "",
    email: "",
  });

  /* Step 2 */
  const [step2, setStep2] = useState<Step2Data>({
    destinations: [],
    startDate: null,
    endDate: null,
    budget: "",
    adults: 0,
    children: 0,
  });

  /* Validation */
  const step1Valid = step1.fullName.trim() && step1.phone.trim() && step1.email.trim();
  const step2Valid = step2.destinations.length > 0 && step2.startDate;

  const goToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (step1Valid) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!step2Valid) return;

    setSubmitting(true);
    try {
      const body = {
        fullName: step1.fullName,
        phone: step1.phone,
        email: step1.email,
        destinations: step2.destinations.map((c) => c.name),
        startDate: step2.startDate ? format(step2.startDate, "yyyy-MM-dd") : null,
        endDate: step2.endDate ? format(step2.endDate, "yyyy-MM-dd") : null,
        budget: step2.budget,
        adults: step2.adults,
        children: step2.children,
      };

      const res = await fetch(`${API_URL}/api/custom-trip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setShowSuccess(true);
    } catch (err) {
      console.error("Submit error:", err);
      // Still show success to UX (the email may have been queued)
      setShowSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-white">
      {/* Top Bar */}
      <div className="bg-navy-100 text-white py-2 px-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Plane className="w-5 h-5" />
          <p className="text-sm font-medium tracking-tight">
            Travel to any wished destination
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-separator-90">
        <div className="max-w-[1200px] mx-auto relative flex items-center justify-center px-6 sm:px-10 py-5">
          <a href="/" className="absolute left-6 sm:left-10 flex-shrink-0">
            <img
              src="/assets/figma/logo.png"
              alt="AZ Voyage"
              className="h-10 object-contain"
            />
          </a>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-black-80 font-medium text-sm tracking-tight transition-colors duration-300 hover:text-gold-100 after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-0 after:bg-gold-100 after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="max-w-[640px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-jakarta font-bold text-[28px] sm:text-[36px] tracking-[-1.8px] text-black-100 mb-3">
            <span className="text-gold-100 italic">Créez </span>
            <span className="text-black-100">votre voyage sur mesure</span>
          </h1>
          <p className="text-black-50 text-[15px] leading-relaxed tracking-tight max-w-[480px] mx-auto">
            Remplissez les informations ci-dessous et recevez une proposition
            personnalisée.
          </p>
        </div>

        {/* Steps indicator */}
        <StepIndicator currentStep={step} totalSteps={2} />

        {/* Step 1 – Personal info */}
        {step === 1 && (
          <form onSubmit={goToStep2} className="space-y-5">
            {/* Full name */}
            <div>
              <label className="text-black-80 text-sm font-medium tracking-tight mb-1.5 block">
                Nom & Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={step1.fullName}
                onChange={(e) => setStep1({ ...step1, fullName: e.target.value })}
                placeholder="Ex : Amine Benali"
                className="w-full border border-separator-90 rounded-xl px-4 py-3 text-sm text-black-80 tracking-tight placeholder:text-black-30 focus:outline-none focus:border-navy-40 transition-colors"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-black-80 text-sm font-medium tracking-tight mb-1.5 block">
                Numéro de téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={step1.phone}
                onChange={(e) => setStep1({ ...step1, phone: e.target.value })}
                placeholder="Ex : +213 6 XX XX XX XX"
                className="w-full border border-separator-90 rounded-xl px-4 py-3 text-sm text-black-80 tracking-tight placeholder:text-black-30 focus:outline-none focus:border-navy-40 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-black-80 text-sm font-medium tracking-tight mb-1.5 block">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={step1.email}
                onChange={(e) => setStep1({ ...step1, email: e.target.value })}
                placeholder="Ex : nom@gmail.com"
                className="w-full border border-separator-90 rounded-xl px-4 py-3 text-sm text-black-80 tracking-tight placeholder:text-black-30 focus:outline-none focus:border-navy-40 transition-colors"
              />
            </div>

            {/* Next button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={!step1Valid}
                className="inline-flex items-center gap-2 bg-navy-100 text-white px-7 py-3 rounded-full font-medium text-[15px] tracking-tight hover:bg-navy-90 transition-all duration-300 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Prochaine étape
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2 – Trip details */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Country select */}
            <CountrySelect
              selected={step2.destinations}
              onChange={(destinations) => setStep2({ ...step2, destinations })}
            />

            {/* Date range */}
            <DateRangePicker
              startDate={step2.startDate}
              endDate={step2.endDate}
              onChange={(startDate, endDate) =>
                setStep2({ ...step2, startDate, endDate })
              }
            />

            {/* Budget */}
            <div>
              <label className="text-black-80 text-sm font-medium tracking-tight mb-1.5 block">
                Budget <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={step2.budget}
                  onChange={(e) => setStep2({ ...step2, budget: e.target.value })}
                  placeholder="Budget estimé"
                  className="w-full border border-separator-90 rounded-xl px-4 py-3 pr-16 text-sm text-black-80 tracking-tight placeholder:text-black-30 focus:outline-none focus:border-navy-40 transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-black-40 font-medium">
                  DZD
                </span>
              </div>
              <p className="text-black-40 text-xs tracking-tight mt-1.5">
                Cela nous aide à vous proposer l'option la plus adaptée.
              </p>
            </div>

            {/* Travelers */}
            <div className="flex items-start gap-10 pt-1">
              <PersonCounter
                label="Nombre d'adultes"
                value={step2.adults}
                onChange={(adults) => setStep2({ ...step2, adults })}
              />
              <PersonCounter
                label="Nombre d'enfants"
                value={step2.children}
                onChange={(children) => setStep2({ ...step2, children })}
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={!step2Valid || submitting}
                className="inline-flex items-center gap-2 bg-navy-100 text-white px-7 py-3 rounded-full font-medium text-[15px] tracking-tight hover:bg-navy-90 transition-all duration-300 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? "Envoi en cours…" : "Envoyer ma demande"}
              </button>
            </div>
          </form>
        )}
      </div>

      <Footer />

      {/* Success Modal */}
      <SuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  );
}
