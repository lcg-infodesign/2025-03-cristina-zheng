// === Variabili globali ===
let volcanoTable;
let volcanoes = [];
let hoveredVolcano = null;
let volcanoIcon;
let worldMap;

// === Preload: carica dataset e immagini ===
function preload() {
  volcanoTable = loadTable('assets/data.csv', 'csv', 'header');
  volcanoIcon = loadImage('volcano.png');
  worldMap = loadImage('worldmap.svg');
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

  //mappa del mondo di sfondo
  imageMode(CORNER);
  image(worldMap, 25, 0, width, height);

  hoveredVolcano = null;
  volcanoes.forEach(v => {
    const pos = project(v.lat, v.lon);
    drawVolcano(v, pos.x, pos.y);
  });

  if (hoveredVolcano) drawTooltip(hoveredVolcano);

  // legenda in basso
  drawLegend();
}

// === Conversione lat/lon → coordinate canvas ===
function project(lat, lon) {
  let x = map(lon, -180, 180, 0, width);
  let y = map(lat, 90, -90, 0, height);
  return { x, y };
}

// === Disegna icona vulcano ===
function drawVolcano(v, x, y) {
  let size = 10;
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
  rectMode(CORNER);
  fill(255, 230);
  rect(20, height - 80, 260, 60, 10);

  imageMode(CENTER);
  image(volcanoIcon, 50, height - 55, 18, 18);

  fill(0);
  textSize(12);
  textAlign(LEFT, CENTER);
  text("Legenda:", 40, height - 70);
  text("Vulcano", 80, height - 55);

  fill(255, 80, 0);
  ellipse(50, height - 25, 10, 10);
  fill(0);
  text("Hover = evidenziato", 80, height - 25);
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
  textAlign(CENTER, CENTER);
  text(`${v.name} (${v.country})`, pos.x, pos.y - 40);
  text(`${v.elev} m`, pos.x, pos.y - 25);
}
