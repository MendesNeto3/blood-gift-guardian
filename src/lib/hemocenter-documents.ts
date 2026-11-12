import type { StoredDocument } from "./mock-data";

export const DOCUMENT_MAX_BYTES = 10 * 1024 * 1024;
export const DOCUMENT_ACCEPT = ".pdf,.jpg,.jpeg,.png";
export type HemocenterDocument = StoredDocument & { file?: File };

export function isHemocenterDocumentAllowed(file: Pick<File, "name" | "size" | "type">) {
  const mime = /\.pdf$/i.test(file.name) ? "application/pdf"
    : /\.jpe?g$/i.test(file.name) ? "image/jpeg"
    : /\.png$/i.test(file.name) ? "image/png" : null;
  return file.size > 0 && file.size <= DOCUMENT_MAX_BYTES && mime !== null && (!file.type || file.type === mime);
}

export function formatDocumentSize(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function createHemocenterDocuments(files: File[], owner: string, category: StoredDocument["category"]): HemocenterDocument[] {
  if (owner.trim().length < 2 || owner.trim().length > 120) throw new Error("Informe o nome do responsável, com 2 a 120 caracteres.");
  if (!["exame", "termo", "triagem", "certificado"].includes(category)) throw new Error("Selecione uma categoria válida.");
  if (!files.length || files.some(file => !isHemocenterDocumentAllowed(file))) throw new Error("Selecione arquivos PDF, JPG ou PNG de até 10 MB, não vazios.");
  const uploadedAt = new Date().toLocaleDateString("pt-BR");
  return files.map(file => ({ id: crypto.randomUUID(), name: file.name, category, size: formatDocumentSize(file.size), uploadedAt, owner: owner.trim(), file }));
}