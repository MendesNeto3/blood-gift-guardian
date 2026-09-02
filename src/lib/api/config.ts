/**
 * Configuração dos microserviços do Bloodlink.
 *
 * Cada serviço tem sua própria base URL, definida por variável de ambiente.
 * Quando a variável não está definida, o front-end usa os dados de exemplo
 * (mock) — assim a interface continua funcionando sem o backend no ar.
 */

const env = import.meta.env as Record<string, string | undefined>;

export const SERVICES = {
  auth: env["VITE_AUTH_SERVICE_URL"],
  doadores: env["VITE_DONORS_SERVICE_URL"],
  agendamento: env["VITE_SCHEDULING_SERVICE_URL"],
  checkin: env["VITE_CHECKIN_SERVICE_URL"],
  estoque: env["VITE_INVENTORY_SERVICE_URL"],
  centros: env["VITE_CENTERS_SERVICE_URL"],
  documentos: env["VITE_DOCUMENTS_SERVICE_URL"],
  reservas: env["VITE_RESERVATIONS_SERVICE_URL"],
} as const;

export type ServiceName = keyof typeof SERVICES;

export const isServiceEnabled = (name: ServiceName) =>
  Boolean(SERVICES[name]?.trim());

export const TOKEN_STORAGE_KEY = "bloodlink.token";

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const setToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  else window.localStorage.removeItem(TOKEN_STORAGE_KEY);
};
