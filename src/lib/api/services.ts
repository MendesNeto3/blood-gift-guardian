import { apiFetch } from "./http";
import type {
  Appointment,
  CheckinEntry,
  DonationCenter,
  Donor,
  Reservation,
  StockLevel,
  StoredDocument,
} from "../mock-data";

/** Serviço de autenticação */
export interface AuthSession {
  token: string;
  name: string;
  role: string;
}

export const authService = {
  login: (email: string, password: string) =>
    apiFetch<AuthSession>("auth", "/login", {
      method: "POST",
      body: { email, password },
    }),
  register: (payload: { name: string; email: string; password: string }) =>
    apiFetch<AuthSession>("auth", "/register", { method: "POST", body: payload }),
  me: () => apiFetch<AuthSession>("auth", "/me"),
};

/** Serviço de doadores */
export const donorsService = {
  list: () => apiFetch<Donor[]>("doadores", "/donors"),
  create: (payload: Partial<Donor>) =>
    apiFetch<Donor>("doadores", "/donors", { method: "POST", body: payload }),
};

/** Serviço de agendamento */
export const schedulingService = {
  list: () => apiFetch<Appointment[]>("agendamento", "/appointments"),
  create: (payload: Partial<Appointment>) =>
    apiFetch<Appointment>("agendamento", "/appointments", {
      method: "POST",
      body: payload,
    }),
  cancel: (id: string) =>
    apiFetch<void>("agendamento", `/appointments/${id}`, { method: "DELETE" }),
};

/** Serviço de check-in */
export const checkinService = {
  queue: () => apiFetch<CheckinEntry[]>("checkin", "/queue"),
  advance: (ticket: string, stage: CheckinEntry["stage"]) =>
    apiFetch<CheckinEntry>("checkin", `/queue/${ticket}`, {
      method: "PATCH",
      body: { stage },
    }),
};

/** Serviço de estoque */
export const inventoryService = {
  levels: () => apiFetch<StockLevel[]>("estoque", "/stock"),
  registerEntry: (payload: { type: string; units: number }) =>
    apiFetch<StockLevel>("estoque", "/stock/entries", {
      method: "POST",
      body: payload,
    }),
};

/** Serviço de centros de doação */
export const centersService = {
  list: () => apiFetch<DonationCenter[]>("centros", "/centers"),
  create: (payload: Partial<DonationCenter>) =>
    apiFetch<DonationCenter>("centros", "/centers", {
      method: "POST",
      body: payload,
    }),
  nearby: (query: string) =>
    apiFetch<DonationCenter[]>(
      "centros",
      `/centers/search?q=${encodeURIComponent(query)}`,
    ),
};

/** Serviço de documentos */
export const documentsService = {
  list: () => apiFetch<StoredDocument[]>("documentos", "/documents"),
};

/** Serviço de reservas */
export const reservationsService = {
  list: () => apiFetch<Reservation[]>("reservas", "/reservations"),
  create: (payload: Partial<Reservation>) =>
    apiFetch<Reservation>("reservas", "/reservations", {
      method: "POST",
      body: payload,
    }),
};
