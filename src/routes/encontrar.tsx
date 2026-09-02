import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Search } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "../components/AppShell";
import { centers } from "../lib/mock-data";

export const Route = createFileRoute("/encontrar")({
  head: () => ({
    meta: [
      { title: "Encontrar centro — Bloodlink" },
      {
        name: "description",
        content:
          "Localize o centro de doação mais próximo por nome, cidade ou bairro.",
      },
      { property: "og:title", content: "Encontrar centro — Bloodlink" },
      {
        property: "og:description",
        content: "Localize o centro de doação mais próximo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EncontrarPage,
});

function EncontrarPage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const results = centers.filter(
    (c) =>
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q),
  );

  return (
    <div>
      <PageHeader
        eyebrow="Serviço de localização"
        title="Encontre um centro de doação"
      />

      <div className="mb-6 flex items-center gap-2 rounded-xl bg-card px-4 py-3 ring-1 ring-black/5">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome, cidade ou bairro…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
        />
      </div>

      <div className="space-y-3">
        {results.map((c, i) => (
          <div
            key={c.id}
            className="animate-rise flex flex-wrap items-center gap-5 rounded-2xl bg-card p-5 ring-1 ring-black/5"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="gradient-horizon grid size-12 shrink-0 place-items-center rounded-xl">
              <MapPin className="size-5 text-sidebar-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold tracking-tight">{c.name}</p>
              <p className="text-sm text-muted-foreground">
                {c.address} · {c.city}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{c.hours}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-xl">{c.distanceKm} km</p>
              <p className="text-xs text-muted-foreground">de distância</p>
            </div>
            <Link
              to="/agendamentos"
              className="gradient-horizon rounded-xl px-4 py-2.5 font-display text-sm tracking-wide text-sidebar-primary-foreground transition-opacity hover:opacity-90"
            >
              Agendar aqui
            </Link>
          </div>
        ))}
        {results.length === 0 && (
          <p className="rounded-2xl bg-card p-10 text-center text-sm text-muted-foreground ring-1 ring-black/5">
            Nenhum centro encontrado para “{query}”.
          </p>
        )}
      </div>
    </div>
  );
}
