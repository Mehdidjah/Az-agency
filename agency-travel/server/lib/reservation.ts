import type { ReservationRequest, ReservationResponse } from "../../shared/api";

interface HandlerResult<T> {
  status: number;
  body: T;
}

export async function processReservation(
  request: ReservationRequest,
): Promise<HandlerResult<ReservationResponse>> {
  const {
    fullName,
    phone,
    offerTitle,
    offerId,
    selectedHotel,
    adults,
    children,
    childDetails,
    totalEstimated,
    currency,
  } = request;

  if (!fullName || !phone || !selectedHotel || !adults) {
    return {
      status: 400,
      body: { success: false, message: "Champs obligatoires manquants." },
    };
  }

  const cmsUrl = (process.env.CMS_URL || process.env.VITE_CMS_URL || "http://localhost:3001")
    .replace(/\/$/, "");

  try {
    const cmsResponse = await fetch(`${cmsUrl}/api/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        phone,
        offerTitle: offerTitle || "",
        offerId: offerId || "",
        ...(offerId ? { offer: offerId } : {}),
        selectedHotel,
        adults,
        children: children ?? 0,
        childDetails: childDetails || "",
        totalEstimated: totalEstimated || "",
        currency: currency || "DZD",
        status: "new",
      }),
    });

    const cmsPayload = await cmsResponse.json().catch(async () => ({
      raw: await cmsResponse.text().catch(() => ""),
    }));

    if (!cmsResponse.ok) {
      console.error("CMS reservation create error:", cmsPayload);

      return {
        status: 502,
        body: { success: false, message: "Erreur lors de l'enregistrement." },
      };
    }

    const reservationId =
      typeof cmsPayload === "object" &&
      cmsPayload &&
      "doc" in cmsPayload &&
      cmsPayload.doc &&
      typeof cmsPayload.doc === "object" &&
      "id" in cmsPayload.doc
        ? String(cmsPayload.doc.id)
        : undefined;

    if (!reservationId) {
      console.error("CMS reservation create returned no document ID:", cmsPayload);

      return {
        status: 502,
        body: { success: false, message: "Erreur lors de l'enregistrement." },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Demande de réservation enregistrée avec succès.",
        reservationId,
      },
    };
  } catch (error) {
    console.error("Reservation route error:", error);

    return {
      status: 500,
      body: { success: false, message: "Erreur serveur." },
    };
  }
}
