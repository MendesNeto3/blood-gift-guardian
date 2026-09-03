import { Link } from "@tanstack/react-router";
import {
  Boxes,
  Building2,
  CalendarClock,
  CalendarRange,
  ClipboardCheck,
  Droplet,
  FileText,
  LayoutDashboard,
  MapPin,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { to: "/", label: "Painel", icon: LayoutDashboard, exact: true },
  { to: "/estoque", label: "Estoque", icon: Boxes },
  { to: "/doadores", label: "Doadores", icon: Users },
  { to: "/agendamentos", label: "Agendamentos", icon: CalendarClock },
  { to: "/checkin", label: "Check-in", icon: ClipboardCheck },
  { to: "/centros", label: "Centros de doação", icon: Building2 },
  { to: "/encontrar", label: "Encontrar centro", icon: MapPin },
  { to: "/reservas", label: "Reservas", icon: CalendarRange },
  { to: "/documentos", label: "Documentos", icon: FileText },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-20 flex w-60 flex-col border-r border-sidebar-border bg-sidebar p-5 text-sidebar-foreground">
        <Link to="/" className="mb-6 flex items-center gap-3 px-2 py-2">
          <div className="gradient-horizon grid size-9 place-items-center rounded-xl font-display text-lg text-sidebar-primary-foreground">
            B
          </div>
          <div>
            <p className="text-sm leading-none font-semibold text-sidebar-accent-foreground">
              Bloodlink
            </p>
            <p className="mt-1 text-[10px] tracking-[0.15em] text-sidebar-foreground/50 uppercase">
              Hemocentro
            </p>
          </div>
        </Link>

        <nav className="flex flex-col gap-0.5 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: "exact" in item && item.exact }}
              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-sidebar-accent"
              activeProps={{ className: "bg-sidebar-accent" }}
            >
              <span className="size-1.5 rounded-full bg-sidebar-foreground/20 transition-colors group-data-[status=active]:bg-sidebar-primary" />
              <item.icon className="size-4 shrink-0 opacity-70" />
              <span className="transition-colors group-data-[status=active]:font-semibold group-data-[status=active]:text-sidebar-primary">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-sidebar-border pt-4">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-3">
            <div className="gradient-chrome grid size-8 place-items-center rounded-full text-xs font-semibold text-sidebar-primary-foreground">
              MC
            </div>
            <div className="min-w-0 flex-1 text-xs">
              <p className="truncate font-medium text-sidebar-accent-foreground">
                Mariana Costa
              </p>
              <p className="text-sidebar-foreground/50">Gestora</p>
            </div>
            <Link
              to="/login"
              className="text-[11px] font-medium text-sidebar-primary hover:underline"
            >
              Sair
            </Link>
          </div>
        </div>
      </aside>

      <main className="min-h-screen pl-60">
        <div className="mx-auto max-w-[1200px] p-8">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-8 flex items-end justify-between gap-6">
      <div>
        <p className="mb-1 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
          {eyebrow}
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-balance">
          {title}
        </h1>
      </div>
      {action}
    </header>
  );
}

export function HorizonButton({
  children,
  type = "button",
  onClick,
}: {
  children: ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="gradient-horizon rounded-xl px-4 py-2.5 font-display text-sm tracking-wide text-sidebar-primary-foreground transition-opacity hover:opacity-90"
    >
      {children}
    </button>
  );
}
