import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Droplet } from "lucide-react";
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
  "w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 transition-shadow focus:ring-2 focus:ring-ring/40";

function LoginPage() {
  const [mode, setMode] = useState<"entrar" | "criar">("entrar");
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    navigate({ to: "/painel" });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div className="gradient-horizon pointer-events-none absolute inset-x-0 top-0 h-1.5" />

      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="grid size-14 place-items-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
            <Droplet
              className="size-7 fill-destructive text-destructive"
              strokeWidth={2.5}
            />
          </div>
          <h1 className="mt-4 font-display text-3xl tracking-wide text-foreground">
            BLOODLINK
          </h1>
          <p className="mt-2 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
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
                className={`rounded-lg py-2 text-sm transition-colors ${
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
                <span className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
                  Nome completo
                </span>
                <input
                  required
                  placeholder="Seu nome"
                  className={inputClass}
                />
              </label>
            )}
            <label className="block space-y-1.5">
              <span className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
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
              <span className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
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
                <span className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
                  Perfil de acesso
                </span>
                <select className={inputClass} defaultValue="gestor">
                  <option value="gestor">Gestor de hemocentro</option>
                  <option value="atendente">Atendente / triagem</option>
                  <option value="hospital">Hospital parceiro</option>
                </select>
              </label>
            )}
            {mode === "entrar" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
            )}
            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-3 font-display text-sm tracking-wide text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              {mode === "entrar" ? "ENTRAR NO PAINEL" : "CRIAR CONTA"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/painel" className="font-medium text-primary hover:underline">
            Voltar ao painel
          </Link>
        </p>
      </div>
    </div>
  );
}
