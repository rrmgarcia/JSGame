import EnemyManager from "./EnemyManager.js";
import Player from "./Player.js";
import BulletShooter from "./BulletShooter.js";

//creating play-area and declaring variables
const canvas = document.getElementById("play-board");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-game");
const gameOver = document.getElementById("game-over");
const restartButton = document.getElementById("restart-game");

canvas.width = 600;
canvas.height = 600;

const background = new Image();
background.src = "assets/sprites/playboard-bg.gif";

const backgroundMusic = new Audio();
backgroundMusic.src = "assets/music/SkyFire.ogg";
backgroundMusic.volume = 0.1;

//creating objects using their classes
const playerBulletShooter = new BulletShooter(canvas, 8, "red", true);
const enemyBulletShooter = new BulletShooter(canvas, 10, "purple", false);
const enemyManager = new EnemyManager(
  canvas,
  enemyBulletShooter,
  playerBulletShooter
);
const player = new Player(canvas, 3, playerBulletShooter);

let isGameOver = false;

//game loop
function startGame() {
  checkGameOver();
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  displayGameOver();
  if (!isGameOver) {
    enemyManager.draw(ctx);
    player.draw(ctx);
    playerBulletShooter.draw(ctx);
    enemyBulletShooter.draw(ctx);
    backgroundMusic.play();
  }
}

function displayGameOver() {
  if (isGameOver) {
    gameOver.style.display = "block";
  }
}

function checkGameOver() {
  if (isGameOver) {
    return;
  }
  if (enemyBulletShooter.collideWith(player)) {
    isGameOver = true;
  }
  if (enemyManager.collideWith(player)) {
    isGameOver = true;
  }
  if (enemyManager.enemyRows.length === 0) {
    isGameOver = true;
  }
}
//game starts only when start button is clicked
startButton.addEventListener("click", () => {
  setInterval(startGame, 1000 / 60);
  canvas.style.display = "block";
  startScreen.style.display = "none";
});

//this is a band-aid solution (for presentation), will improve this code
restartButton.addEventListener("click", () => {
  location.reload();
});



