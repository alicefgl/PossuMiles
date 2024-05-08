//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//dino
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

//cactus
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
let gravity = .4;

let gameOver = false;
let score = 0;

// Variable to track whether the dino image is loaded
let isDinoImgLoaded = false;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");

    dinoImg = new Image();
    dinoImg.src = "./img/running_opino.gif"; // Correct path to the GIF image
    dinoImg.onload = function () {
        isDinoImgLoaded = true; // Set the flag to true when the image is loaded
    }

    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); //1000 milliseconds = 1 second
    document.addEventListener("keydown", moveDino);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        restartGame();
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // Check if the GIF image is loaded
    if (isDinoImgLoaded) {
        // Start drawing the dino image
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    //cactus
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

    //score
    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20);

}

function moveDino(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        //salta
        velocityY = -10;
    }
    else if (e.code == "ArrowDown" && dino.y == dinoY) {
        //si abbassa
    }

}

function placeCactus() {
    if (gameOver) {
        return;
    }

    //place cactus
    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random(); //0 - 0.9999...
    //l'immagine generata per i cactus dipende dalla probabilità generata casualmente
    if (placeCactusChance > .90) {
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .70) {
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .50) {
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift(); //rimuove il primo elemento dell'array in modo che l'array non si incrementi
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //il margine in alto a sx di a non raggiunge il margine in alto a dx di b
        a.x + a.width > b.x &&   //il margine in alto a dx di a raggiunge il margine in alto a sx di b
        a.y < b.y + b.height &&  //il margine in alto a sx di a non raggiunge il margine in basso a sx di b
        a.y + a.height > b.y;    //il margine in basso a sx di a non raggiunge il margine in alto a sx di b
}

function restartGame() {
    gameOver = false;
    score = 0;
    dinoImg.src = "./img/running_opino.gif";
    dino.x = dinoX;
    dino.y = dinoY;
    velocityY = 0;
    cactusArray = [];
}

