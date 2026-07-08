// ==========================================================
// PICTOGRAM: Frage 21
// Bevorzugter Einsatzbereich bei allgemeiner Dienstpflicht
// ==========================================================

export function generatePictogramData() {
  const c21 = findColumn(columns, "Frage 21 -");

  if (!c21) {
    console.error("✗ Pictogram: Konnte Frage 21 nicht finden. Übersprungen.");
    return;
  }

  const ANSWERS = {
    "Ziviler Rettungsdienst (Katastrophenschutz, Feuerwehr, THW)": "rettung",
    "Militärischer Dienst (Bundeswehr)": "militar",
    "Ökologischer Dienst (Umweltschutz, Klimaprojekte, Forstwirtschaft)": "okologie",
    "Sozialer Dienst (Pflege, Altenhilfe, soziale Einrichtungen)": "sozial",
    "Ich würde versuchen, mich aus gesundheitlichen oder persönlichen Gründen offiziell vom Dienst befreien zu lassen.": "befreiung",
    "Ich würde den Dienst komplett verweigern, selbst wenn mir dadurch rechtliche Konsequenzen (z. B. Geldstrafen) drohen.": "verweigerung"
  };

  const validRows = records.filter(
    (row) => ANSWERS[row[c21]] !== undefined
  );

  function pctDist(rows) {
    const n = rows.length;

    const counts = {
      rettung: 0,
      militar: 0,
      okologie: 0,
      sozial: 0,
      befreiung: 0,
      verweigerung: 0
    };

    rows.forEach((row) => {
      const key = ANSWERS[row[c21]];
      if (key) counts[key]++;
    });

    const result = {};

    for (const key of Object.keys(counts)) {
      result[key] =
        n > 0 ? Math.round((counts[key] / n) * 1000) / 10 : 0;
    }

    result.n = n;

    return result;
  }

  const groups = {
    alle: validRows,
    Mann: validRows.filter((r) => r[cGender] === "Mann"),
    Frau: validRows.filter((r) => r[cGender] === "Frau"),
    Divers: validRows.filter((r) => r[cGender] === "Divers")
  };

  const result = {};

  for (const [name, rows] of Object.entries(groups)) {
    result[name] = pctDist(rows);
  }

  const outputPath = path.join(
    chartsDir,
    "pictogram_chart",
    "pictogram-data.json"
  );

  writeFileSync(outputPath, JSON.stringify(result, null, 2));

  console.log(
    `✓ Pictogram: n=${result.alle.n} → src/charts/pictogram_chart/pictogram-data.json`
  );
}