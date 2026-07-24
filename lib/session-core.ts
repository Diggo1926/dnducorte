// Edge-safe: usado tanto em Server Actions quanto no middleware.
export const COOKIE_NAME = "dndu_session";

export type SessionPayload = {
  usuarioId: string;
  barbeariaId: string;
  papel: "ADMIN" | "BARBEIRO";
};

// Checado apenas na primeira assinatura/verificação real (não no import do módulo),
// para não derrubar `next build` — que carrega este módulo sem processar requisições.
function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "SESSION_SECRET não configurado. Defina essa variável de ambiente antes de iniciar em produção."
      );
    }
    return "dev-secret-troque-em-producao";
  }
  return secret;
}

async function getKey() {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function sign(data: string) {
  const key = await getKey();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Buffer.from(signature).toString("base64url");
}

export async function createSessionValue(payload: SessionPayload) {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${await sign(data)}`;
}

export async function verifySessionValue(value: string): Promise<SessionPayload | null> {
  const [data, signature] = value.split(".");
  if (!data || !signature) return null;
  if ((await sign(data)) !== signature) return null;
  try {
    return JSON.parse(Buffer.from(data, "base64url").toString("utf-8"));
  } catch {
    return null;
  }
}
