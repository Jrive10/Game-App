//wait for the dom to load
document.addEventListener('DOMContentLoaded', () => {
//Get the canavs and context
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

//set the canavs size
const canvasSize = 800; //900; // Adjust this value as needed
canvas.width = canvasSize;
canvas.height = canvasSize;

//images for the game
const player = new Image();
player.src = 'https://freepngimg.com/thumb/spaceship/25129-4-spaceship-file-thumb.png'; 
const asteroidImage = new Image()
asteroidImage.src = 'https://thumbs.gfycat.com/ArcticWelllitKentrosaurus-size_restricted.gif'

//size dimensions and speed
const PLAYER_WIDTH = 80;
const PLAYER_HEIGHT = 80;
const ASTEROID_WIDTH = 90;
const ASTEROID_HEIGHT = 90;
const LASER_WIDTH = 15;
const LASER_HEIGHT = 30;
const PLAYER_SPEED = 10;
const LASER_SPEED = 10;
const ASTEROID_SPEED = 3;

//player position, lives, score and game status
let playerX, playerY;
let playerLives = 2;
let playerScore = 0;
let gameStarted = false;

//arrays for asteroids and laser
const asteroids = [];
const lasers = [];

//hide the canvas initially
canvas.style.display = 'none';


//function for the ship
function drawPlayer() {
  ctx.drawImage(player, playerX, playerY, PLAYER_WIDTH, PLAYER_HEIGHT);
}

//fucntion for the asteriods 
function drawAsteroids() {
  for (let i = 0; i < asteroids.length; i++) {
    const asteroidX = asteroids[i].x;
    const asteroidY = asteroids[i].y;
    ctx.drawImage(asteroidImage, asteroidX, asteroidY, ASTEROID_WIDTH, ASTEROID_HEIGHT);
  }
}

//draw lasers 
function drawLaser() {
  for (let i = 0; i < lasers.length; i++) {
    const laserX = lasers[i].x;
    let laserY = lasers[i].y;
    ctx.fillStyle = 'yellow';
    ctx.fillRect(laserX, laserY, LASER_WIDTH, LASER_HEIGHT);

    laserY -= LASER_SPEED;
    lasers[i].y = laserY;

    if (laserY < 0) {
      lasers.splice(i, 1);
    }
  }
}

//how to track the players movement 
let playerMoveDirection = 0; // 0: not moving, -1: left, 1: right

//how to move the ship
function movePlayer(dir) {
  if (dir === 'left' && playerX > 0) {
    playerX -= PLAYER_SPEED;
  } else if (dir === 'right' && playerX < canvas.width - PLAYER_WIDTH) {
    playerX += PLAYER_SPEED;
  }
}

//event listener to use key pads for movements
function handleKeyDown(e) {
  if (e.key === 'ArrowLeft') {
    playerMoveDirection = -1; // Move left
  } else if (e.key === 'ArrowRight') {
    playerMoveDirection = 1; // Move right
  }
}
window.addEventListener('keyup', handleKeyUp);


function handleKeyUp(e) {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    playerMoveDirection = 0; // Stop moving
  }
}

//event listener for shooting 
function shootLaser(e) {
  if (e.code === 'Space') {
    lasers.push({ x: playerX + PLAYER_WIDTH / 2 - LASER_WIDTH / 2, y: playerY - LASER_HEIGHT});
  }
}

//main game loop
function gameLoop() {
  if (!gameStarted) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move the player ship
  playerX += playerMoveDirection * PLAYER_SPEED;

  // keep ship in the boundaries
  if (playerX < 0) {
    playerX = 0;
  }
  if (playerX > canvas.width - PLAYER_WIDTH) {
    playerX = canvas.width - PLAYER_WIDTH;
  }

  
  
//draw the images 
  // drawBackground();
  drawPlayer();
  drawAsteroids();
  drawLaser();

  if (Math.random() < 0.02) {
    const randomX = Math.random() * (canvas.width - ASTEROID_WIDTH);
    const newAsteroid = { x: randomX, y: 0 };
    asteroids.push(newAsteroid);
  }
  
  //asteriod position and check collision
  for (let i = 0; i < asteroids.length; i++) {
    asteroids[i].y += ASTEROID_SPEED;

    if (asteroids[i].y > canvas.height) {
      asteroids.splice(i, 1);
    }
  }

  for (let i = 0; i < asteroids.length; i++) {
    const asteroidX = asteroids[i].x;
    const asteroidY = asteroids[i].y;

    checkCollision(asteroidX, asteroidY);
  }

  //update hub and request next animation
  updateHUD();
  requestAnimationFrame(gameLoop);
}

//start th game
function startGame() {
  gameStarted = true;
  canvas.style.display = 'block';
  document.querySelector('.menu-container').style.display = 'none';

  //players position
  playerX = canvas.width / 2 - player.width / 2;
  playerY = canvas.height - player.height;

  //event listeners for controls
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  window.addEventListener('keydown', shootLaser);

  gameLoop();
}

//check collision 
function checkCollision(asteroidX, asteroidY) {
  // Rest of the checkCollision function
  const playerCenterX = playerX + PLAYER_WIDTH / 2;
  const playerCenterY = playerY + PLAYER_HEIGHT / 2;
  const asteroidCenterX = asteroidX + ASTEROID_WIDTH / 2;
  const asteroidCenterY = asteroidY + ASTEROID_HEIGHT / 2;

  if (
    Math.abs(playerCenterX - asteroidCenterX) < (PLAYER_WIDTH + ASTEROID_WIDTH) / 2 &&
    Math.abs(playerCenterY - asteroidCenterY) < (PLAYER_HEIGHT + ASTEROID_HEIGHT) / 2
  ) {
    playerLives--;
    resetGame();
  }

  for (let i = lasers.length - 1; i >= 0; i--) {
    const laserX = lasers[i].x;
    const laserY = lasers[i].y;

    if (
      laserX > asteroidX - LASER_WIDTH / 2 &&
      laserX < asteroidX + ASTEROID_WIDTH &&
      laserY > asteroidY &&
      laserY < asteroidY + ASTEROID_HEIGHT
    ) {
      playerScore += 10;
      lasers.splice(i, 1);
      asteroids.splice(i, 1);
    }
  }
  if(playerLives <= 0){
    showGameOver()
  }

  }

//reset the game
function resetGame() {
  if (playerLives <= 0) {
    showGameOver()
    // gameStarted = false;
    // canvas.style.display = 'none';
    // document.querySelector('.menu-container').style.display = 'flex';
    // playerLives = 2;
  }
}

//game over 
// Game over
function showGameOver() {
  gameStarted = false;
  canvas.style.display = 'none';
  const gameOverScreen = document.querySelector('.game-over');
  const finalScoreElement = document.getElementById('final-score');
  finalScoreElement.textContent = playerScore;
  gameOverScreen.style.display = 'flex';

  const restartButton = document.getElementById('restart');
  
  // Remove existing event listeners
  restartButton.removeEventListener('click', restartGame);
  
  // Add the event listener
  restartButton.addEventListener('click', restartGame);
}

// Function to restart the game
function restartGame() {
  const gameOverScreen = document.querySelector('.game-over');
  gameOverScreen.style.display = 'none';
  playerLives = 2;
  playerScore = 0;
  startGame();
}

//updat the hud
function updateHUD() {
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText(`Lives: ${playerLives}`, 20, 40);
  ctx.fillText(`Score: ${playerScore}`, 20, 70);
}

// Initialize game load images
function init() {
  player.onload = () => {
    document.getElementById('start').addEventListener('click', startGame);
  };
}

// Run the game
init();
});


