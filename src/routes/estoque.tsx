import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, HorizonButton } from "../components/AppShell";
import { stockLevels, stockPct, type StockStatus } from "../lib/mock-data";

export const Route = createFileRoute("/estoque")({
  head: () => ({
    meta: [
      { title: "Estoque — Bloodlink" },
      {
        name: "description",
        content:
          "Gerenciamento do estoque de sangue por tipo, com níveis, capacidade e alertas de urgência.",
      },
      { property: "og:title", content: "Estoque — Bloodlink" },
      {
        property: "og:description",
        content: "Níveis de estoque de sangue por tipo sanguíneo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EstoquePage,
});

const statusMeta: Record<StockStatus, { label: string; chip: string }> = {
  estavel: { label: "Estável", chip: "bg-success/10 text-success" },
  atencao: { label: "Atenção", chip: "bg-warning/15 text-warning-foreground" },
  critico: { label: "Crítico", chip: "bg-destructive/10 text-destructive" },
};

function EstoquePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Gerenciamento de estoque"
        title="Unidades por tipo sanguíneo"
        action={<HorizonButton>Registrar entrada</HorizonButton>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stockLevels.map((s, i) => {
          const pct = stockPct(s);
          const meta = statusMeta[s.status];
          return (
            <div
              key={s.type}
              className="animate-rise rounded-2xl bg-card p-5 ring-1 ring-black/5"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl">{s.type}</span>
                <span
                  className={`rounded-full px-2 py-1 text-[10px] font-semibold tracking-[0.15em] uppercase ${meta.chip}`}
                >
                  {meta.label}
                </span>
              </div>
              <p className="mt-4 text-3xl font-medium">
                {s.units}
                <span className="text-base text-muted-foreground">
                  {" "}
                  / {s.capacity}
                </span>
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
                <div
                  className={`h-full rounded-full ${s.status === "critico" ? "pulse-critical bg-destructive" : "gradient-chrome"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-4 font-mono text-xs text-muted-foreground">
                {pct}% da capacidade
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
        <p className="text-sm font-semibold text-destructive">
          Alerta de reposição
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Os tipos O-, AB+ e AB- estão abaixo do nível mínimo. Considere abrir
          uma campanha direcionada ou acionar reservas compatíveis.
        </p>
      </div>
    </div>
  );
}
