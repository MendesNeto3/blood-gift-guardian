import { createFileRoute } from "@tanstack/react-router";
import { HorizonButton, PageHeader } from "../components/AppShell";
import { useState } from "react";
import { QuickFormDialog, BLOOD_TYPES, formatDateBR, isPastDate, newId } from "../components/QuickFormDialog";
import { reservations as initial_reservations, type Reservation } from "../lib/mock-data";

export const Route = createFileRoute("/reservas")({
  head: () => ({
    meta: [
      { title: "Reservas — Bloodlink" },
      {
        name: "description",
        content:
          "Reservas de unidades de sangue para hospitais: status, validade e tipos reservados.",
      },
      { property: "og:title", content: "Reservas — Bloodlink" },
      {
        property: "og:description",
        content: "Reservas de unidades de sangue para hospitais.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReservasPage,
});

const statusMeta = {
  ativa: { label: "Ativa", chip: "bg-success/10 text-success" },
  liberada: { label: "Liberada", chip: "bg-warning/15 text-warning-foreground" },
  vencida: { label: "Vencida", chip: "bg-destructive/10 text-destructive" },
} as const;

function ReservasPage() {
  const [reservations, set_reservations] = useState<Reservation[]>(initial_reservations);
  const [open, setOpen] = useState(false);
  return (
    <div>
      <QuickFormDialog open={open} onOpenChange={setOpen} eyebrow="Serviço de reservas" title="Nova reserva" description="Reserve bolsas de sangue para um hospital." submitLabel="Criar reserva"
        fields={[{ name: "hospital", label: "Hospital", placeholder: "Ex.: Hospital das Clínicas" }, { name: "type", label: "Tipo sanguíneo", type: "select", options: BLOOD_TYPES }, { name: "units", label: "Unidades", type: "number", min: 1, defaultValue: "1" }, { name: "until", label: "Válida até", type: "date" }]}
        onSubmit={(v) => { if (Number(v.units) < 1) return "Informe ao menos 1 unidade."; if (isPastDate(v.until)) return "A validade não pode estar no passado."; set_reservations((p) => [{ id: newId("RS"), hospital: v.hospital, type: v.type as Reservation["type"], units: Number(v.units), until: formatDateBR(v.until), status: "ativa" }, ...p]); }} />

      <PageHeader
        eyebrow="Serviço de reservas"
        title="Reservas de unidades"
        action={<HorizonButton onClick={() => setOpen(true)}>Nova reserva</HorizonButton>}
      />

      <div className="rounded-2xl bg-card ring-1 ring-black/5">
        <div className="grid grid-cols-12 gap-4 border-b border-border px-6 py-3 font-mono text-xs tracking-wider text-muted-foreground uppercase">
          <span className="col-span-1">ID</span>
          <span className="col-span-4">Hospital</span>
          <span className="col-span-2">Tipo</span>
          <span className="col-span-2">Unidades</span>
          <span className="col-span-2">Válida até</span>
          <span className="col-span-1">Status</span>
        </div>
        <div className="divide-y divide-border">
          {reservations.map((r) => (
            <div
              key={r.id}
              className="grid grid-cols-12 items-center gap-4 px-6 py-4 text-sm transition-colors hover:bg-background/60"
            >
              <span className="col-span-1 font-mono text-xs text-muted-foreground">
                {r.id}
              </span>
              <span className="col-span-4 font-medium">{r.hospital}</span>
              <span className="col-span-2 font-mono">{r.type}</span>
              <span className="col-span-2 font-mono">{r.units} un</span>
              <span className="col-span-2 text-muted-foreground">{r.until}</span>
              <span className="col-span-1">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusMeta[r.status].chip}`}
                >
                  {statusMeta[r.status].label}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
