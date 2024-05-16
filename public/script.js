// Canvas variables
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

// Dinosaur variables
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
};

// Cactus variables
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

// Flag to check if the dinosaur image has been loaded
let isDinoImgLoaded = false;

// Initialization
window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");

    dinoImg = new Image();
    dinoImg.src = "./img/opo.png"; // Correct path for the dinosaur GIF image
    dinoImg.onload = function () {
        isDinoImgLoaded = true; // Set the flag to true when the image is loaded

        // Draw the dinosaur image only after it has been loaded
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); // 1000 milliseconds = 1 second
    document.addEventListener("keydown", moveDino);
}

// Game update function
function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        document.getElementById("retryButton").style.display = "block"; // Show retry button
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // Check if the GIF image has been loaded
    if (isDinoImgLoaded) {
        // Draw the dinosaur image
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    // Draw the cacti and handle collisions
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

    // Draw the score
    context.fillStyle = "black";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20);

    // Apply gravity to the dinosaur
    velocityY += gravity;
    dino.y += velocityY;

    // Check if the dinosaur has touched the ground
    if (dino.y >= dinoY) {
        dino.y = dinoY; // Lock the dinosaur to the ground
        velocityY = 0; // Stop the vertical velocity
    }
}

// Function to handle dinosaur movement
function moveDino(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        // Jump only if the dinosaur is on the ground
        velocityY = -10; // Apply an upward velocity
    }
}

// Function to place cacti on the screen
function placeCactus() {
    if (gameOver) {
        return;
    }

    // Place a cactus
    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random(); // Generate a random probability between 0 and 1
    // The generated cactus image depends on the random probability
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
        cactusArray.shift(); // Remove the first element of the array to prevent excessive growth
    }
}

// Function to detect collisions between two rectangular objects
function detectCollision(a, b) {
    return a.x < b.x + b.width &&   // The top-left edge of a does not reach the top-right edge of b
        a.x + a.width > b.x &&      // The top-right edge of a reaches the top-left edge of b
        a.y < b.y + b.height &&     // The top-left edge of a does not reach the bottom-left edge of b
        a.y + a.height > b.y;       // The bottom-left edge of a does not reach the top-left edge of b
}

// Function to restart the game
function restartGame() {
    gameOver = false;
    score = 0;
    dinoImg.src = "./img/opo.png";
    dino.x = dinoX;
    dino.y = dinoY;
    velocityY = 0;
    cactusArray = [];
    document.getElementById("retryButton").style.display = "none"; // Hide retry button
}
