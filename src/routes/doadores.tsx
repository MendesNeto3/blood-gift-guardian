import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, HorizonButton } from "../components/AppShell";
import { useState } from "react";
import { QuickFormDialog, BLOOD_TYPES, formatDateBR, isPastDate, newId } from "../components/QuickFormDialog";
import { donors as initial_donors, type Donor } from "../lib/mock-data";

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
  const [donors, set_donors] = useState<Donor[]>(initial_donors);
  const [open, setOpen] = useState(false);
  return (
    <div>
      <QuickFormDialog open={open} onOpenChange={setOpen} eyebrow="Serviço de doadores" title="Novo doador" description="Cadastre um doador no hemocentro." submitLabel="Cadastrar doador"
        fields={[{ name: "name", label: "Nome completo", placeholder: "Ex.: Ana Souza" }, { name: "type", label: "Tipo sanguíneo", type: "select", options: BLOOD_TYPES }, { name: "status", label: "Situação", type: "select", options: ["Elegível", "Aguardando", "Impedido"] }]}
        onSubmit={(v) => { const parts = v.name.split(/\s+/).filter(Boolean); if (parts.length < 2) return "Informe nome e sobrenome."; const status = ({ "Elegível": "elegivel", "Aguardando": "aguardando", "Impedido": "impedido" } as const)[v.status as "Elegível"]; set_donors((p) => [{ name: v.name, initials: ((parts[0] ?? "")[0]! + (parts[parts.length - 1] ?? "")[0]!).toUpperCase(), type: v.type as Donor["type"], lastDonation: "—", status, total: 0 }, ...p]); return undefined; }} />

      <PageHeader
        eyebrow="Base de doadores"
        title="Doadores cadastrados"
        action={<HorizonButton onClick={() => setOpen(true)}>Novo doador</HorizonButton>}
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
