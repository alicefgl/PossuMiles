// Variabili del canvas
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

// Variabili del dinosauro
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
}

// Variabili dei cactus
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

let velocityX = -8;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

// Flag per controllare se l'immagine del dinosauro è stata caricata
let isDinoImgLoaded = false;

// Inizializzazione
window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");

    dinoImg = new Image();
    dinoImg.src = "./img/running_opino.gif"; // Percorso corretto per l'immagine GIF del dinosauro
    dinoImg.onload = function () {
        isDinoImgLoaded = true; // Imposta il flag su true quando l'immagine è stata caricata

        // Disegna l'immagine del dinosauro solo dopo che è stata caricata
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); // 1000 millisecondi = 1 secondo
    document.addEventListener("keydown", moveDino);
}

// Funzione di aggiornamento del gioco
function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        restartGame();
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // Controlla se l'immagine GIF è stata caricata
    if (isDinoImgLoaded) {
        // Disegna l'immagine del dinosauro
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    // Disegna i cactus e gestisce le collisioni
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = "./img/dino-dead.png";
            dinoImg.onload = function () {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
        }
    }

    // Disegna il punteggio
    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20);

    // Applica la gravità al dinosauro
    velocityY += gravity;
    dino.y += velocityY;

    // Controlla se il dinosauro ha toccato il suolo
    if (dino.y >= dinoY) {
        dino.y = dinoY; // Blocca il dinosauro al suolo
        velocityY = 0; // Arresta la velocità verticale
    }
}

// Funzione per gestire il movimento del dinosauro
function moveDino(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        // Salta solo se il dinosauro è a terra
        velocityY = -10; // Applica una velocità verso l'alto
    }
}

// Funzione per posizionare i cactus sullo schermo
function placeCactus() {
    if (gameOver) {
        return;
    }

    // Posiziona un cactus
    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random(); // Genera una probabilità casuale tra 0 e 1
    // L'immagine del cactus generata dipende dalla probabilità casuale
    if (placeCactusChance > 0.90) {
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > 0.70) {
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > 0.50) {
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift(); // Rimuove il primo elemento dell'array per evitare un'eccessiva crescita
    }
}

// Funzione per rilevare le collisioni tra due oggetti rettangolari
function detectCollision(a, b) {
    return a.x < b.x + b.width &&   // Il margine in alto a sinistra di a non raggiunge il margine in alto a destra di b
        a.x + a.width > b.x &&      // Il margine in alto a destra di a raggiunge il margine in alto a sinistra di b
        a.y < b.y + b.height &&     // Il margine in alto a sinistra di a non raggiunge il margine in basso a sinistra di b
        a.y + a.height > b.y;       // Il margine in basso a sinistra di a non raggiunge il margine in alto a sinistra di b
}

// Funzione per riavviare il gioco
function restartGame() {
    gameOver = false;
    score = 0;
    dinoImg.src = "./img/running_opino.gif";
    dino.x = dinoX;
    dino.y = dinoY;
    velocityY = 0;
    cactusArray = [];
}
