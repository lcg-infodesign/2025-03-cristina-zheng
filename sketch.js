// === Variabili globali ===
let volcanoTable;
let volcanoes = [];
let hoveredVolcano = null;

// === Preload: carica il dataset ===
function preload() {
  volcanoTable = loadTable('assets/data.csv', 'csv', 'header');
}

// === Setup: crea canvas e processa dati ===
function setup() {
  const vis = document.getElementById('visualization');
  let canvas = createCanvas(vis.clientWidth, vis.clientHeight);
  canvas.parent('visualization');

  processData();
  textFont('Arial');
  textAlign(CENTER, CENTER);
}

// === Estrae i dati dal CSV ===
function processData() {
  volcanoes = [];

  for (let i = 0; i < volcanoTable.getRowCount(); i++) {
    const row = volcanoTable.getRow(i);
    volcanoes.push({
      name: row.get('Volcano Name'),
      country: row.get('Country'),
      lat: parseFloat(row.get('Latitude')),
      lon: parseFloat(row.get('Longitude')),
      elev: parseFloat(row.get('Elevation (m)'))
    });
  }

  console.log('Vulcani caricati:', volcanoes.length);
}

// === Draw: disegna tutto ===
function draw() {
  background(240);

  // titolo e legenda
  drawLegend();

  // disegno vulcani
  hoveredVolcano = null;
  volcanoes.forEach(v => {
    const pos = project(v.lat, v.lon);
    drawVolcano(v, pos.x, pos.y);
  });

  // tooltip se hover
  if (hoveredVolcano) {
    drawTooltip(hoveredVolcano);
  }
}

// === Proiezione grezza da lat/lon a coordinate canvas ===
function project(lat, lon) {
  let x = map(lon, -180, 180, 50, width - 50);
  let y = map(lat, 90, -90, 50, height - 50);
  return { x, y };
}

// === Disegna ogni vulcano come triangolo ===
function drawVolcano(v, x, y) {
  let size = map(v.elev, 0, 6000, 5, 25);
  let col = color(120);
  let d = dist(mouseX, mouseY, x, y);

  if (d < size) {
    col = color(255, 80, 0);
    hoveredVolcano = v;
  }

  push();
  translate(x, y);
  noStroke();
  fill(col);
  triangle(0, -size / 2, -size / 2, size / 2, size / 2, size / 2);
  pop();
}

// === Disegna legenda ===
function drawLegend() {
  fill(0);
  textSize(16);
  text("Visualizzazione dei Vulcani nel Mondo", width / 2, 20);

  textSize(12);
  textAlign(LEFT);
  fill(80);
  text("Legenda:", 60, height - 80);
  fill(120);
  triangle(60, height - 65, 55, height - 55, 65, height - 55);
  text("Vulcano", 80, height - 60);

  fill(255, 80, 0);
  triangle(60, height - 40, 55, height - 30, 65, height - 30);
  text("Hover = evidenziato", 80, height - 35);
}

// === Mostra tooltip al rollover ===
function drawTooltip(v) {
  let pos = project(v.lat, v.lon);

  fill(255);
  stroke(0);
  rectMode(CENTER);
  rect(pos.x, pos.y - 25, 180, 40, 6);

  noStroke();
  fill(0);
  textSize(12);
  text(`${v.name} (${v.country})`, pos.x, pos.y - 35);
  text(`${v.elev} m`, pos.x, pos.y - 20);
}
