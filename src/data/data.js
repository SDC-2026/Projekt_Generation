/**
 * data.js — Automatischer CSV-Parser für Umfragedaten
 *
 * Liest die CSV direkt ein und berechnet alle Werte für:
 *  - Butterfly Chart (Geschlechtervergleich, 5 Fragen)
 *  - Pictogram Chart (Bereitschaft Wehrdienst, gesamt)
 *
 * Zum Aktualisieren: einfach die CSV ersetzen. Kein weiterer Code nötig.
 */

/* ── Skalierungen ─────────────────────────────────────────────────────── */

const LIKERT = {
  'Stimme voll zu':        5,
  'Stimme eher zu ':       4,
  'Stimme eher zu':        4,
  'Neutral':               3,
  'Neutral/ unentschieden':3,
  'Stimme eher nicht zu':  2,
  'Stimme gar nicht zu':   1,
};

const BEREITSCHAFT = {
  'sehr hoch':             5,
  'eher hoch':             4,
  'Neutral/ unentschieden':3,
  'eher gering':           2,
  'sehr gering':           1,
};

/* ── Spalten-Index (0-basiert, Semikolon-CSV) ────────────────────────── */
const COL = {
  geschlecht:              2,
  bereitschaft_wehrdienst: 27,   // eigene 5-stufige Skala
  institutionen_vertrauen: 31,   // Likert 1–5
  gleichberechtigung:      34,   // Likert 1–5
  soziale_sicherheit:      35,   // Likert 1–5
  bereitschaft_bei_unters: 36,   // Likert 1–5
};

/* ── CSV parsen (Browser: fetch, Node: fs) ───────────────────────────── */

async function loadCSV(path) {
  if (typeof fetch !== 'undefined') {
    const res = await fetch(path);
    return await res.text();
  } else {
    // Node.js Fallback (für Tests)
    const fs = await import('fs');
    return fs.readFileSync(path, 'utf-8');
  }
}

function parseCSV(text) {
  const lines = text.replace(/\r/g, '').split('\n').filter(Boolean);
  const rows  = lines.slice(1).map(l => l.split(';'));
  return rows;
}

/* ── Hilfsfunktionen ────────────────────────────────────────────────────*/

function scale(val, map) {
  return map[val?.trim()] ?? null;
}

function avgPercent(arr, key) {
  const vals = arr.map(r => r[key]).filter(v => v !== null);
  if (!vals.length) return 0;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 20 * 10) / 10;
  // *20 konvertiert 1–5 → 20–100 %
}

/* ── Haupt-Funktion ─────────────────────────────────────────────────────*/

export async function loadSurveyData(csvPath = './src/assets/Umfrage_GenerationsfragDefense.csv') {
  const text = await loadCSV(csvPath);
  const rows  = parseCSV(text);

  // Pro Zeile relevante Werte extrahieren
  const parsed = rows.map(r => ({
    geschlecht:              r[COL.geschlecht]?.trim(),
    bereitschaft_wehrdienst: scale(r[COL.bereitschaft_wehrdienst], BEREITSCHAFT),
    institutionen_vertrauen: scale(r[COL.institutionen_vertrauen], LIKERT),
    gleichberechtigung:      scale(r[COL.gleichberechtigung],      LIKERT),
    soziale_sicherheit:      scale(r[COL.soziale_sicherheit],      LIKERT),
    bereitschaft_bei_unters: scale(r[COL.bereitschaft_bei_unters], LIKERT),
  })).filter(r => r.geschlecht);

  /* ── Butterfly Chart ── */
  const byGender = {
    Mann:   parsed.filter(r => r.geschlecht === 'Mann'),
    Frau:   parsed.filter(r => r.geschlecht === 'Frau'),
    Divers: parsed.filter(r => r.geschlecht === 'Divers'),
    Alle:   parsed,
  };

  const butterflyQuestions = [
    { key: 'bereitschaft_wehrdienst', label: 'Bereitschaft Wehrdienst'        },
    { key: 'institutionen_vertrauen', label: 'Institutionen-Vertrauen'         },
    { key: 'gleichberechtigung',      label: 'Gleichberechtigung Dienst'       },
    { key: 'soziale_sicherheit',      label: 'Soziale Sicherheit'              },
    { key: 'bereitschaft_bei_unters', label: 'Bereitschaft bei Unterstützung'  },
  ];

  const butterflyData = butterflyQuestions.map(({ key, label }) => ({
    label,
    Mann:   avgPercent(byGender.Mann,   key),
    Frau:   avgPercent(byGender.Frau,   key),
    Divers: avgPercent(byGender.Divers, key),
    Alle:   avgPercent(byGender.Alle,   key),
  }));

  /* ── Pictogram Chart ── */
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let total = 0;
  parsed.forEach(r => {
    if (r.bereitschaft_wehrdienst !== null) {
      counts[r.bereitschaft_wehrdienst]++;
      total++;
    }
  });

  const pictogramData = {
    total,
    sehr_gering:      counts[1],
    eher_gering:      counts[2],
    neutral:          counts[3],
    eher_hoch:        counts[4],
    sehr_hoch:        counts[5],
    bereit_pct:       Math.round((counts[4] + counts[5]) / total * 1000) / 10,
    nicht_bereit_pct: Math.round((counts[1] + counts[2]) / total * 1000) / 10,
    neutral_pct:      Math.round(counts[3] / total * 1000) / 10,
  };

  /* ── N pro Geschlecht ── */
  const nByGender = {
    Mann:   byGender.Mann.length,
    Frau:   byGender.Frau.length,
    Divers: byGender.Divers.length,
    Gesamt: parsed.length,
  };

  return { butterflyData, pictogramData, nByGender };
}