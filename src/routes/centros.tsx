import { createFileRoute } from "@tanstack/react-router";
import { Building2, MapPin, Plus, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { HorizonButton, PageHeader } from "../components/AppShell";
import { centers as initialCenters, type DonationCenter } from "../lib/mock-data";

export const Route = createFileRoute("/centros")({
  head: () => ({
    meta: [
      { title: "Centros de doação — Bloodlink" },
      {
        name: "description",
        content:
          "Criação e gestão dos centros de doação: endereço, horários e capacidade de coleta.",
      },
      { property: "og:title", content: "Centros de doação — Bloodlink" },
      {
        property: "og:description",
        content: "Criação e gestão dos centros de doação.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CentrosPage,
});

const inputClass =
  "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring/40";

function CentrosPage() {
  const [centers, setCenters] = useState<DonationCenter[]>(initialCenters);
  const [creating, setCreating] = useState(false);

  function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    if (!name) return;
    setCenters((prev) => [
      ...prev,
      {
        id: `CTR-${String(prev.length + 1).padStart(2, "0")}`,
        name,
        city: String(form.get("city") || ""),
        address: String(form.get("address") || ""),
        hours: String(form.get("hours") || ""),
        capacity: Number(form.get("capacity") || 0),
      },
    ]);
    setCreating(false);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Serviço de centros de doação"
        title="Centros cadastrados"
        action={
          <HorizonButton onClick={() => setCreating(true)}>
            <span className="inline-flex items-center gap-2">
              <Plus className="size-4" /> Novo centro
            </span>
          </HorizonButton>
        }
      />

      {creating && (
        <form
          onSubmit={handleCreate}
          className="mb-6 rounded-2xl bg-card p-6 ring-1 ring-black/5"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              Criar centro de doação
            </h2>
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-background"
              aria-label="Fechar"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Nome do centro
              </span>
              <input name="name" required placeholder="Ex.: Hemocentro Leste" className={inputClass} />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Cidade / UF
              </span>
              <input name="city" placeholder="Ex.: São Paulo · SP" className={inputClass} />
            </label>
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-xs font-medium text-muted-foreground">
                Endereço
              </span>
              <input name="address" placeholder="Rua, número, bairro" className={inputClass} />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Horário de funcionamento
              </span>
              <input name="hours" placeholder="Ex.: Seg–Sáb · 08h às 18h" className={inputClass} />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Capacidade diária (coletas)
              </span>
              <input name="capacity" type="number" min={1} placeholder="Ex.: 60" className={inputClass} />
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="rounded-xl border border-input px-4 py-2.5 text-sm font-medium hover:bg-background"
            >
              Cancelar
            </button>
            <HorizonButton type="submit">Salvar centro</HorizonButton>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {centers.map((c, i) => (
          <div
            key={c.id}
            className="animate-rise rounded-2xl bg-card p-6 ring-1 ring-black/5"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="gradient-chrome-soft grid size-10 place-items-center rounded-xl">
                  <Building2 className="size-5 text-foreground/70" />
                </div>
                <div>
                  <p className="font-semibold tracking-tight">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.city}</p>
                </div>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {c.id}
              </span>
            </div>
            <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin className="size-3.5 shrink-0" /> {c.address}
              </p>
              <p>{c.hours}</p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-xs text-muted-foreground">
                Capacidade diária
              </span>
              <span className="font-display text-lg">{c.capacity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
