import type { CustomTripRequest } from "../shared/api";
import { processCustomTrip } from "../server/lib/custom-trip";
import { ensureMethod, readJsonBody } from "./_utils";

export default async function handler(req: any, res: any) {
  if (!ensureMethod(req, res, ["POST"])) {
    return;
  }

  const body = await readJsonBody<CustomTripRequest>(req);
  if (!body) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid JSON request body." });
  }

  const result = await processCustomTrip(body);
  return res.status(result.status).json(result.body);
}
