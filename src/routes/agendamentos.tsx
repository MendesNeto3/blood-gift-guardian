import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, HorizonButton } from "../components/AppShell";
import { appointments } from "../lib/mock-data";

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
  return (
    <div>
      <PageHeader
        eyebrow="Serviço de agendamento"
        title="Agenda de doações"
        action={<HorizonButton>Novo agendamento</HorizonButton>}
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
