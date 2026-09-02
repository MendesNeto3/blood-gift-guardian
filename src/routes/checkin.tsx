import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, HorizonButton } from "../components/AppShell";
import { checkinQueue } from "../lib/mock-data";

export const Route = createFileRoute("/checkin")({
  head: () => ({
    meta: [
      { title: "Check-in — Bloodlink" },
      {
        name: "description",
        content:
          "Fila de check-in dos doadores presentes: triagem, coleta, pós-coleta e concluídos.",
      },
      { property: "og:title", content: "Check-in — Bloodlink" },
      {
        property: "og:description",
        content: "Fila de check-in dos doadores presentes no hemocentro.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CheckinPage,
});

const stages = [
  { key: "triagem", label: "Triagem" },
  { key: "coleta", label: "Coleta" },
  { key: "pos-coleta", label: "Pós-coleta" },
  { key: "concluido", label: "Concluído" },
] as const;

function CheckinPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Serviço de check-in"
        title="Fila de hoje"
        action={<HorizonButton>Fazer check-in</HorizonButton>}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stages.map((stage) => {
          const items = checkinQueue.filter((c) => c.stage === stage.key);
          return (
            <div
              key={stage.key}
              className="rounded-2xl bg-card p-4 ring-1 ring-black/5"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-tight">
                  {stage.label}
                </h2>
                <span className="grid size-6 place-items-center rounded-full bg-background font-mono text-xs font-semibold">
                  {items.length}
                </span>
              </div>
              <div className="space-y-2.5">
                {items.length === 0 && (
                  <p className="py-4 text-center text-xs text-muted-foreground">
                    Nenhum doador nesta etapa
                  </p>
                )}
                {items.map((c) => (
                  <div
                    key={c.ticket}
                    className="rounded-xl bg-background p-3.5 ring-1 ring-black/5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-primary">
                        {c.ticket}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {c.arrivedAt}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-medium">{c.donor}</p>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                      Tipo {c.type}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
