// Generiert src/charts/scatterchart/wehrpflicht-scatter-data.json
// automatisch aus der rohen Umfrage-CSV in src/data/.
//
// Läuft automatisch vor "npm run dev" und "npm run build"
// (siehe "predev" / "prebuild" in package.json).
//
// Was das Script macht:
// 1. Findet die CSV-Datei in src/data/ (die mit den meisten Zeilen,
//    falls mehrere CSVs dort liegen)
// 2. Filtert auf Gen-Z-Altersgruppen: unter 18, 18-21, 22-25, 26-29 Jahre
// 3. Berechnet x = Frage 10 (Wehrdienst-Bereitschaft),
//    y = Mittelwert aus Frage 15, 17, 18, 19 (Gesellschaftsvertrag),
//    g = Geschlecht (w/m/d/k)
// 4. Schreibt das Ergebnis als JSON

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { parse } from "csv-parse/sync";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "src", "data");
const outputPath = path.join(
  __dirname,
  "..",
  "src",
  "charts",
  "scatterchart",
  "wehrpflicht-scatter-data.json"
);

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

// CSV-Datei in src/data finden (die mit den meisten Zeilen = die rohe Exportdatei)
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

const records = bestRecords;
const columns = Object.keys(records[0]);

const cGender = findColumn(columns, "Frage 1 -");
const cAge = findColumn(columns, "Frage 2 -");
const c10 = findColumn(columns, "Frage 10 -");
const c15 = findColumn(columns, "Frage 15 -");
const c17 = findColumn(columns, "Frage 17 -");
const c18 = findColumn(columns, "Frage 18 -");
const c19 = findColumn(columns, "Frage 19 -");

if (!cGender || !cAge || !c10 || !c15 || !c17 || !c18 || !c19) {
  console.error("✗ Konnte nicht alle benötigten Spalten in der CSV finden. Bitte main.js/generate-scatter-data.mjs prüfen.");
  process.exit(1);
}

const data = [];

for (const row of records) {
  if (!AGE_GROUPS.includes(row[cAge])) continue;

  const x = LIKERT_MAP[row[c10]];
  const vals = [row[c15], row[c17], row[c18], row[c19]].map((v) => LIKERT_MAP[v]);

  if (x === undefined || vals.some((v) => v === undefined)) continue;

  const y = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100;
  const g = GENDER_MAP[row[cGender]] ?? "k";

  data.push({ x, y, g });
}

writeFileSync(outputPath, JSON.stringify(data, null, 2));

console.log(`✓ ${data.length} Datenpunkte aus "${bestFile}" nach src/charts/scatterchart/wehrpflicht-scatter-data.json geschrieben.`);
