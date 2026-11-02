// Variabili condivise: i valori letti qui possono essere usati da più funzioni.
let data;
let maxMortality = 0;
let totalDuration = 0;
let continents = [];
let backgroundColor = '#F5F5F5';
let accentColor = '#66A9ED';

// Margine attorno al grafico
let margin = 20;

// Spazio tra le barre del grafico
let gutter = 4;

// Variabili per l'interazione col mouse
let hoveredLabel = "";
let hoveredId = null;
let hovered = false;


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

  // Riparte da "nessuna barra sotto il mouse" a ogni fotogramma.
  hovered = false;

  // Evita il bordo predefinito delle forme.
  noStroke();

  // Ogni riga del CSV diventa una barra del grafico.
  for (let rowNumber = 0; rowNumber < data.getRowCount(); rowNumber++) {
    let currentMortality = data.getNum(rowNumber, "Excess Mortality midpoint");
    let currentDuration = data.getNum(rowNumber, "duration");
    let country = data.getString(rowNumber, "Country");
    let id = data.getString(rowNumber, "famine_id");

    // map() trasforma i dati in dimensioni visive: durata -> larghezza, mortalità -> altezza.
    let scaledDuration = map(currentDuration, 0, totalDuration, 0, barsWidth);
    let scaledMortality = map(currentMortality, 0, maxMortality, 0, height - 2 * margin);

    // Imposta il colore in base al continente e disegna il rettangolo dentro il margine superiore.
    fill(backgroundColor);
    stroke(accentColor);
    rect(xPos, margin, scaledDuration, scaledMortality);

    // Verifica se il puntatore si trova dentro questa barra e memorizza il paese corrispondente.
    if (
      mouseX >= xPos &&
      mouseX <= xPos + scaledDuration &&
      mouseY >= margin &&
      mouseY <= margin + scaledMortality
    ) {
      hoveredLabel = country;
      hoveredId = id;
      hovered = true;
    }

    // Sposta la prossima barra dopo quella corrente, lasciando il gutter tra le due.
    xPos += scaledDuration + gutter;
  }

  // Mostra il paese vicino al puntatore solo quando questo si trova sopra una barra.
  if (hovered) {
    cursor(HAND);
    fill(0);
    stroke(backgroundColor);
    // L'offset evita di disegnare il testo esattamente sotto il puntatore.
    text(hoveredLabel, mouseX + 8, mouseY + 16);
  } else {
    cursor(ARROW);
  }
}

function mousePressed() {
  // Define parameters

  // Build the new URL. same rott, but the pafe is page.html
  let newURL = "detail.html?famine=" + hoveredId;

  console.log(newURL);

  // Redirect in the same tab
  window.location.href = newURL;
}