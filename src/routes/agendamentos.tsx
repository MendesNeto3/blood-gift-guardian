import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, HorizonButton } from "../components/AppShell";
import { useState } from "react";
import { QuickFormDialog, BLOOD_TYPES, formatDateBR, isPastDate, newId } from "../components/QuickFormDialog";
import { appointments as initial_appointments, type Appointment } from "../lib/mock-data";

export const Route = createFileRoute("/agendamentos")({
  head: () => ({
    meta: [
      { title: "Agendamentos — Bloodlink" },
      {
        name: "description",
        content:
          "Agenda de doações: horários confirmados, pendentes e cancelados por centro de coleta.",
      },
      { property: "og:title", content: "Agendamentos — Bloodlink" },
      {
        property: "og:description",
        content: "Agenda de doações por centro de coleta.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AgendamentosPage,
});

const statusMeta = {
  confirmado: "bg-success/10 text-success",
  pendente: "bg-warning/15 text-warning-foreground",
  cancelado: "bg-destructive/10 text-destructive",
} as const;

const statusLabel = {
  confirmado: "Confirmado",
  pendente: "Pendente",
  cancelado: "Cancelado",
} as const;

function AgendamentosPage() {
  const [appointments, set_appointments] = useState<Appointment[]>(initial_appointments);
  const [open, setOpen] = useState(false);
  return (
    <div>
      <QuickFormDialog open={open} onOpenChange={setOpen} eyebrow="Serviço de agendamento" title="Novo agendamento" description="Marque um horário de doação para um doador." submitLabel="Agendar"
        fields={[{ name: "donor", label: "Doador", placeholder: "Nome completo" }, { name: "type", label: "Tipo sanguíneo", type: "select", options: BLOOD_TYPES }, { name: "date", label: "Data", type: "date" }, { name: "time", label: "Horário", type: "time" }, { name: "center", label: "Hemocentro", placeholder: "Ex.: Hemocentro Central" }]}
        onSubmit={(v) => { if (isPastDate(v.date)) return "Escolha uma data a partir de hoje."; set_appointments((p) => [{ id: newId("AG"), donor: v.donor, type: v.type as Appointment["type"], date: formatDateBR(v.date), time: v.time, center: v.center, status: "pendente" }, ...p]); return undefined; }} />

      <PageHeader
        eyebrow="Serviço de agendamento"
        title="Agenda de doações"
        action={<HorizonButton onClick={() => setOpen(true)}>Novo agendamento</HorizonButton>}
      />

      <div className="space-y-3">
        {appointments.map((a, i) => (
          <div
            key={a.id}
            className="animate-rise flex flex-wrap items-center gap-4 rounded-2xl bg-card p-5 ring-1 ring-black/5"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="gradient-chrome-soft grid size-12 shrink-0 place-items-center rounded-xl font-mono text-sm font-semibold">
              {a.time}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{a.donor}</p>
              <p className="text-sm text-muted-foreground">
                {a.center} · {a.date}
              </p>
            </div>
            <span className="font-mono text-sm">{a.type}</span>
            <span className="font-mono text-xs text-muted-foreground">
              {a.id}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusMeta[a.status]}`}
            >
              {statusLabel[a.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
