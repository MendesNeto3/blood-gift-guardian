import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Download, Eye, FileText, Search, Trash2, Upload } from "lucide-react";
import { PageHeader } from "../components/AppShell";
import { useEffect, useState } from "react";
import { documents as initialDocs } from "../lib/mock-data";
import { UploadDocumentDialog } from "../components/UploadDocumentDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { HemocenterDocument } from "@/lib/hemocenter-documents";

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
  const [documents, setDocuments] = useState<HemocenterDocument[]>(initialDocs);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("todas");
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState<HemocenterDocument | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [removing, setRemoving] = useState<HemocenterDocument | null>(null);
  useEffect(() => {
    if (!preview?.file) { setPreviewUrl(""); return; }
    const url = URL.createObjectURL(preview.file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [preview]);
  function download(doc: HemocenterDocument) {
    if (!doc.file) return;
    const url = URL.createObjectURL(doc.file);
    const link = document.createElement("a");
    link.href = url;
    link.download = doc.name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const filtered = documents.filter(doc => (category === "todas" || doc.category === category) && `${doc.name} ${doc.owner}`.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR")));
  return (
    <div>
      <UploadDocumentDialog open={open} onOpenChange={setOpen} onUploaded={(d) => { setDocuments((p) => [...d, ...p]); setNotice(`${d.length} ${d.length === 1 ? "documento adicionado" : "documentos adicionados"} ao protótipo.`); setSearch(""); setCategory("todas"); }} />
      <PageHeader
        eyebrow="Serviço de documentos"
        title="Arquivos armazenados"
        action={
          <Button onClick={() => setOpen(true)}>
            <span className="inline-flex items-center gap-2">
              <Upload className="size-4" /> Enviar documento
            </span>
          </Button>
        }
      />

      <p className="mb-5 border-l-2 border-primary pl-3 text-sm text-muted-foreground">Protótipo · Use apenas arquivos fictícios. Os documentos adicionados ficam disponíveis nesta página até recarregar; não são enviados ao hemocentro.</p>
      {notice && <p role="status" className="mb-4 flex items-center gap-2 text-sm text-primary"><CheckCircle2 className="size-4 shrink-0" />{notice}</p>}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
          <input aria-label="Buscar documentos" placeholder="Buscar documento ou responsável" value={search} onChange={e => setSearch(e.target.value)} className="h-10 w-full rounded-md border border-input bg-card pl-10 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </label>
        <select aria-label="Filtrar categoria" value={category} onChange={e => setCategory(e.target.value)} className="h-10 rounded-md border border-input bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <option value="todas">Todas as categorias</option>
          {Object.entries(categoryLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      <div className="space-y-3">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4"
          >
            <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-accent">
              <FileText className="size-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1 basis-40">
              <p title={d.name} className="truncate text-sm font-medium">{d.name}</p>
              <p className="text-xs text-muted-foreground">
                {d.owner} · enviado em {d.uploadedAt}
              </p>
              {!d.file && <p className="mt-1 text-xs text-muted-foreground">Registro de exemplo · sem arquivo anexado</p>}
            </div>
            <span className="rounded-md bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {categoryLabel[d.category]}
            </span>
            <span className="w-16 text-right font-mono text-xs text-muted-foreground">
              {d.size}
            </span>
            {d.file && <div className="flex shrink-0 gap-1">
              <Button variant="ghost" size="icon" title="Abrir documento" aria-label={`Abrir ${d.name}`} onClick={() => setPreview(d)}><Eye /></Button>
              <Button variant="ghost" size="icon" title="Baixar documento" aria-label={`Baixar ${d.name}`} onClick={() => download(d)}><Download /></Button>
              <Button variant="ghost" size="icon" title="Remover documento" aria-label={`Remover ${d.name}`} onClick={() => setRemoving(d)}><Trash2 /></Button>
            </div>}
          </div>
        ))}
        {!filtered.length && <p className="py-10 text-center text-sm text-muted-foreground">Nenhum documento encontrado.</p>}
      </div>
      <Dialog open={Boolean(preview)} onOpenChange={value => { if (!value) setPreview(null); }}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="break-all pr-6">{preview?.name}</DialogTitle>
            <DialogDescription>{preview?.owner} · {preview?.size}</DialogDescription>
          </DialogHeader>
          {previewUrl && (preview?.file?.type.startsWith("image/") || /\.(png|jpe?g)$/i.test(preview?.name ?? "")
            ? <img src={previewUrl} alt={preview?.name} className="max-h-[60dvh] w-full object-contain" />
            : <iframe title="Visualização do documento" src={previewUrl} className="h-[55dvh] w-full rounded-md border border-border" />)}
          <div className="flex justify-end"><Button onClick={() => { if (preview) download(preview); }}><Download />Baixar arquivo</Button></div>
        </DialogContent>
      </Dialog>
      <Dialog open={Boolean(removing)} onOpenChange={value => { if (!value) setRemoving(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Remover documento?</DialogTitle><DialogDescription className="break-all">{removing?.name}</DialogDescription></DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setRemoving(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => { setDocuments(previous => previous.filter(doc => doc.id !== removing?.id)); setRemoving(null); setNotice("Documento removido do protótipo."); }}>Remover documento</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
