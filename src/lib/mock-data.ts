export type BloodType =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export type StockStatus = "estavel" | "atencao" | "critico";

export interface StockLevel {
  type: BloodType;
  units: number;
  capacity: number;
  status: StockStatus;
}

export const stockLevels: StockLevel[] = [
  { type: "A+", units: 812, capacity: 860, status: "estavel" },
  { type: "O+", units: 604, capacity: 780, status: "estavel" },
  { type: "B+", units: 322, capacity: 530, status: "atencao" },
  { type: "A-", units: 210, capacity: 400, status: "atencao" },
  { type: "B-", units: 140, capacity: 320, status: "atencao" },
  { type: "O-", units: 68, capacity: 380, status: "critico" },
  { type: "AB+", units: 92, capacity: 420, status: "critico" },
  { type: "AB-", units: 58, capacity: 190, status: "critico" },
];

export const stockPct = (s: StockLevel) =>
  Math.round((s.units / s.capacity) * 100);

export interface Donor {
  name: string;
  initials: string;
  type: BloodType;
  lastDonation: string;
  status: "elegivel" | "aguardando" | "impedido";
  total: number;
}

export const donors: Donor[] = [
  { name: "João Silva", initials: "JS", type: "A+", lastDonation: "12 ago 2026", status: "elegivel", total: 14 },
  { name: "Mariana Rocha", initials: "MR", type: "O-", lastDonation: "02 ago 2026", status: "aguardando", total: 22 },
  { name: "Lucas Ferreira", initials: "LF", type: "AB+", lastDonation: "28 jul 2026", status: "elegivel", total: 7 },
  { name: "Aline Santos", initials: "AS", type: "B+", lastDonation: "20 jul 2026", status: "elegivel", total: 11 },
  { name: "Carlos Bianchi", initials: "CB", type: "O+", lastDonation: "03 jul 2026", status: "impedido", total: 19 },
  { name: "Rafael Haddad", initials: "RH", type: "A+", lastDonation: "20 jun 2026", status: "elegivel", total: 9 },
];

export interface Appointment {
  id: string;
  donor: string;
  type: BloodType;
  date: string;
  time: string;
  center: string;
  status: "confirmado" | "pendente" | "cancelado";
}

export const appointments: Appointment[] = [
  { id: "AG-1042", donor: "Marina Lopes", type: "O-", date: "03 set 2026", time: "09:00", center: "Hemocentro Central", status: "confirmado" },
  { id: "AG-1043", donor: "Diego Ferraz", type: "A+", date: "03 set 2026", time: "09:30", center: "Hemocentro Central", status: "confirmado" },
  { id: "AG-1044", donor: "Luana Reis", type: "B+", date: "03 set 2026", time: "10:15", center: "Posto Norte", status: "pendente" },
  { id: "AG-1045", donor: "Paulo Mendes", type: "AB-", date: "03 set 2026", time: "11:00", center: "Unidade Móvel · USP", status: "confirmado" },
  { id: "AG-1046", donor: "Sofia Almeida", type: "O+", date: "04 set 2026", time: "14:00", center: "Posto Sul", status: "pendente" },
  { id: "AG-1047", donor: "André Lima", type: "O-", date: "04 set 2026", time: "15:30", center: "Hemocentro Central", status: "cancelado" },
];

export interface CheckinEntry {
  ticket: string;
  donor: string;
  type: BloodType;
  arrivedAt: string;
  stage: "triagem" | "coleta" | "pos-coleta" | "concluido";
}

export const checkinQueue: CheckinEntry[] = [
  { ticket: "C-221", donor: "Marina Lopes", type: "O-", arrivedAt: "08:52", stage: "coleta" },
  { ticket: "C-222", donor: "Diego Ferraz", type: "A+", arrivedAt: "09:05", stage: "triagem" },
  { ticket: "C-223", donor: "Paulo Mendes", type: "AB-", arrivedAt: "09:12", stage: "triagem" },
  { ticket: "C-218", donor: "Helena Prado", type: "B+", arrivedAt: "08:30", stage: "pos-coleta" },
  { ticket: "C-215", donor: "Igor Nunes", type: "O+", arrivedAt: "08:02", stage: "concluido" },
];

export interface DonationCenter {
  id: string;
  name: string;
  city: string;
  address: string;
  hours: string;
  capacity: number;
  distanceKm?: number;
}

export const centers: DonationCenter[] = [
  { id: "CTR-01", name: "Hemocentro Central", city: "São Paulo · SP", address: "Av. Dr. Enéas Carvalho de Aguiar, 155", hours: "Seg–Sáb · 07h às 18h", capacity: 120, distanceKm: 2.4 },
  { id: "CTR-02", name: "Posto Norte", city: "São Paulo · SP", address: "Rua Voluntários da Pátria, 890", hours: "Seg–Sex · 08h às 17h", capacity: 45, distanceKm: 6.1 },
  { id: "CTR-03", name: "Posto Sul", city: "São Paulo · SP", address: "Av. Jabaquara, 2400", hours: "Seg–Sáb · 08h às 18h", capacity: 60, distanceKm: 8.9 },
  { id: "CTR-04", name: "Unidade Móvel · USP", city: "São Paulo · SP", address: "Cidade Universitária — Praça do Relógio", hours: "Qua–Sex · 09h às 16h", capacity: 30, distanceKm: 11.2 },
];

export interface Reservation {
  id: string;
  hospital: string;
  type: BloodType;
  units: number;
  until: string;
  status: "ativa" | "liberada" | "vencida";
}

export const reservations: Reservation[] = [
  { id: "RS-330", hospital: "Hospital das Clínicas", type: "O-", units: 6, until: "04 set 2026", status: "ativa" },
  { id: "RS-331", hospital: "Hospital Sírio-Libanês", type: "AB+", units: 3, until: "05 set 2026", status: "ativa" },
  { id: "RS-328", hospital: "Santa Casa de Misericórdia", type: "A+", units: 10, until: "01 set 2026", status: "liberada" },
  { id: "RS-325", hospital: "Hospital Albert Einstein", type: "B-", units: 4, until: "29 ago 2026", status: "vencida" },
];

export interface StoredDocument {
  id: string;
  name: string;
  category: "exame" | "termo" | "triagem" | "certificado";
  size: string;
  uploadedAt: string;
  owner: string;
}

export const documents: StoredDocument[] = [
  { id: "DOC-88", name: "Exame sorológico — Marina Lopes.pdf", category: "exame", size: "412 KB", uploadedAt: "02 set 2026", owner: "Marina Lopes" },
  { id: "DOC-87", name: "Termo de consentimento — Diego Ferraz.pdf", category: "termo", size: "188 KB", uploadedAt: "01 set 2026", owner: "Diego Ferraz" },
  { id: "DOC-86", name: "Ficha de triagem — lote 41.pdf", category: "triagem", size: "1,2 MB", uploadedAt: "31 ago 2026", owner: "Equipe triagem" },
  { id: "DOC-85", name: "Certificado de doação — Aline Santos.pdf", category: "certificado", size: "96 KB", uploadedAt: "30 ago 2026", owner: "Aline Santos" },
  { id: "DOC-84", name: "Exame de hemograma — Rafael Haddad.pdf", category: "exame", size: "360 KB", uploadedAt: "28 ago 2026", owner: "Rafael Haddad" },
];

export const metrics = {
  donationsWeek: 1284,
  donationsDelta: "+8,4%",
  activeDonors: 3642,
  recurringDonors: 471,
  upcomingAppointments: 128,
  criticalTypes: 3,
  stockHealth: 92,
  todayDonations: 42,
};
