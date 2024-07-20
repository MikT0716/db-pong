// game.js
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Load images
const paddleImage = new Image();
paddleImage.src = 'paddle.png';
const ballImage = new Image();
ballImage.src = 'ball.png';

// Constants
const paddleWidth = 45;
let paddleHeight;
let ballRadius;
let canvasWidth;
let canvasHeight;
let ballSpeedX;
let ballSpeedY;
const initialBallSpeed = 5;
const speedIncrement = 0.5;  // Speed increase value
const speedIncreaseInterval = 3000;  // Increase speed every 3 seconds

// Paddle Positions
let paddle1Y;
let paddle2Y;

// Ball Position
let ballX;
let ballY;

// Scores
let player1Score = 0;
let player2Score = 0;

// Control paddles
let paddle1Up = false;
let paddle1Down = false;
let paddle2Up = false;
let paddle2Down = false;

// Resize canvas and update game elements
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    paddleHeight = canvasHeight / 4.5;
    ballRadius = canvasWidth / 50;

    ballSpeedX = initialBallSpeed;
    ballSpeedY = initialBallSpeed;

    paddle1Y = (canvasHeight - paddleHeight) / 2;
    paddle2Y = (canvasHeight - paddleHeight) / 2;

    ballX = canvasWidth / 2;
    ballY = canvasHeight / 2;
}

// Draw everything
function draw() {
    // Clear canvas
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw paddles
    context.drawImage(paddleImage, 0, paddle1Y, paddleWidth, paddleHeight);
    context.drawImage(paddleImage, canvasWidth - paddleWidth, paddle2Y, paddleWidth, paddleHeight);

    // Draw ball
    context.drawImage(ballImage, ballX - ballRadius, ballY - ballRadius, ballRadius * 2, ballRadius * 2);

    // Draw scores
    context.font = "30px Arial";
    context.fillStyle = "#FFF";
    context.fillText(player1Score, canvasWidth / 4, 50);
    context.fillText(player2Score, 3 * canvasWidth / 4, 50);
}

// Update game elements
function update() {
    // Move paddles
    if (paddle1Up && paddle1Y > 0) paddle1Y -= 7;
    if (paddle1Down && paddle1Y < canvasHeight - paddleHeight) paddle1Y += 7;
    if (paddle2Up && paddle2Y > 0) paddle2Y -= 7;
    if (paddle2Down && paddle2Y < canvasHeight - paddleHeight) paddle2Y += 7;

    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom
    if (ballY + ballRadius > canvasHeight || ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with paddles
    if (ballX - ballRadius < paddleWidth && ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    } else if (ballX + ballRadius > canvasWidth - paddleWidth && ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Ball out of bounds
    if (ballX + ballRadius < 0) {
        player2Score++;
        resetBall();
    } else if (ballX - ballRadius > canvasWidth) {
        player1Score++;
        resetBall();
    }
}

// Increase ball speed periodically
function increaseBallSpeed() {
    if (ballSpeedX > 0) {
        ballSpeedX += speedIncrement;
    } else {
        ballSpeedX -= speedIncrement;
    }

    if (ballSpeedY > 0) {
        ballSpeedY += speedIncrement;
    } else {
        ballSpeedY -= speedIncrement;
    }
}

// Reset ball to the center
function resetBall() {
    ballX = canvasWidth / 2;
    ballY = canvasHeight / 2;
    ballSpeedX = initialBallSpeed;
    ballSpeedY = initialBallSpeed;
}

// Keydown event
function keyDownHandler(e) {
    if (e.key === 'w') paddle1Up = true;
    if (e.key === 's') paddle1Down = true;
    if (e.key === 'ArrowUp') paddle2Up = true;
    if (e.key === 'ArrowDown') paddle2Down = true;
}

// Keyup event
function keyUpHandler(e) {
    if (e.key === 'w') paddle1Up = false;
    if (e.key === 's') paddle1Down = false;
    if (e.key === 'ArrowUp') paddle2Up = false;
    if (e.key === 'ArrowDown') paddle2Down = false;
}

// Event listeners
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
window.addEventListener('resize', resizeCanvas);

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Initialize game
resizeCanvas();
gameLoop();

// Start increasing ball speed
setInterval(increaseBallSpeed, speedIncreaseInterval);
