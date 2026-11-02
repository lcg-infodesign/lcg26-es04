// Variabili condivise: i valori letti qui possono essere usati da più funzioni.
let data;
let maxMortality = 0;
let totalDuration = 0;
let continents = [];
let backgroundColor = '#F5F5F5';

// Margine attorno al grafico
let margin = 20;

// Spazio tra le barre del grafico
let gutter = 4;

// Associa ogni categoria del CSV a un colore: colorScale["europe"] restituisce "red".
let colorScale = {
  'europe': '#66A9ED',
  'asia': '#ED66ED',
  'africa': '#EDA966',
  'america': '#66ED66',
}

// In p5.js 2, setup() può attendere il caricamento degli asset con async/await.
async function setup() {
  // Crea l'area di disegno con le dimensioni della finestra del browser.
  createCanvas(windowWidth, windowHeight);

  // loadTable(percorso, separatore, opzioni): "header" usa la prima riga come nomi delle colonne.
  data = await loadTable("assets/famines.csv", ",", "header");

  // getRowCount() restituisce il numero di righe; il ciclo visita ogni carestia.
  for (let rowNumber = 0; rowNumber < data.getRowCount(); rowNumber++) {
    // getNum legge una cella come numero; getString legge testo, ad esempio un nome.
    let duration = data.getNum(rowNumber, "duration");
    let mortality = data.getNum(rowNumber, "Excess Mortality midpoint");

    // Conserva il valore massimo, necessario per riportare tutte le mortalità alla stessa scala.
    if (mortality > maxMortality) {
      maxMortality = mortality;
    }

    // Il totale delle durate serve a distribuire le barre lungo tutta la larghezza del canvas.
    totalDuration += duration;

    // Raccoglie i continenti senza duplicati; questa lista può servire, per esempio, per una legenda.
    let continent = data.getString(rowNumber, "continent");

    if (!continents.includes(continent)) {
      continents.push(continent);
    }
  }
}

// draw() viene ripetuta continuamente: ridisegna il grafico e aggiorna l'interazione col mouse.
function draw() {
  // Pulisce il fotogramma precedente; il numero indica una tonalità di grigio (0-255).
  background(backgroundColor);

  // Sottrae margini e gutter dalla larghezza per mantenere tutto il grafico dentro il canvas.
  let numberOfGutters = data.getRowCount() - 1;

  // Calcola la larghezza disponibile per le barre, sottraendo margini e gutter.
  let barsWidth = width - 2 * margin - numberOfGutters * gutter;

  // xPos tiene traccia di dove iniziare la prossima barra; label contiene il testo da mostrare.
  let xPos = margin;
  let label = "";
  // Evita il bordo predefinito delle forme.
  noStroke();

  // Ogni riga del CSV diventa una barra del grafico.
  for (let rowNumber = 0; rowNumber < data.getRowCount(); rowNumber++) {
    let currentMortality = data.getNum(rowNumber, "Excess Mortality midpoint");
    let currentDuration = data.getNum(rowNumber, "duration");
    let continent = data.getString(rowNumber, "continent");
    let country = data.getString(rowNumber, "Country");

    // map() trasforma i dati in dimensioni visive: durata -> larghezza, mortalità -> altezza.
    let scaledDuration = map(currentDuration, 0, totalDuration, 0, barsWidth);
    let scaledMortality = map(currentMortality, 0, maxMortality, 0, height - 2 * margin);

    // Imposta il colore in base al continente e disegna il rettangolo dentro il margine superiore.
    fill(colorScale[continent]);
    rect(xPos, margin, scaledDuration, scaledMortality);

    // Verifica se il puntatore si trova dentro questa barra e memorizza il paese corrispondente.
    if (
      mouseX >= xPos &&
      mouseX <= xPos + scaledDuration &&
      mouseY >= margin &&
      mouseY <= margin + scaledMortality
    ) {
      label = country;
    }

    // Sposta la prossima barra dopo quella corrente, lasciando il gutter tra le due.
    xPos += scaledDuration + gutter;
  }

  // Mostra il paese vicino al puntatore solo quando questo si trova sopra una barra.
  if (label != "") {
    fill(0);
    stroke(backgroundColor);
    // L'offset evita di disegnare il testo esattamente sotto il puntatore.
    text(label, mouseX + 8, mouseY + 16);
  }
}
