const jsonError = (message: string) => ({ success: false, message });

function coerceJsonBody<T>(body: unknown): T | null {
  if (body == null) {
    return null;
  }

  if (typeof body === "string") {
    if (!body.trim()) {
      return null;
    }

    try {
      return JSON.parse(body) as T;
    } catch {
      return null;
    }
  }

  if (Buffer.isBuffer(body)) {
    return coerceJsonBody<T>(body.toString("utf8"));
  }

  if (typeof body === "object") {
    return body as T;
  }

  return null;
}

export async function readJsonBody<T>(req: any): Promise<T | null> {
  if (req?.body !== undefined) {
    return coerceJsonBody<T>(req.body);
  }

  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  if (chunks.length === 0) {
    return null;
  }

  return coerceJsonBody<T>(Buffer.concat(chunks).toString("utf8"));
}

export function ensureMethod(req: any, res: any, allowedMethods: string[]) {
  res.setHeader("Allow", allowedMethods.join(", "));

  if (allowedMethods.includes(req?.method || "")) {
    return true;
  }

  res.status(405).json(jsonError(`Method ${req?.method || "UNKNOWN"} not allowed.`));
  return false;
}
