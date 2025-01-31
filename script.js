const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const canvasSize = 400;
let snake = [{x: 8 * gridSize, y: 8 * gridSize}];
let direction = null; // Inicia com a direção indefinida
let food = {x: 5 * gridSize, y: 5 * gridSize};
let score = 0;
let highScore = localStorage.getItem("highScore") ? localStorage.getItem("highScore") : 0;
let gameInterval;
let gameSpeed = 100; // Controle da velocidade da cobrinha (em milissegundos)

const scoreElem = document.getElementById("score");
const highScoreElem = document.getElementById("highScore");
const speedElem = document.getElementById("speed");
const infoElem = document.getElementById("info");
const restartBtn = document.getElementById("restartBtn");
const gameOverOverlay = document.createElement('div');
gameOverOverlay.className = 'game-over';

restartBtn.addEventListener("click", restartGame);
document.addEventListener("keydown", changeDirection);

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawSnake();
    drawFood();
    moveSnake();

    if (checkCollision()) {
        gameOver();
        return;
    }

    updateScore();
}

function drawBackground() {
    let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    // A cabeça da cobra é mais clara com sombra
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 4;
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(snake[0].x, snake[0].y, gridSize, gridSize);
    ctx.shadowBlur = 0;  // Remove a sombra após desenhar a cabeça

    // O corpo da cobra
    ctx.fillStyle = "green";
    for (let i = 1; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, gridSize, gridSize);
    }
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function moveSnake() {
    if (direction === null) return; // Não move até a direção ser definida

    const head = {x: snake[0].x, y: snake[0].y};

    if (direction === "UP") head.y -= gridSize;
    if (direction === "DOWN") head.y += gridSize;
    if (direction === "LEFT") head.x -= gridSize;
    if (direction === "RIGHT") head.x += gridSize;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        spawnFood();
    } else {
        snake.pop();
    }
}

function changeDirection(event) {
    if (event.key === "w" && direction !== "DOWN") direction = "UP";
    if (event.key === "s" && direction !== "UP") direction = "DOWN";
    if (event.key === "a" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "d" && direction !== "LEFT") direction = "RIGHT";

    if (direction !== null && !gameInterval) {
        gameInterval = setInterval(drawGame, gameSpeed);
        infoElem.style.display = "none"; // Esconde a mensagem de aviso após começar o jogo
    }
}

function checkCollision() {
    const head = snake[0];

    // Verifica colisão com as paredes
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        return true;
    }

    // Verifica colisão com o próprio corpo
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

function spawnFood() {
    const x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    food = {x, y};
}

function updateScore() {
    scoreElem.textContent = score;

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }

    highScoreElem.textContent = highScore;
}

function gameOver() {
    clearInterval(gameInterval);
    gameInterval = null;

    gameOverOverlay.innerHTML = `Game Over! Score: ${score}  <button onclick="restartGame()">Reiniciar</button>`;
    document.body.appendChild(gameOverOverlay);
    setTimeout(() => gameOverOverlay.classList.add('show'), 100);
}

function restartGame() {
    // Limpa tudo do canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Reinicia os valores do jogo
    snake = [{x: 8 * gridSize, y: 8 * gridSize}];
    direction = null; // Direção indefinida até o jogador apertar uma tecla
    score = 0;
    spawnFood();
    gameInterval = null; // Não inicia o jogo até o jogador pressionar uma tecla de direção
    infoElem.style.display = "block"; // Exibe o aviso novamente
    gameOverOverlay.classList.remove('show');
}

function changeSpeed(speed) {
    gameSpeed = speed;
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = setInterval(drawGame, gameSpeed);
    }
}




