import type { ReservationRequest } from "../shared/api";
import { processReservation } from "../server/lib/reservation";
import { ensureMethod, readJsonBody } from "./_utils";

export default async function handler(req: any, res: any) {
  if (!ensureMethod(req, res, ["POST"])) {
    return;
  }

  const body = await readJsonBody<ReservationRequest>(req);
  if (!body) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid JSON request body." });
  }

  const result = await processReservation(body);
  return res.status(result.status).json(result.body);
}
