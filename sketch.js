// === Variabili globali ===
let volcanoTable;
let volcanoes = [];
let hoveredVolcano = null;
let volcanoIcon;
let worldMap;

// === Preload: carica dataset e immagini ===
function preload() {
  volcanoTable = loadTable('assets/volcanoes.csv', 'csv', 'header');
  volcanoIcon = loadImage('volcano.png');
  worldMap = loadImage('location.png');
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

// === Legge il CSV ===
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

// === Disegno principale ===
function draw() {
  background(240);

  // mappa del mondo di sfondo
  imageMode(CORNER);
  image(worldMap, 0, 0, width, height);

  // legenda in basso
  drawLegend();

  hoveredVolcano = null;
  volcanoes.forEach(v => {
    const pos = project(v.lat, v.lon);
    drawVolcano(v, pos.x, pos.y);
  });

  if (hoveredVolcano) drawTooltip(hoveredVolcano);
}

// === Conversione lat/lon → coordinate canvas ===
function project(lat, lon) {
  let x = map(lon, -180, 180, 50, width - 50);
  let y = map(lat, 90, -90, 50, height - 50);
  return { x, y };
}

// === Disegna icona vulcano ===
function drawVolcano(v, x, y) {
  let size = map(v.elev, 0, 6000, 10, 40);
  let d = dist(mouseX, mouseY, x, y);
  let tintColor = 255;

  if (d < size / 2) {
    tintColor = color(255, 80, 0);
    hoveredVolcano = v;
  }

  imageMode(CENTER);
  tint(tintColor);
  image(volcanoIcon, x, y, size, size);
  noTint();
}

// === Disegna legenda ===
function drawLegend() {
  fill(255, 200);
  rect(20, height - 80, 220, 60, 10);

  fill(0);
  textSize(12);
  textAlign(LEFT);
  text("Legenda:", 40, height - 65);

  imageMode(CENTER);
  image(volcanoIcon, 50, height - 40, 20, 20);
  fill(0);
  text("Vulcano", 75, height - 40);

  fill(255, 80, 0);
  ellipse(190, height - 40, 12, 12);
  fill(0);
  text("Hover = evidenziato", 110, height - 40);
}

// === Tooltip con info ===
function drawTooltip(v) {
  const pos = project(v.lat, v.lon);
  fill(255);
  stroke(0);
  rectMode(CENTER);
  rect(pos.x, pos.y - 30, 180, 45, 6);

  noStroke();
  fill(0);
  textSize(12);
  text(`${v.name} (${v.country})`, pos.x, pos.y - 40);
  text(`${v.elev} m`, pos.x, pos.y - 25);
}
