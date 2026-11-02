let backgroundColor = '#F5F5F5';
let accentColor = '#66A9ED';

// variabile in cui salvo i dati del CSV
let data;

// variabile in cui salvo l'id della carestia selezionata
let selectedFamineId;

async function setup() {

    //carico i dati
    data = await loadTable("assets/famines.csv", ",", "header");

    // Legge i parametri passati nell’URL (es. ?famine=123)
    let params = getURLParams();

    // salvo l'id della carestia selezionata
    selectedFamineId = params.famine;

    // creo il canvas
    createCanvas(windowWidth, windowHeight);

}

function draw() {
    background(backgroundColor);

    // disegno un pallino ogni 100.000 persone decedute.
    // Piene fino al valore Excess Mortality midpoint, vuote fino al valore Excess Mortality upper
    let famineRow = data.findRow(selectedFamineId, "famine_id");

    if (famineRow) {
        let duration = int(famineRow.get("deaths"));
        let midpoint = float(famineRow.get("Excess Mortality midpoint"));
        let upper = float(famineRow.get("Excess Mortality upper"));

        let numPallini = upper / 100000;
        let numPalliniPieni = midpoint / 100000;

        let diametro = 15;
        let padding = 5;

        let posX = 20;
        let posY = 20;


        for (let i = 0; i < numPallini; i++) {

            if (i < numPalliniPieni) {
                fill(accentColor);
                stroke(accentColor);
            } else {
                noFill();
                stroke(accentColor);
            }
            circle(posX, posY, diametro);

            posX += diametro + padding;

            // Va a capo quando il prossimo pallino uscirebbe dal canvas (con margine di 20)
            if (posX + diametro > width - 20) {
                posX = 20;
                posY += diametro + padding;
            }

        }
    }
}