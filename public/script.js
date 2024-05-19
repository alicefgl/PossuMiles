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

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
};

var dinoImg = new Image();
dinoImg.src = "https://cdn.glitch.global/a524143c-e6cc-46a8-bd4a-c2c1b8e3e4cb/running_opino.PNG?v=1716041089976"; // Correct path for the dinosaur GIF image
var dinoDead = new Image();
dinoDead.src = "https://cdn.glitch.global/a524143c-e6cc-46a8-bd4a-c2c1b8e3e4cb/dead_opino.PNG?v=1716039979875"
let isDinoImgLoaded;

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

let velocityX = -7;
let velocityY = 0;
let gravity = 0.4;

let gameOver = true;
let score = 0;


// Flag to check if the dinosaur image has been loaded
//let isDinoImgLoaded = false;

// **********************************
// Cose aggiunte per il multiplayer
// **********************************

// Players location storage, add yourself to start:
var players = [];
var cnt=0;

// Ogni giocatore ha un colore diverso, random
// La nostra funziona randomColor() lo genera
var playerColor = randomColor();

// Match websocket protocol to page protocol (ws/http or wss/https):
var wsProtocol = window.location.protocol == "https:" ? "wss" : "ws";

// Set up new websocket connection to server
var connection = new WebSocket(`${wsProtocol}://${window.location.hostname}:${window.location.port}`);;

// Cosa succede ogni volta che arriva un messaggio dal server?
connection.addEventListener('message', e => 
{
  try 
  {
    const chat = JSON.parse(e.data);
    // console.log( chat.comando );
    
    // Arriva un comando di aggiornamento punteggio
    if( chat.comando == "aggiornamentoPunteggio" ) {
      // Find player index in players array:
      var playerIds = players.map(i => i.color);
      var playerIndex = playerIds.indexOf(chat.color);

      // If we haven't seen player before, add to players array:
      if (playerIndex === -1) {
        players.push(chat);
        //console.log('Aggiungo', playerIndex);
      }

      // If player is already in players array, update position:
      else {
        players[playerIndex].score = chat.score;
        //console.log('Aggiorno', playerIndex);
      }
    }
    
    // Arriva un comando di nuova partita
    if( chat.comando == "nuovaPartita" ) {
      
      //players.length = 0;
      while(players.length) { players.pop(); }
      
      gameOver = false;
      score = 0;

      // si cambia colore
      playerColor = randomColor();

      dino.x = dinoX;
      dino.y = dinoY;
      velocityY = 0;
      cactusArray = [];

      // Hide retry button
      document.getElementById("retryButton").style.display = "none"; 
      
      console.log('NuovaPartita');
     
    }
  }
  catch(err) 
  {
    console.log('invalid JSON', err);
  }

});

// **********************************
// fine cose aggiunte per il multiplayer
// **********************************


// Initialization
window.onload = function () {

    // Inizio del gioco (da qui in poi è come nella versione singolo giocatore)
    board = document.getElementById("board");

    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");

    // Visualizza il pulsante all'inizio... 
    dinoImg.onload = function () {
        isDinoImgLoaded = true; // Set the flag to true when the image is loaded
        document.getElementById("retryButton").style.display = "block"; // Show retry button

        // Draw the dinosaur image only after it has been loaded
        //context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    cactus1Img = new Image();
    cactus1Img.src = "https://cdn.glitch.global/a524143c-e6cc-46a8-bd4a-c2c1b8e3e4cb/rasp1.PNG?v=1716149124860";

    cactus2Img = new Image();
    cactus2Img.src = "https://cdn.glitch.global/a524143c-e6cc-46a8-bd4a-c2c1b8e3e4cb/rasp2.PNG?v=1716149127706";

    cactus3Img = new Image();
    cactus3Img.src = "https://cdn.glitch.global/a524143c-e6cc-46a8-bd4a-c2c1b8e3e4cb/rasp3.PNG?v=1716149130250";

    requestAnimationFrame(update);
  
    setInterval(placeCactus, 1000); // 1000 milliseconds = 1 second
    document.addEventListener("keydown", moveDino);
  
}

// Loop di gioco...
function update() {

    // Questo comando serve per creare 
    // un loop infinito di gioco, aggiornando la grafica
    requestAnimationFrame(update);
    
    // Una volta qui dentro, ridisegnamo tutto
    // quindi si parte cancellando il canvas
    context.clearRect(0, 0, board.width, board.height);
  
    // Fa vedere il pulsante se siamo in game over
    if (gameOver) {
        document.getElementById("retryButton").style.display = "block"; 
    }

    // Draw the cacti and handle collisions
    if( !gameOver ) {
  
      for (let i = 0; i < cactusArray.length; i++) {
          let cactus = cactusArray[i];
          cactus.x += velocityX;
          context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

          // Collisione
          if (detectCollision(dino, cactus)) {
              drawTheScore(context);
              while(players.length) { players.pop(); }
            
              gameOver = true;
              context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
              console.log('GameOver', playerColor);
          }
      }

      score++;
    }
  

    // Visualizza punteggi
    drawTheScore(context);
  
    if( cnt == 0 ) {
 
      // Spedisce al WebSocket i dati sul punteggio
      if (connection.readyState !== WebSocket.CLOSED) {
        //console.log('update', connection);
        connection.send(JSON.stringify({ score: score, color: playerColor, comando: "aggiornamentoPunteggio" }));
      }
    
      cnt = 1;
    }
    else
    {
       cnt--; 
    }
  
    // Apply gravity to the dinosaur
    velocityY += gravity;
    dino.y += velocityY;

    // Check if the dinosaur has touched the ground
    if (dino.y >= dinoY) {
        dino.y = dinoY; // Lock the dinosaur to the ground
        velocityY = 0; // Stop the vertical velocity
    }
  
    // Visualizza dino
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

}

// Disegna tutti i punteggi
// Tutto a destra c'è il mio punteggio.
// verso sinistra glia altri
// da sistemare meglio...
function drawTheScore( context )
{
    var playerIds = players.map(i => i.color);
    var playerScores = players.map(i => i.score);
    var position=150;
  
    //console.log(playerScores);
  
    players.forEach( client => {
        //if( !client.gameOver ) {
          var playerIndex = playerIds.indexOf(client.color);

          // Draw the score
          context.fillStyle = client.color;
          context.font = "30px courier";
          
          if( playerIndex != -1) {
            if( client.color == playerColor ) 
            {
              //sono io!!!
              context.fillText( client.score,10, 30);
            }
            else {
              context.fillText( client.score, position, 30);
              position += 150;
            }

          }
        //}
      }
    );

}

// Muovo dino
function moveDino(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        // Jump only if the dinosaur is on the ground
        velocityY = -10; // Apply an upward velocity
    }
} 

// Sistemo i cactus
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

// Rilevo la collisione
function detectCollision(a, b) {
    return a.x < b.x + b.width &&   // The top-left edge of a does not reach the top-right edge of b
        a.x + a.width > b.x &&      // The top-right edge of a reaches the top-left edge of b
        a.y < b.y + b.height &&     // The top-left edge of a does not reach the bottom-left edge of b
        a.y + a.height > b.y;       // The bottom-left edge of a does not reach the top-left edge of b
}

// faccio ripartire il gioco
function restartGame() {

    connection.send(JSON.stringify({ score: score, color: playerColor, comando: "nuovaPartita" }));
}

// Genero un valore random per il colore
function randomColor() {
  let color = "#";
  let values = [
    "0", "1", "2", "3", "4", "5", "6", "7",
    "8", "9", "A", "B", "C", "D", "E", "F"
  ];
  color += values[Math.floor(Math.random() * values.length)];
  color += values[Math.floor(Math.random() * values.length)];
  color += values[Math.floor(Math.random() * values.length)];
  return color;
}


// Non usate...

//connection.onopen = function() {
//  console.log("Websocket connected...");
//}

// anche in caso di disconnessione vediamo un messaggio
//connection.onclose = function() {
//  console.log("... disconnected!");
//};

