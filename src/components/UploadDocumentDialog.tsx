import { useRef, useState, type DragEvent, type FormEvent } from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { StoredDocument } from "@/lib/mock-data";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = ".pdf,.jpg,.jpeg,.png";
const categories: { value: StoredDocument["category"]; label: string }[] = [
  { value: "exame", label: "Exame" },
  { value: "termo", label: "Termo de consentimento" },
  { value: "triagem", label: "Ficha de triagem" },
  { value: "certificado", label: "Certificado" },
];

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

const field =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function UploadDocumentDialog({
  open,
  onOpenChange,
  onUploaded,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploaded: (docs: StoredDocument[]) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  function addFiles(list: FileList | null) {
    if (!list) return;
    const accepted: File[] = [];
    let rejected = false;
    for (const f of Array.from(list)) {
      if (f.size > MAX_BYTES || !/\.(pdf|jpe?g|png)$/i.test(f.name)) rejected = true;
      else accepted.push(f);
    }
    setError(rejected ? "Alguns arquivos foram ignorados: use PDF, JPG ou PNG de até 10 MB." : "");
    setFiles((prev) => [...prev, ...accepted]);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }

  function reset() {
    setFiles([]);
    setError("");
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!files.length) {
      setError("Selecione ao menos um arquivo.");
      return;
    }
    const data = new FormData(e.currentTarget);
    const owner = String(data.get("owner")).trim();
    const category = data.get("category") as StoredDocument["category"];
    const uploadedAt = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).replace(/\./g, "").replace(/ de /g, " ");
    onUploaded(
      files.map((f, i) => ({
        id: `DOC-${Date.now().toString().slice(-4)}${i}`,
        name: f.name,
        category,
        size: formatSize(f.size),
        uploadedAt,
        owner,
      })),
    );
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <p className="font-mono text-xs text-primary">SERVIÇO DE DOCUMENTOS</p>
          <DialogTitle className="font-display text-2xl">Enviar documento</DialogTitle>
          <DialogDescription>Anexe exames, termos, fichas de triagem ou certificados.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-5">
          <div
            role="button"
            tabIndex={0}
            onClick={() => input.current?.click()}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${dragging ? "border-primary bg-accent" : "border-border bg-background hover:border-primary/60"}`}
          >
            <UploadCloud className="size-9 text-primary" />
            <p className="mt-3 text-sm font-medium">Arraste os arquivos aqui ou clique para selecionar</p>
            <p className="mt-1 text-xs text-muted-foreground">PDF, JPG ou PNG · até 10 MB cada</p>
            <input ref={input} type="file" multiple accept={ACCEPT} className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
          </div>

          {files.length > 0 && (
            <ul className="max-h-40 space-y-2 overflow-auto">
              {files.map((f, i) => (
                <li key={`${f.name}-${i}`} className="flex items-center gap-3 rounded-xl bg-background p-3 ring-1 ring-border">
                  <FileText className="size-4 shrink-0 text-primary" />
                  <span className="min-w-0 flex-1 truncate text-sm">{f.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{formatSize(f.size)}</span>
                  <button type="button" aria-label={`Remover ${f.name}`} onClick={() => setFiles((p) => p.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-primary">
                    <X className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-medium">Categoria</span>
              <select name="category" required defaultValue="exame" className={field}>
                {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium">Responsável / doador</span>
              <input name="owner" required minLength={2} maxLength={120} placeholder="Ex.: Marina Lopes" className={field} />
            </label>
          </div>

          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Enviar {files.length > 1 ? `${files.length} arquivos` : "documento"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
