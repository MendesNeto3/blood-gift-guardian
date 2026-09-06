import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, HorizonButton } from "../components/AppShell";
import {
  appointments,
  donors,
  metrics,
  stockLevels,
  stockPct,
} from "../lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Painel — Bloodlink" },
      {
        name: "description",
        content:
          "Visão geral do hemocentro: doações, estoque por tipo sanguíneo, coletas e doadores recentes.",
      },
      { property: "og:title", content: "Painel — Bloodlink" },
      {
        property: "og:description",
        content:
          "Visão geral do hemocentro: doações, estoque por tipo sanguíneo, coletas e doadores recentes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DashboardPage,
});

const donorStatusLabel = {
  elegivel: "Elegível",
  aguardando: "Aguardando",
  impedido: "Impedido",
} as const;

function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Painel operacional"
        title="Visão geral do hemocentro"
        action={<HorizonButton>Nova campanha</HorizonButton>}
      />

      <div className="gradient-horizon rounded-2xl p-1">
        <div className="flex flex-wrap items-end justify-between gap-6 rounded-[14px] bg-background/95 p-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
              Fluxo vital · hoje
            </p>
            <p className="mt-2 font-display text-4xl tracking-tight">
              {metrics.todayDonations}{" "}
              <span className="font-sans text-base text-muted-foreground">
                doações até agora
              </span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {metrics.donationsDelta} vs. semana anterior · 12 coletas ativas
            </p>
          </div>
          <div className="flex gap-6">
            <div className="text-right">
              <p className="text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
                Estoque
              </p>
              <p className="font-display text-2xl">{metrics.stockHealth}%</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
                Críticos
              </p>
              <p className="font-display text-2xl text-destructive">
                {metrics.criticalTypes}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "Doações / semana",
            value: metrics.donationsWeek.toLocaleString("pt-BR"),
            foot: metrics.donationsDelta,
            footClass: "bg-success/10 text-success",
          },
          {
            label: "Doadores ativos",
            value: metrics.activeDonors.toLocaleString("pt-BR"),
            foot: `${metrics.recurringDonors} recorrentes`,
            footClass: "text-muted-foreground",
          },
          {
            label: "Agendamentos",
            value: String(metrics.upcomingAppointments),
            foot: "próx. 7 dias",
            footClass: "text-muted-foreground",
          },
          {
            label: "Tipos críticos",
            value: String(metrics.criticalTypes),
            foot: "O-, AB+, AB-",
            footClass: "text-muted-foreground",
            critical: true,
          },
        ].map((m, i) => (
          <div
            key={m.label}
            className="animate-rise rounded-2xl bg-card p-5 ring-1 ring-black/5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <p className="text-[11px] tracking-[0.15em] text-muted-foreground uppercase">
              {m.label}
            </p>
            <p
              className={`mt-2 font-display text-3xl ${m.critical ? "text-destructive" : ""}`}
            >
              {m.value}
            </p>
            <p
              className={`mt-3 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${m.footClass}`}
            >
              {m.foot}
            </p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-card p-6 ring-1 ring-black/5 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">
              Estoque por tipo
            </h2>
            <Link
              to="/estoque"
              className="text-sm font-medium text-primary hover:underline"
            >
              Gerenciar estoque
            </Link>
          </div>
          <div className="space-y-4">
            {stockLevels.slice(0, 5).map((s) => {
              const pct = stockPct(s);
              return (
                <div key={s.type}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-medium">{s.type}</span>
                    <span
                      className={`font-mono text-xs ${s.status === "critico" ? "font-medium text-destructive" : "text-muted-foreground"}`}
                    >
                      {s.units} un ·{" "}
                      {s.status === "critico" ? "crítico" : `${pct}%`}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-background">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${s.status === "critico" ? "pulse-critical bg-destructive" : "bg-primary"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-card p-6 ring-1 ring-black/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Coletas</h2>
            <span className="font-mono text-xs text-muted-foreground">set</span>
          </div>
          <div className="mb-2 grid grid-cols-7 gap-1 text-center font-mono text-[11px] text-muted-foreground">
            {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {Array.from({ length: 14 }, (_, i) => i + 1).map((day) => (
              <span
                key={day}
                className={`rounded-lg py-1.5 ${day === 2 || day === 5 || day === 9 ? "gradient-horizon font-semibold text-sidebar-primary-foreground" : ""}`}
              >
                {day}
              </span>
            ))}
          </div>
          <div className="mt-5 space-y-2 border-t border-border pt-4">
            {appointments.slice(0, 2).map((a) => (
              <div key={a.id} className="flex items-center gap-3">
                <span className="size-2 rounded-full bg-primary" />
                <span className="text-xs">
                  {a.donor} · {a.time} · {a.center}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-card p-6 ring-1 ring-black/5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">
            Doadores recentes
          </h2>
          <Link
            to="/doadores"
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver todos
          </Link>
        </div>
        <div className="grid grid-cols-12 gap-4 border-b border-border px-4 pb-2 font-mono text-xs tracking-wider text-muted-foreground uppercase">
          <span className="col-span-4">Doador</span>
          <span className="col-span-2">Tipo</span>
          <span className="col-span-3">Última doação</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-1" />
        </div>
        <div className="divide-y divide-border">
          {donors.slice(0, 4).map((d) => (
            <div
              key={d.name}
              className="grid grid-cols-12 items-center gap-4 px-4 py-3 text-sm transition-colors hover:bg-background/60"
            >
              <span className="col-span-4 flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-sm">
                  {d.initials}
                </span>
                <span className="font-medium">{d.name}</span>
              </span>
              <span className="col-span-2 font-mono">{d.type}</span>
              <span className="col-span-3 text-muted-foreground">
                {d.lastDonation}
              </span>
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
                  {donorStatusLabel[d.status]}
                </span>
              </span>
              <span className="col-span-1 text-right">
                <Link
                  to="/agendamentos"
                  className="font-medium text-primary hover:underline"
                >
                  Agendar
                </Link>
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
