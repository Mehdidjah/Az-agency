import type { CustomTripRequest, CustomTripResponse } from "../../shared/api";

interface HandlerResult<T> {
  status: number;
  body: T;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function processCustomTrip(
  request: CustomTripRequest,
): Promise<HandlerResult<CustomTripResponse>> {
  const {
    fullName,
    phone,
    email,
    destinations,
    startDate,
    endDate,
    budget,
    adults,
    children,
  } = request;

  if (!fullName || !phone || !email || !destinations?.length) {
    return {
      status: 400,
      body: { success: false, message: "Missing required fields." },
    };
  }

  const resendApiKey = process.env.RESEND_API_KEY || process.env.API_RESEND;
  const recipientEmail = process.env.TRIP_RECIPIENT_EMAIL || "Devisaz.off@gmail.com";

  if (!resendApiKey) {
    console.warn("RESEND_API_KEY not set; skipping email and logging request instead.");
    console.log("Custom trip request:", JSON.stringify(request, null, 2));

    return {
      status: 200,
      body: {
        success: true,
        message: "Demande enregistrée (email non configuré).",
      },
    };
  }

  const html = `
    <h2>Nouvelle demande de voyage sur mesure</h2>
    <table style="border-collapse:collapse;width:100%;max-width:600px;font-family:sans-serif;">
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Nom</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(fullName)}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Téléphone</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(phone)}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(email)}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Destinations</td><td style="padding:8px;border:1px solid #ddd;">${destinations.map(escapeHtml).join(", ")}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Date de départ</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(startDate || "Non spécifiée")}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Date de retour</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(endDate || "Non spécifiée")}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Budget</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(budget || "Non spécifié")} DZD</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Adultes</td><td style="padding:8px;border:1px solid #ddd;">${adults}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Enfants</td><td style="padding:8px;border:1px solid #ddd;">${children}</td></tr>
    </table>
  `;

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "AZ Voyage <onboarding@resend.dev>",
      to: recipientEmail,
      subject: `Voyage sur mesure - ${fullName}`,
      html,
      replyTo: email,
    });

    return {
      status: 200,
      body: { success: true, message: "Demande envoyée avec succès." },
    };
  } catch (error) {
    console.error("Custom trip email error:", error);

    return {
      status: 500,
      body: { success: false, message: "Erreur lors de l'envoi." },
    };
  }
}
