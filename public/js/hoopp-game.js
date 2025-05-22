const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let hooppImg = new Image();
hooppImg.src = 'Diseño_sin_título-removebg-preview (1) (1).png';

let marcianImg = new Image();
marcianImg.src = 'https://em-content.zobj.net/source/apple/354/alien_1f47d.png';

let score = 0;
let isGameOver = false;

const floorY = 200;
const gravity = 0.7;
const jumpPower = -12;

const hoopp = {
  x: 50,
  y: floorY,
  width: 50,
  height: 50,
  jumping: false,
  ducking: false,
  velocityY: 0,
  getHitbox() {
    // Hitbox mas cabrona

    if (this.ducking) {
      return {
        x: this.x + 5,
        y: this.y + 25,
        width: this.width - 10,
        height: this.height - 25
      };
    }
    // Hitbox normal
    return {
      x: this.x + 5,
      y: this.y + 5,
      width: this.width - 10,
      height: this.height - 10
    };
  }
};

let obstacles = [];
let obstacleSpeed = 5;
const positionsY = [100, 140, 180]; // hitbox encajar...
let frameCounter = 0;

function drawBackground() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  for (let i = 0; i < 100; i++) {
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height / 2, 1, 1);
  }
}

function drawHoopp() {

  let drawY = hoopp.ducking ? hoopp.y + 25 : hoopp.y;
  let drawHeight = hoopp.ducking ? hoopp.height - 25 : hoopp.height;
  ctx.drawImage(hooppImg, hoopp.x, drawY, hoopp.width, drawHeight);

  // Debug hitbox 

}

function drawObstacles() {
  obstacles.forEach(obstacle => {
    ctx.drawImage(marcianImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    // Debug hitbox obstáculo paraz mejorar 

  });
}

function detectCollision(obstacle) {
  const hb = hoopp.getHitbox();
  const obsHb = {
    x: obstacle.x + 5,
    y: obstacle.y + 5,
    width: obstacle.width - 10,
    height: obstacle.height - 10
  };

  return !(
    hb.x + hb.width < obsHb.x ||
    hb.x > obsHb.x + obsHb.width ||
    hb.y + hb.height < obsHb.y ||
    hb.y > obsHb.y + obsHb.height
  );
}

function updateScore() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Puntaje: ${score}`, 10, 25);
}

function reiniciarJuego() {
  score = 0;
  isGameOver = false;
  hoopp.y = floorY;
  hoopp.jumping = false;
  hoopp.ducking = false;
  hoopp.velocityY = 0;
  obstacles = [];
  obstacleSpeed = 5;
  frameCounter = 0;
  requestAnimationFrame(update);
}

function update() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  updateScore();


  if (hoopp.jumping) {
    hoopp.velocityY += gravity;
    hoopp.y += hoopp.velocityY;

    if (hoopp.y > floorY) {
      hoopp.y = floorY;
      hoopp.velocityY = 0;
      hoopp.jumping = false;
    }
  }


  if (frameCounter % 90 === 0) {
    let newObstacle = {
      x: canvas.width,
      y: positionsY[Math.floor(Math.random() * positionsY.length)],
      width: 40,
      height: 50,
      speed: obstacleSpeed
    };
    obstacles.push(newObstacle);
  }


  obstacles.forEach((obstacle, i) => {
    obstacle.x -= obstacle.speed;

    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(i, 1);
      score++;

      if (score % 5 === 0) {
        obstacleSpeed += 0.5; 
      }
    }

    if (detectCollision(obstacle)) {
      isGameOver = true;
      setTimeout(() => {
        alert("¡Te atraparon! Fin del juego.");
        reiniciarJuego();
      }, 100);
    }
  });

  drawHoopp();
  drawObstacles();

  frameCounter++;
  requestAnimationFrame(update);
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space' && !hoopp.jumping && !isGameOver) {
    hoopp.jumping = true;
    hoopp.velocityY = jumpPower;
  }
  if (e.code === 'ArrowDown' && !hoopp.jumping) {
    hoopp.ducking = true;
  }
});

document.addEventListener('keyup', e => {
  if (e.code === 'ArrowDown') {
    hoopp.ducking = false;
  }
});

requestAnimationFrame(update);
