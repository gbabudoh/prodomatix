import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import type { BusinessWithContacts } from './businesses.ts';

const __dir     = fileURLToPath(new URL('.', import.meta.url));
const LOGO_PATH = path.join(__dir, '../assets/logo.png');
function loadLogo(): Buffer | null {
  try { return fs.readFileSync(LOGO_PATH); } catch { return null; }
}

interface ExportMeta { reference?: string }

const C = {
  brand:   '#2e54d4', brandBg: '#eef2fe',
  ink:     '#181b22', ink2:    '#3a4250',
  sub:     '#616b7a', faint:   '#8a93a1',
  border:  '#e3e6eb', borderSoft: '#f2f4f6',
  bg:      '#f6f7f9', white:   '#ffffff',
  green:   '#1f8f5b', greenBg: '#e7f4ee',
};

function fmtDateTime(d = new Date()) {
  return d.toLocaleString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZoneName: 'short',
  });
}
function contactsToText(b: BusinessWithContacts) {
  return (b.contactPersons || [])
    .map(c => `${c.name} (${c.title}) ${c.email} ${c.phone}`.trim())
    .join(' | ');
}

// ─── Excel ───────────────────────────────────────────────────────────────────
const COLUMNS = [
  { header: 'Business Name',     key: 'businessName',      width: 28 },
  { header: 'Type',              key: 'businessType',       width: 14 },
  { header: 'Industry',          key: 'industry',           width: 18 },
  { header: 'Product / Service', key: 'productOrService',   width: 32 },
  { header: 'Country',           key: 'country',            width: 16 },
  { header: 'Location',          key: 'location',           width: 24 },
  { header: 'Website',           key: 'website',            width: 26 },
  { header: 'Email',             key: 'email',              width: 26 },
  { header: 'Phone',             key: 'phone',              width: 18 },
  { header: 'Staff Capacity',    key: 'staffCapacity',      width: 14 },
  { header: 'Revenue ($M)',      key: 'revenue',            width: 14 },
  { header: 'Verified Contacts', key: 'contacts',           width: 16 },
  { header: 'Contact Persons',   key: 'contactPersonsText', width: 50 },
];

export async function buildExcel(
  businesses: BusinessWithContacts[],
  meta: ExportMeta = {}
): Promise<Buffer> {
  const now = new Date();
  const wb  = new ExcelJS.Workbook();
  wb.creator = 'Prodomatix'; wb.created = now; wb.modified = now;

  const ws = wb.addWorksheet('Prodomatix Export');
  const lastCol = String.fromCharCode(64 + COLUMNS.length); // e.g. 'M'

  // ── Column widths only — no headers via ws.columns ───────────────────────
  COLUMNS.forEach((col, i) => { ws.getColumn(i + 1).width = col.width; });

  // ── Row 1: Brand name ────────────────────────────────────────────────────
  ws.getRow(1).height = 28;
  ws.mergeCells(`A1:${lastCol}1`);
  const brandCell = ws.getCell('A1');
  brandCell.value     = 'PRODOMATIX';
  brandCell.font      = { bold: true, size: 14, color: { argb: 'FF2E54D4' } };
  brandCell.alignment = { vertical: 'middle' };

  // ── Row 2: Meta line ─────────────────────────────────────────────────────
  ws.getRow(2).height = 16;
  ws.mergeCells(`A2:${lastCol}2`);
  const metaCell = ws.getCell('A2');
  metaCell.value     = `Downloaded: ${fmtDateTime(now)}   ·   Records: ${businesses.length}   ·   Ref: ${meta.reference || '—'}`;
  metaCell.font      = { size: 8.5, color: { argb: 'FF8A93A1' } };
  metaCell.alignment = { vertical: 'middle' };

  // ── Row 3: Spacer ────────────────────────────────────────────────────────
  ws.getRow(3).height = 6;

  // ── Row 4: Column headers (blue, white text) ─────────────────────────────
  ws.getRow(4).height = 22;
  COLUMNS.forEach((col, i) => {
    const cell     = ws.getCell(4, i + 1);
    cell.value     = col.header;
    cell.font      = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
    cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E54D4' } };
    cell.alignment = { vertical: 'middle', horizontal: 'left' };
  });

  // ── Row 5+: Data ─────────────────────────────────────────────────────────
  businesses.forEach((b, ri) => {
    const rowNum = 5 + ri;
    ws.getRow(rowNum).height = 18;
    const isZebra = ri % 2 === 1;

    COLUMNS.forEach((col, i) => {
      const raw  = col.key === 'contactPersonsText'
        ? contactsToText(b)
        : (b as Record<string, unknown>)[col.key];
      const cell = ws.getCell(rowNum, i + 1);

      cell.value     = (raw as ExcelJS.CellValue) ?? '';
      cell.font      = { size: 10, color: { argb: 'FF3A4250' } };
      cell.alignment = { vertical: 'middle', wrapText: col.key === 'contactPersonsText' };
      cell.fill      = {
        type: 'pattern', pattern: 'solid',
        fgColor: { argb: isZebra ? 'FFF6F7F9' : 'FFFFFFFF' },
      };
      cell.border = { bottom: { style: 'hair', color: { argb: 'FFE3E6EB' } } };
    });
  });

  // ── Auto-filter on header row, freeze rows 1-4 ───────────────────────────
  ws.autoFilter = { from: { row: 4, column: 1 }, to: { row: 4, column: COLUMNS.length } };
  ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 4 }];

  return Buffer.from(await wb.xlsx.writeBuffer());
}

// ─── PDF layout constants ────────────────────────────────────────────────────
const M        = 48;          // page margin
const ROW_H    = 19;          // fixed height for every field row
const LABEL_W  = 80;          // label column width
const HEAD_H   = 86;          // page header block total height
const FOOT_H   = 28;          // footer reserved height

// Field grid: two columns, each = half of content width
// CW = 595.28 - 48*2 = 499.28
// Half col: (499.28 - 20gap) / 2 = 239.64
// Value in each half col: 239.64 - 80 LABEL = 159.64
const GAP      = 20;

type Doc = InstanceType<typeof PDFDocument>;

function fill(doc: Doc, hex: string) {
  const n = parseInt(hex.slice(1), 16);
  doc.fillColor([n >> 16 & 255, n >> 8 & 255, n & 255] as unknown as string);
}
function stroke(doc: Doc, hex: string) {
  const n = parseInt(hex.slice(1), 16);
  doc.strokeColor([n >> 16 & 255, n >> 8 & 255, n & 255] as unknown as string);
}

/** Draws a label (uppercase faint) + value on a single fixed-height row. */
function kv(doc: Doc, label: string, value: string | number | null | undefined,
            x: number, y: number, valW: number) {
  if (value === null || value === undefined || value === '') return;
  doc.font('Helvetica').fontSize(7).fillColor(C.faint)
    .text(label.toUpperCase(), x, y + 2, { width: LABEL_W, lineBreak: false });
  doc.font('Helvetica').fontSize(9).fillColor(C.ink2)
    .text(String(value), x + LABEL_W, y, { width: valW, height: ROW_H, lineBreak: false, ellipsis: true });
}

/** Calculates how tall a record card will be (in points). */
function cardHeight(b: BusinessWithContacts): number {
  let h = 40;                                              // title bar
  if (b.productOrService) h += ROW_H + 12;                // full-width product row
  h += 4 * ROW_H + 8;                                     // 4 field rows
  if ((b.contactPersons?.length ?? 0) > 0) {
    h += 10 + 8 + 14 + 12;                                // rule + label + col heads + gap
    h += (b.contactPersons!.length) * ROW_H;
  }
  h += 16;                                                 // bottom padding + rule
  return h;
}

function drawPageHeader(doc: Doc, logo: Buffer | null, now: Date,
                        total: number, meta: ExportMeta, PW: number) {
  const y0 = 26;
  // Logo
  if (logo) doc.image(logo, M, y0, { height: 24 });
  else {
    doc.font('Helvetica-Bold').fontSize(14).fillColor(C.brand)
      .text('PRODOMATIX', M, y0 + 3, { lineBreak: false });
  }

  // Right meta block — two lines, right-aligned, within 200pt from right margin
  const rw = 210;
  const rx = PW - M - rw;
  doc.font('Helvetica').fontSize(7.5).fillColor(C.faint)
    .text('Downloaded', rx, y0, { width: rw, align: 'right', lineBreak: false });
  doc.font('Helvetica').fontSize(7.5).fillColor(C.sub)
    .text(fmtDateTime(now), rx, y0 + 10, { width: rw, align: 'right', lineBreak: false });

  // Divider 1
  const d1 = y0 + 30;
  stroke(doc, C.border); doc.moveTo(M, d1).lineTo(PW - M, d1).lineWidth(0.5).stroke();

  // Sub-header line
  const sh = d1 + 9;
  doc.font('Helvetica-Bold').fontSize(12).fillColor(C.ink)
    .text('B2B Business Data Export', M, sh, { lineBreak: false });

  // Badges (right side of sub-header)
  const recLabel = `${total} record${total !== 1 ? 's' : ''}`;
  const recW     = doc.font('Helvetica-Bold').fontSize(7.5).widthOfString(recLabel) + 16;
  let bx = PW - M - recW;
  fill(doc, C.brandBg); doc.roundedRect(bx, sh + 1, recW, 15, 3).fill();
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C.brand)
    .text(recLabel, bx + 8, sh + 4, { width: recW - 16, lineBreak: false });

  if (meta.reference) {
    const refLabel = `Ref: ${meta.reference}`;
    const refW     = doc.font('Helvetica-Bold').fontSize(7.5).widthOfString(refLabel) + 16;
    bx -= refW + 6;
    fill(doc, C.greenBg); doc.roundedRect(bx, sh + 1, refW, 15, 3).fill();
    doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C.green)
      .text(refLabel, bx + 8, sh + 4, { width: refW - 16, lineBreak: false });
  }

  // Divider 2
  const d2 = sh + 22;
  stroke(doc, C.border); doc.moveTo(M, d2).lineTo(PW - M, d2).lineWidth(1).stroke();
}

function drawRecord(doc: Doc, b: BusinessWithContacts, idx: number, y: number, PW: number) {
  const CW    = PW - M * 2;
  const halfW = (CW - GAP) / 2;          // ~239.64
  const valW  = halfW - LABEL_W;          // ~159.64
  const col2X = M + halfW + GAP;

  let cy = y;

  // ── Title bar ──────────────────────────────────────────────────────────────
  // Light bg strip
  fill(doc, C.bg); doc.rect(M, cy, CW, 36).fill();

  // Number badge (solid blue strip on left)
  fill(doc, C.brand); doc.rect(M, cy, 30, 36).fill();
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(C.white)
    .text(String(idx + 1).padStart(2, '0'), M, cy + 12, { width: 30, align: 'center', lineBreak: false });

  // Company name (truncated to one line)
  doc.font('Helvetica-Bold').fontSize(11.5).fillColor(C.ink)
    .text(b.businessName, M + 38, cy + 5, { width: CW - 38, lineBreak: false, ellipsis: true });

  // Type · Industry · Country subtitle
  const sub = [b.businessType, b.industry, b.country].filter(Boolean).join('  ·  ');
  doc.font('Helvetica').fontSize(8.5).fillColor(C.sub)
    .text(sub, M + 38, cy + 21, { width: CW - 38, lineBreak: false, ellipsis: true });

  cy += 40;

  // ── Product / Service (full-width, if present) ─────────────────────────────
  if (b.productOrService) {
    cy += 4;
    doc.font('Helvetica').fontSize(7).fillColor(C.faint)
      .text('PRODUCT / SERVICE', M, cy, { lineBreak: false });
    cy += 10;
    doc.font('Helvetica').fontSize(9).fillColor(C.ink2)
      .text(b.productOrService, M, cy, { width: CW, height: ROW_H, lineBreak: false, ellipsis: true });
    cy += ROW_H + 4;

    stroke(doc, C.borderSoft); doc.moveTo(M, cy).lineTo(M + CW, cy).lineWidth(0.4).stroke();
    cy += 6;
  }

  // ── Field grid — 4 rows × 2 columns (all fixed height) ────────────────────
  cy += 4;

  // Row 0: Country | Industry
  kv(doc, 'Country',   b.country,   M,     cy, valW);
  kv(doc, 'Industry',  b.industry,  col2X, cy, valW);
  cy += ROW_H;

  // Row 1: Location | Website
  kv(doc, 'Location',  b.location,  M,     cy, valW);
  kv(doc, 'Website',   b.website,   col2X, cy, valW);
  cy += ROW_H;

  // Row 2: Email | Phone
  kv(doc, 'Email',     b.email,     M,     cy, valW);
  kv(doc, 'Phone',     b.phone,     col2X, cy, valW);
  cy += ROW_H;

  // Row 3: Staff capacity | Revenue
  const staff = b.staffCapacity ? `${b.staffCapacity} employees` : null;
  const rev   = b.revenue       ? `$${b.revenue}M annual`        : null;
  kv(doc, 'Staff capacity', staff, M,     cy, valW);
  kv(doc, 'Revenue',        rev,   col2X, cy, valW);
  cy += ROW_H;

  // Row 4: Verified contacts (left only)
  const vc = b.contacts ? `${b.contacts} verified` : null;
  kv(doc, 'Verified contacts', vc, M, cy, valW);
  cy += ROW_H;

  cy += 4;

  // ── Contact persons table ──────────────────────────────────────────────────
  if (b.contactPersons?.length) {
    stroke(doc, C.borderSoft); doc.moveTo(M, cy).lineTo(M + CW, cy).lineWidth(0.4).stroke();
    cy += 8;

    // Section label
    doc.font('Helvetica-Bold').fontSize(7).fillColor(C.faint)
      .text('CONTACT PERSONS', M, cy, { lineBreak: false });
    cy += 13;

    // Column header row
    const CC = { name: M, title: M + 136, email: M + 270, phone: M + 390 };
    const CWS = { name: 128, title: 126, email: 112, phone: CW - 390 };
    doc.font('Helvetica-Bold').fontSize(6.5).fillColor(C.faint);
    (['NAME', 'TITLE', 'EMAIL', 'PHONE'] as const).forEach((h) => {
      const x = CC[h.toLowerCase() as keyof typeof CC];
      const w = CWS[h.toLowerCase() as keyof typeof CWS];
      doc.text(h, x, cy, { width: w, lineBreak: false });
    });
    cy += 11;

    // Thin rule under col headers
    stroke(doc, C.borderSoft); doc.moveTo(M, cy).lineTo(M + CW, cy).lineWidth(0.3).stroke();
    cy += 2;

    b.contactPersons.forEach((c, ci) => {
      // Zebra stripe
      if (ci % 2 === 0) { fill(doc, C.bg); doc.rect(M, cy, CW, ROW_H - 2).fill(); }

      doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C.ink2)
        .text(c.name  || '—', CC.name,  cy + 4, { width: CWS.name,  lineBreak: false, ellipsis: true });
      doc.font('Helvetica').fontSize(8.5).fillColor(C.sub)
        .text(c.title || '—', CC.title, cy + 4, { width: CWS.title, lineBreak: false, ellipsis: true });
      doc.font('Helvetica').fontSize(8.5).fillColor(C.sub)
        .text(c.email || '—', CC.email, cy + 4, { width: CWS.email, lineBreak: false, ellipsis: true });
      doc.font('Helvetica').fontSize(8.5).fillColor(C.faint)
        .text(c.phone || '—', CC.phone, cy + 4, { width: CWS.phone, lineBreak: false, ellipsis: true });

      cy += ROW_H;
    });
    cy += 2;
  }

  // ── Bottom rule ────────────────────────────────────────────────────────────
  cy += 8;
  stroke(doc, C.border); doc.moveTo(M, cy).lineTo(M + CW, cy).lineWidth(0.75).stroke();
  return cy + 10;   // return next Y
}

// ─── PDF entry point ─────────────────────────────────────────────────────────
export function buildPdf(
  businesses: BusinessWithContacts[],
  meta: ExportMeta = {}
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const logo = loadLogo();
    const now  = new Date();
    const doc  = new PDFDocument({ margin: 0, size: 'A4', bufferPages: true });
    const chunks: Buffer[] = [];
    doc.on('data',  (c: Buffer) => chunks.push(c));
    doc.on('end',   () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const PW = doc.page.width;   // 595.28
    const PH = doc.page.height;  // 841.89

    drawPageHeader(doc, logo, now, businesses.length, meta, PW);
    let y = HEAD_H;

    businesses.forEach((b, i) => {
      const needed = cardHeight(b);
      if (i > 0 && y + needed > PH - FOOT_H - 10) {
        doc.addPage();
        drawPageHeader(doc, logo, now, businesses.length, meta, PW);
        y = HEAD_H;
      }
      y = drawRecord(doc, b, i, y, PW);
    });

    // ── Footer on every page ─────────────────────────────────────────────────
    const range = doc.bufferedPageRange();
    for (let p = 0; p < range.count; p++) {
      doc.switchToPage(range.start + p);
      const fy = PH - 20;
      stroke(doc, C.border); doc.moveTo(M, fy - 6).lineTo(PW - M, fy - 6).lineWidth(0.4).stroke();
      const CW = PW - M * 2;
      doc.font('Helvetica').fontSize(7).fillColor(C.faint)
        .text('prodomatix.com  ·  Confidential — for authorised recipients only',
          M, fy, { width: CW, align: 'left', lineBreak: false });
      doc.font('Helvetica').fontSize(7).fillColor(C.faint)
        .text(`Page ${p + 1} of ${range.count}`,
          M, fy, { width: CW, align: 'right', lineBreak: false });
    }

    doc.end();
  });
}
