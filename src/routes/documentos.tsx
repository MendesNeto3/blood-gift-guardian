import { createFileRoute } from "@tanstack/react-router";
import { FileText, Upload } from "lucide-react";
import { HorizonButton, PageHeader } from "../components/AppShell";
import { documents } from "../lib/mock-data";

export const Route = createFileRoute("/documentos")({
  head: () => ({
    meta: [
      { title: "Documentos — Bloodlink" },
      {
        name: "description",
        content:
          "Documentos armazenados: exames, termos de consentimento, fichas de triagem e certificados.",
      },
      { property: "og:title", content: "Documentos — Bloodlink" },
      {
        property: "og:description",
        content: "Documentos armazenados do hemocentro.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DocumentosPage,
});

const categoryLabel = {
  exame: "Exame",
  termo: "Termo",
  triagem: "Triagem",
  certificado: "Certificado",
} as const;

function DocumentosPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Serviço de documentos"
        title="Arquivos armazenados"
        action={
          <HorizonButton>
            <span className="inline-flex items-center gap-2">
              <Upload className="size-4" /> Enviar documento
            </span>
          </HorizonButton>
        }
      />

      <div className="space-y-3">
        {documents.map((d, i) => (
          <div
            key={d.id}
            className="animate-rise flex items-center gap-4 rounded-2xl bg-card p-4 ring-1 ring-black/5"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="gradient-chrome-soft grid size-11 shrink-0 place-items-center rounded-xl">
              <FileText className="size-5 text-foreground/70" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{d.name}</p>
              <p className="text-xs text-muted-foreground">
                {d.owner} · enviado em {d.uploadedAt}
              </p>
            </div>
            <span className="rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-black/5">
              {categoryLabel[d.category]}
            </span>
            <span className="w-16 text-right font-mono text-xs text-muted-foreground">
              {d.size}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
