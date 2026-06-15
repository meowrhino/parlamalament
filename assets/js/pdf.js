// ============================================================
// pdf.js — generació del certificat/justificant en PDF amb jsPDF (CDN).
//   Espera el global window.jspdf.jsPDF. Disposa un document A4 sobri amb
//   capçalera de marca, caixa de metadades i blocs de contingut.
// ============================================================

/**
 * @typedef {Object} PdfBlock
 * @property {string} [heading]   títol del bloc (opcional)
 * @property {string} [text]      paràgraf llarg (es parteix en línies)
 * @property {[string,string][]} [rows]  parelles etiqueta/valor
 */

/**
 * @param {Object} spec
 * @param {string} spec.filename
 * @param {string} spec.organisme   text petit de capçalera (organisme emissor)
 * @param {string} spec.title       títol gran
 * @param {string} [spec.result]    línia destacada (p. ex. "RESULTAT: APROVAT")
 * @param {[string,string][]} spec.meta  metadades (Expedient, Data, Estat…)
 * @param {PdfBlock[]} [spec.blocks]
 * @param {string} [spec.footer]
 */
export function makePdf(spec) {
  const JsPDF = window.jspdf && window.jspdf.jsPDF;
  if (!JsPDF) { alert("No s'ha pogut carregar el generador de PDF."); return; }

  const doc = new JsPDF({ unit: "mm", format: "a4" });
  const PAGE_W = 210, PAGE_H = 297, M = 20;       // marges
  const RED = [219, 57, 42], INK = [20, 20, 20], SOFT = [90, 90, 90];
  let y = 0;

  const ensure = (need) => {
    if (y + need > PAGE_H - M) { doc.addPage(); y = M; }
  };
  const para = (text, size, color, lh, maxW = PAGE_W - M * 2) => {
    doc.setFontSize(size); doc.setTextColor(...color);
    doc.splitTextToSize(text, maxW).forEach((line) => {
      ensure(lh); doc.text(line, M, y); y += lh;
    });
  };

  // Capçalera de marca (banda vermella)
  doc.setFillColor(...RED); doc.rect(0, 0, PAGE_W, 26, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold"); doc.setFontSize(13);
  doc.text("El Parlamalament de l'Artista", M, 12);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9);
  doc.text(spec.organisme || "", M, 19);
  y = 40;

  // Títol
  doc.setFont("helvetica", "bold"); doc.setTextColor(...RED);
  para(spec.title, 18, RED, 9);
  y += 2;

  // Resultat destacat
  if (spec.result) {
    doc.setFont("helvetica", "bold");
    para(spec.result, 14, INK, 8);
    y += 2;
  }
  doc.setFont("helvetica", "normal");

  // Caixa de metadades
  if (spec.meta && spec.meta.length) {
    const boxTop = y;
    const rowH = 7, padX = 4;
    const boxH = rowH * spec.meta.length + 4;
    ensure(boxH);
    doc.setDrawColor(...RED); doc.setLineWidth(0.4);
    doc.rect(M, boxTop, PAGE_W - M * 2, boxH);
    let ry = boxTop + 6;
    spec.meta.forEach(([k, v]) => {
      doc.setFont("helvetica", "bold"); doc.setTextColor(...INK); doc.setFontSize(10);
      doc.text(`${k}:`, M + padX, ry);
      doc.setFont("helvetica", "normal"); doc.setTextColor(...SOFT);
      doc.text(String(v), M + padX + 42, ry);
      ry += rowH;
    });
    y = boxTop + boxH + 8;
  }

  // Blocs de contingut
  (spec.blocks || []).forEach((b) => {
    if (b.heading) {
      y += 2; ensure(8);
      doc.setFont("helvetica", "bold"); para(b.heading, 11, RED, 6.5);
      doc.setFont("helvetica", "normal");
    }
    if (b.text) para(b.text, 10, INK, 5.6);
    (b.rows || []).forEach(([k, v]) => {
      doc.setFont("helvetica", "bold"); para(k, 9.5, INK, 5.2);
      doc.setFont("helvetica", "normal"); para(v || "—", 9.5, SOFT, 5.2);
      y += 1.5;
    });
  });

  // Peu
  if (spec.footer) {
    y = Math.max(y, PAGE_H - M - 16);
    doc.setDrawColor(210, 210, 210); doc.setLineWidth(0.2);
    doc.line(M, y, PAGE_W - M, y); y += 5;
    doc.setFont("helvetica", "italic");
    para(spec.footer, 8.5, SOFT, 4.6);
    doc.setFont("helvetica", "normal");
  }

  doc.save(spec.filename);
}
