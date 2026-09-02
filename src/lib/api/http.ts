import { SERVICES, getToken, type ServiceName } from "./config";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

/** Chamada HTTP a um microserviço específico. */
export async function apiFetch<T>(
  service: ServiceName,
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const base = SERVICES[service]?.replace(/\/$/, "");
  if (!base) {
    throw new ApiError(
      503,
      `Microserviço "${service}" não configurado (defina a variável de ambiente correspondente).`,
    );
  }

  const token = getToken();
  const response = await fetch(`${base}${path}`, {
    method: options.method ?? "GET",
    signal: options.signal ?? null,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...(options.body !== undefined
      ? { body: JSON.stringify(options.body) }
      : {}),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new ApiError(
      response.status,
      text || `Falha na chamada ao serviço de ${service} (${response.status}).`,
    );
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
