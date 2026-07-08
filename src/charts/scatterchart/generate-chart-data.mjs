// Generiert alle Chart-Datendateien automatisch aus der rohen Umfrage-CSV
// in src/data/. Läuft automatisch vor "npm run dev" und "npm run build"
// (siehe "predev" / "prebuild" in package.json).
//
// Erzeugt:
//   - src/charts/scatterchart/wehrpflicht-scatter-data.json
//   - src/charts/butterfly/butterfly-data.json
//
// Gemeinsamer Ablauf für alle Charts:
// 1. CSV in src/data/ finden (die mit den meisten Zeilen, falls mehrere dort liegen)
// 2. Auf Gen-Z-Altersgruppen filtern: unter 18, 18-21, 22-25, 26-29 Jahre
// 3. Pro Chart die benötigten Spalten auswerten und als JSON schreiben

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { parse } from "csv-parse/sync";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "src", "data");
const chartsDir = path.join(__dirname, "..", "src", "charts");

const AGE_GROUPS = ["unter 18 Jahre", "18-21 Jahre", "22-25 Jahre", "26-29 Jahre"];

const LIKERT_MAP = {
  "sehr gering": 1,
  "eher gering": 2,
  "Neutral/ unentschieden": 3,
  "eher hoch": 4,
  "sehr hoch": 5,
  "Stimme gar nicht zu": 1,
  "Stimme eher nicht zu": 2,
  "Neutral": 3,
  "Stimme eher zu ": 4,
  "Stimme voll zu": 5
};

const GENDER_MAP = {
  "Frau": "w",
  "Mann": "m",
  "Divers": "d",
  "keine Angabe": "k"
};

function findColumn(columns, prefix) {
  return columns.find((c) => c.startsWith(prefix));
}

function loadCsv(filePath) {
  const raw = readFileSync(filePath, "utf-8").replace(/^\uFEFF+/, "");
  return parse(raw, { delimiter: ";", columns: true, relax_column_count: true });
}

// ─── CSV finden und laden ───

const csvFiles = readdirSync(dataDir).filter((f) => f.toLowerCase().endsWith(".csv"));

if (csvFiles.length === 0) {
  console.error(`✗ Keine CSV-Datei in ${dataDir} gefunden.`);
  process.exit(1);
}

let bestFile = null;
let bestRecords = null;

for (const file of csvFiles) {
  const records = loadCsv(path.join(dataDir, file));
  if (!bestRecords || records.length > bestRecords.length) {
    bestFile = file;
    bestRecords = records;
  }
}

const allRecords = bestRecords;
const columns = Object.keys(allRecords[0]);

const cGender = findColumn(columns, "Frage 1 -");
const cAge = findColumn(columns, "Frage 2 -");

if (!cGender || !cAge) {
  console.error("✗ Konnte Geschlechts- oder Altersspalte nicht in der CSV finden.");
  process.exit(1);
}

// Einmal zentral auf Gen-Z filtern, alle Charts arbeiten mit denselben Zeilen
const records = allRecords.filter((row) => AGE_GROUPS.includes(row[cAge]));

console.log(`→ Quelle: "${bestFile}" (${allRecords.length} Zeilen gesamt, ${records.length} nach Gen-Z-Filter)`);

// ==========================================================
// SCATTERPLOT: Wehrdienst-Bereitschaft & Gesellschaftsvertrag
// x = Frage 10, y = Mittelwert aus Frage 9, 12, 13, 14, 15
// (reine Wahrnehmungs-/Vertrauens-Items zur Erfüllung des
// Gesellschaftsvertrags durch den Staat; normative/persönliche
// Werte-Items 16-19 bewusst ausgeschlossen)
// ==========================================================

function generateScatterData() {
  const c10 = findColumn(columns, "Frage 10 -");
  const c9 = findColumn(columns, "Frage 9 -");
  const c12 = findColumn(columns, "Frage 12 -");
  const c13 = findColumn(columns, "Frage 13 -");
  const c14 = findColumn(columns, "Frage 14 -");
  const c15 = findColumn(columns, "Frage 15 -");

  if (!c10 || !c9 || !c12 || !c13 || !c14 || !c15) {
    console.error("✗ Scatterplot: Konnte nicht alle benötigten Spalten finden. Übersprungen.");
    return;
  }

  const data = [];

  for (const row of records) {
    const x = LIKERT_MAP[row[c10]];
    const vals = [row[c9], row[c12], row[c13], row[c14], row[c15]].map((v) => LIKERT_MAP[v]);

    if (x === undefined || vals.some((v) => v === undefined)) continue;

    const y = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100;
    const g = GENDER_MAP[row[cGender]] ?? "k";

    data.push({ x, y, g });
  }

  const outputPath = path.join(chartsDir, "scatterchart", "wehrpflicht-scatter-data.json");
  writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`✓ Scatterplot: ${data.length} Datenpunkte → src/charts/scatterchart/wehrpflicht-scatter-data.json`);
}

// ==========================================================
// BUTTERFLY: Frage 6 (wirtschaftliche Zukunft) vs. Frage 9 (politische Wahrnehmung)
// Prozentuale Verteilung je Antwortstufe (1-5), aufgeschlüsselt nach Geschlecht
// ==========================================================

function generateButterflyData() {
  const c6 = findColumn(columns, "Frage 6 -");
  const c9 = findColumn(columns, "Frage 9 -");

  if (!c6 || !c9) {
    console.error("✗ Butterfly: Konnte Frage 6 / Frage 9 nicht finden. Übersprungen.");
    return;
  }

  const validRows = records.filter(
    (row) => LIKERT_MAP[row[c6]] !== undefined && LIKERT_MAP[row[c9]] !== undefined
  );

  function pctDist(rows, col) {
    const n = rows.length;
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    rows.forEach((row) => {
      const score = LIKERT_MAP[row[col]];
      counts[score] += 1;
    });
    const dist = {};
    for (const s of [5, 4, 3, 2, 1]) {
      dist[s] = n > 0 ? Math.round((counts[s] / n) * 1000) / 10 : 0;
    }
    return dist;
  }

  const groups = {
    alle: validRows,
    Mann: validRows.filter((r) => r[cGender] === "Mann"),
    Frau: validRows.filter((r) => r[cGender] === "Frau"),
    Divers: validRows.filter((r) => r[cGender] === "Divers")
  };

  const result = {};
  for (const [name, rows] of Object.entries(groups)) {
    result[name] = {
      q6: pctDist(rows, c6),
      q9: pctDist(rows, c9),
      n: rows.length
    };
  }

  const outputPath = path.join(chartsDir, "butterfly", "butterfly-data.json");
  writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`✓ Butterfly: n=${result.alle.n} → src/charts/butterfly/butterfly-data.json`);
}

// ==========================================================
// BUBBLE CHART: Bedingungen für Akzeptanz eines Pflichtdienstes
// (sichtbare Fragennummer "15.", CSV-Spalten-ID "Frage 20", Mehrfachauswahl)
// ==========================================================

function generateBubbleData() {
  const optionCols = columns.filter((c) => c.startsWith("Frage 20 -") && c !== "Frage 20 - Eingabe für Sonstiges");

  if (optionCols.length === 0) {
    console.error("✗ Bubble Chart: Konnte Frage 20 (Bedingungen) nicht finden. Übersprungen.");
    return;
  }

  const LABELS = {
    "Politische Repräsentation": "politische_repraesentation",
    "Existenzsicherung": "existenzsicherung",
    "Zukunftsperspektiven": "zukunftsperspektiven",
    "Sinnhaftigkeit": "sinnhaftigkeit",
    "Angemessene Vergütung": "verguetung",
    "Berufliche Vorteile": "berufliche_vorteile",
    "Lastengerechtigkeit": "lastengerechtigkeit",
    "Eine unmittelbare und unumstrittene äußere Gefahr": "aeussere_gefahr",
    "Ich bin ohnehin bereit": "ohnehin_bereit",
    "Ich lehne eine Dienstpflicht": "lehnt_ab",
    "Sonstiges": "sonstiges"
  };

  function shortLabel(optionText) {
    for (const [prefix, id] of Object.entries(LABELS)) {
      if (optionText.includes(prefix)) return id;
    }
    return optionText.slice(0, 20);
  }

  function computeGroup(rows) {
    const answeredRows = rows.filter((row) => optionCols.some((c) => row[c] && row[c].trim() !== ""));
    const total = answeredRows.length;

    const items = optionCols.map((col) => {
      const optionText = col.split(" - ").pop();
      const count = answeredRows.filter((row) => row[col] && row[col].trim() !== "").length;
      return {
        id: shortLabel(optionText),
        label: optionText,
        count,
        pct: total > 0 ? Math.round((count / total) * 1000) / 10 : 0
      };
    });

    return { total, items };
  }

  const genderGroups = {
    all: records,
    w: records.filter((r) => r[cGender] === "Frau"),
    m: records.filter((r) => r[cGender] === "Mann"),
    d: records.filter((r) => r[cGender] === "Divers"),
    k: records.filter((r) => r[cGender] === "keine Angabe")
  };

  const result = {};
  for (const [key, rows] of Object.entries(genderGroups)) {
    result[key] = computeGroup(rows);
  }

  const outputPath = path.join(chartsDir, "bubblechart", "bubblechart-data.json");
  writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`✓ Bubble Chart: ${optionCols.length} Bedingungen × 5 Gruppen, n=${result.all.total} → src/charts/bubblechart/bubblechart-data.json`);
}

generateScatterData();
generateButterflyData();
generateBubbleData();
