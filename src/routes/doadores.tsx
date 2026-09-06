import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, HorizonButton } from "../components/AppShell";
import { donors } from "../lib/mock-data";

export const Route = createFileRoute("/doadores")({
  head: () => ({
    meta: [
      { title: "Doadores — Bloodlink" },
      {
        name: "description",
        content:
          "Cadastro e acompanhamento de doadores: tipo sanguíneo, elegibilidade e histórico de doações.",
      },
      { property: "og:title", content: "Doadores — Bloodlink" },
      {
        property: "og:description",
        content: "Cadastro e acompanhamento de doadores.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DoadoresPage,
});

const statusLabel = {
  elegivel: "Elegível",
  aguardando: "Aguardando",
  impedido: "Impedido",
} as const;

function DoadoresPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Base de doadores"
        title="Doadores cadastrados"
        action={<HorizonButton>Novo doador</HorizonButton>}
      />

      <div className="rounded-2xl bg-card ring-1 ring-black/5">
        <div className="grid grid-cols-12 gap-4 border-b border-border px-6 py-3 font-mono text-xs tracking-wider text-muted-foreground uppercase">
          <span className="col-span-4">Doador</span>
          <span className="col-span-2">Tipo</span>
          <span className="col-span-2">Última doação</span>
          <span className="col-span-2">Total</span>
          <span className="col-span-2">Status</span>
        </div>
        <div className="divide-y divide-border">
          {donors.map((d) => (
            <div
              key={d.name}
              className="grid grid-cols-12 items-center gap-4 px-6 py-4 text-sm transition-colors hover:bg-background/60"
            >
              <span className="col-span-4 flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-sm">
                  {d.initials}
                </span>
                <span className="font-medium">{d.name}</span>
              </span>
              <span className="col-span-2 font-mono">{d.type}</span>
              <span className="col-span-2 text-muted-foreground">
                {d.lastDonation}
              </span>
              <span className="col-span-2 font-mono">{d.total} doações</span>
              <span className="col-span-2">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    d.status === "elegivel"
                      ? "bg-success/10 text-success"
                      : d.status === "aguardando"
                        ? "bg-warning/15 text-warning-foreground"
                        : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {statusLabel[d.status]}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
