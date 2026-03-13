import type { DemoResponse } from "../shared/api";
import { ensureMethod } from "./_utils";

export default function handler(req: any, res: any) {
  if (!ensureMethod(req, res, ["GET"])) {
    return;
  }

  const response: DemoResponse = {
    message: "Hello from Vercel function",
  };

  return res.status(200).json(response);
}
