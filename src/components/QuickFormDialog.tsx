import { useState, type FormEvent } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export type Field = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "time" | "select";
  options?: readonly string[];
  placeholder?: string;
  min?: number;
  defaultValue?: string;
};

const field =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function QuickFormDialog({
  open, onOpenChange, eyebrow, title, description, fields, submitLabel, onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  eyebrow: string;
  title: string;
  description: string;
  fields: Field[];
  submitLabel: string;
  /** Retorne uma mensagem de erro para impedir o envio. */
  onSubmit: (values: Record<string, string>) => string | void;
}) {
  const [error, setError] = useState("");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = Object.fromEntries(
      Array.from(new FormData(e.currentTarget)).map(([k, v]) => [k, String(v).trim()]),
    );
    const err = onSubmit(values);
    if (err) { setError(err); return; }
    setError("");
    onOpenChange(false);
  }
  return (
    <Dialog open={open} onOpenChange={(o) => { setError(""); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <p className="font-mono text-xs uppercase text-primary">{eyebrow}</p>
          <DialogTitle className="font-display text-2xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <label key={f.name} className="space-y-2 text-sm">
                <span className="font-medium">{f.label}</span>
                {f.type === "select" ? (
                  <select name={f.name} required defaultValue={f.defaultValue ?? f.options?.[0]} className={field}>
                    {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input name={f.name} required type={f.type ?? "text"} min={f.min} maxLength={150}
                    defaultValue={f.defaultValue} placeholder={f.placeholder} className={field} />
                )}
              </label>
            ))}
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">{submitLabel}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function formatDateBR(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).replace(/\./g, "").replace(/ de /g, " ");
}

export function isPastDate(iso: string) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return new Date(`${iso}T00:00:00`) < today;
}

export const newId = (prefix: string) => `${prefix}-${Date.now().toString().slice(-4)}`;
