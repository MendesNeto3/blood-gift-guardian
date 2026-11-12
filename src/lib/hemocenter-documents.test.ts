import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { createHemocenterDocuments, isHemocenterDocumentAllowed } from "./hemocenter-documents";

describe("Hemocenter document uploads", () => {
  it("accepts PDF, JPEG and PNG with matching types", () => {
    const formats: [string, string][] = [["exame.pdf", "application/pdf"], ["exame.JPG", "image/jpeg"], ["exame.jpeg", "image/jpeg"], ["exame.png", "image/png"]];
    for (const [name, type] of formats) {
      assert.equal(isHemocenterDocumentAllowed({ name, type, size: 100 }), true);
    }
    assert.equal(isHemocenterDocumentAllowed({ name: "exame.exe", type: "application/pdf", size: 100 }), false);
    assert.equal(isHemocenterDocumentAllowed({ name: "exame.pdf", type: "text/plain", size: 100 }), false);
  });
  it("enforces the 10 MB maximum and rejects empty files", () => {
    assert.equal(isHemocenterDocumentAllowed({ name: "exame.pdf", type: "application/pdf", size: 10 * 1024 * 1024 }), true);
    assert.equal(isHemocenterDocumentAllowed({ name: "exame.pdf", type: "application/pdf", size: 10 * 1024 * 1024 + 1 }), false);
    assert.equal(isHemocenterDocumentAllowed({ name: "exame.pdf", type: "application/pdf", size: 0 }), false);
  });
  it("retains the actual selected file and its responsible person", () => {
    const file = new File(["fictional document"], "exame.pdf", { type: "application/pdf" });
    const [doc] = createHemocenterDocuments([file], " Equipe teste ", "exame");
    assert.equal(doc?.file, file);
    assert.equal(doc?.owner, "Equipe teste");
    assert.equal(doc?.category, "exame");
    assert.throws(() => createHemocenterDocuments([file], "  ", "exame"));
  });
});