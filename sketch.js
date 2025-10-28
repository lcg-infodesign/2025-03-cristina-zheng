let data;

let minLat, minLon, maxLat, maxLon;

function preload() {
  // put preload code here
  data = loadTable("assets/data.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // put setup code here

  // definisco min e max per latitudine
  let allLat = data.getColumn("Latitude");
  minLat = min(allLat);
  maxLat = max(allLat);

  let allLon = data.getColumn("Longitude");
  minLon = min(allLon);
  maxLon = max(allLon);
}

function draw() {
  // put drawing code here
  background(220);

  for(let rowNumber = 0; rowNumber < data.getRowCount(); rowNumber ++) {
    // leggo i dati della singola riga
    let lon = data.getNum(rowNumber, "Longitude"); //prendere il numero alla riga rowNumber e nella colonna "longitude"
    let lat = data.getNum(rowNumber, "Latitude");
    let name = data.getString(rowNumber, "Country");

    //converto le coordinate geografiche in coordinate pixel
    let x = map(lon, minLon, maxLon, 0, width);
    let y = map(lat, minLat, maxLat, height, 0);
    let radius = 20;

    // calcolo la distanza
    let d = dist(x, y, mouseX, mouseY);

    if(d < radius) {
      fill('red');
    }

    if(d > radius) {
      fill('yellow');
    }

    ellipse(x, y, radius * 2);

    if(d < radius) {
      fill('white');
      text(name, x, y);
    }
  }
}
