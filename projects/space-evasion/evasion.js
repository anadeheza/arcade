const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const GAME_WIDTH = 600;
let offsetX = 0;

let spawnRate = 1000;
let minSpawnRate = 200;
let lastSpawnTime = 0;

const deathSound = new Audio('assets/death.wav');
const spawnSound = new Audio('assets/shoot.wav'); 
deathSound.volume = 1;
spawnSound.volume = 1; 

let score = 0;
let gameOver = false;

const player = {
    x: 0,
    y: 0,
    size: 50,
    color: '#38bdf8',
    speed: 8
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    offsetX = (canvas.width - GAME_WIDTH) / 2;
    player.x = canvas.width / 2;
    player.y = canvas.height - 100;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const obstacles = [];
const obstacleSpeed = 3;

function spawnObstacle() {
    if(gameOver) return;
    
    const size = Math.floor(Math.random() * 30) + 20;
    const x = offsetX + (Math.random() * (GAME_WIDTH - size));
    obstacles.push({ x, y: -size, size });
    
    const s = spawnSound.cloneNode();
    s.volume = 1;
    s.play().catch(e => console.log("Esperando interacción"));
}

function update(currentTime) {
    if (gameOver) {
        return; 
    } 

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (lastSpawnTime === 0) {
        lastSpawnTime = currentTime;
    }
    if(currentTime - lastSpawnTime > spawnRate) {
        spawnObstacle();
        lastSpawnTime = currentTime;

        if(spawnRate > minSpawnRate) {
            spawnRate -= 5;
        }
    }

    ctx.font = "40px Arial";
    ctx.textAlign = "center"; 
    ctx.fillText("👾", player.x, player.y);

    for (let i = 0; i < obstacles.length; i++) {
        let o = obstacles[i];
        o.y += obstacleSpeed;

        ctx.font = o.size + "px Arial";
        ctx.fillText("☄️", o.x, o.y + o.size);

        if (player.x - 20 < o.x + o.size &&
            player.x + 20 > o.x &&
            player.y - 30 < o.y + o.size &&
            player.y > o.y) {
                
                gameOver = true;
                deathSound.play(); 
                obstacles.length = 0;
                drawGameOver();
        }
    }

    if (obstacles.length > 0 && obstacles[0].y > canvas.height) {
        obstacles.shift();
        score++;
        scoreElement.innerText = score;
    }

    requestAnimationFrame(update);
}

function drawGameOver() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "pink";
    ctx.font = "bold 40px 'Courier New', Courier, monospace";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);

    ctx.fillStyle = "white";
    ctx.font = "20px 'Courier New', Courier, monospace";
    ctx.fillText("Final Score: " + score, canvas.width / 2, canvas.height / 2 + 20);
}

window.addEventListener('keydown', (e) => {
    if(gameOver) return;

    if (e.key === 'ArrowLeft' && player.x > offsetX + 30) player.x -= 30;
    if (e.key === 'ArrowRight' && player.x < offsetX + GAME_WIDTH - 30) player.x += 30;
});

setInterval(spawnObstacle, 1000);
requestAnimationFrame(update);