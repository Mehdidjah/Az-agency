import { ensureMethod } from "./_utils";

export default function handler(req: any, res: any) {
  if (!ensureMethod(req, res, ["GET"])) {
    return;
  }

  return res.status(200).json({
    message: process.env.PING_MESSAGE || "ping",
  });
}
