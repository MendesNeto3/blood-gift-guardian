import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Bloodlink" },
      {
        name: "description",
        content: "Acesse o Bloodlink, o sistema de gestão de doações de sangue.",
      },
      { property: "og:title", content: "Entrar — Bloodlink" },
      {
        property: "og:description",
        content: "Acesse o Bloodlink, o sistema de gestão de doações de sangue.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

const inputClass =
  "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring/40";

function LoginPage() {
  const [mode, setMode] = useState<"entrar" | "criar">("entrar");
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    navigate({ to: "/" });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-sidebar px-4">
      <div className="gradient-horizon pointer-events-none absolute inset-x-0 top-0 h-1.5" />
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="gradient-horizon grid size-12 place-items-center rounded-2xl font-display text-2xl text-sidebar-primary-foreground">
            B
          </div>
          <h1 className="mt-4 font-display text-3xl tracking-tight text-sidebar-accent-foreground">
            Bloodlink
          </h1>
          <p className="mt-1 text-sm text-sidebar-foreground/60">
            Sistema de gestão de doações de sangue
          </p>
        </div>

        <div className="rounded-2xl bg-card p-7 shadow-2xl ring-1 ring-black/5">
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-background p-1">
            {(["entrar", "criar"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-lg py-2 text-sm font-medium transition-colors ${
                  mode === m
                    ? "bg-card font-semibold text-foreground shadow-sm ring-1 ring-black/5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "entrar" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "criar" && (
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Nome completo
                </span>
                <input required placeholder="Seu nome" className={inputClass} />
              </label>
            )}
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                E-mail
              </span>
              <input
                type="email"
                required
                placeholder="voce@hemocentro.org"
                className={inputClass}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Senha
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                className={inputClass}
              />
            </label>
            {mode === "criar" && (
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Perfil de acesso
                </span>
                <select className={inputClass} defaultValue="gestor">
                  <option value="gestor">Gestor de hemocentro</option>
                  <option value="atendente">Atendente / triagem</option>
                  <option value="hospital">Hospital parceiro</option>
                </select>
              </label>
            )}
            <button
              type="submit"
              className="gradient-horizon w-full rounded-xl py-3 font-display text-sm tracking-wide text-sidebar-primary-foreground transition-opacity hover:opacity-90"
            >
              {mode === "entrar" ? "Entrar no painel" : "Criar conta"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-sidebar-foreground/50">
          <Link to="/" className="text-sidebar-primary hover:underline">
            Voltar ao painel
          </Link>
        </p>
      </div>
    </div>
  );
}
