var canvas;
var canvasContext;

var playerScore = 0;
var opponentScore = 0;
const WINNING_SCORE = 3;

var showWinScreen = false;

var ballPosX = 50;
var ballPosY = 100;
var ballRadius = 10;
var ballSpeedX = 10;
var ballSpeedY = 4;

var playerPaddlePosY = 250;

var opponentPaddlePosY = 250;
const OPPONENT_PADDLE_SPEED = 6;

const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;

const SPEED_DAMPENING = 0.35;



function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;

    return {
        x: mouseX,
        y: mouseY
    };
}

function HandleMouseClick(evt) {
    if(showWinScreen) {
        playerScore = 0;
        opponentScore = 0;
        showWinScreen = false;
    }
}

window.onload = function() {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext('2d');

    var framesPerSecond = 30;
    var oneSecond = 1000;

    setInterval(function() {
        MoveEverything();
        DrawEverything();
        }, oneSecond/framesPerSecond
    );

    canvas.addEventListener('mousedown', HandleMouseClick);

    canvas.addEventListener('mousemove',
        function(evt) {
            var mousePos = calculateMousePos(evt);

            playerPaddlePosY = mousePos.y - (PADDLE_HEIGHT/2);
        }
    );
};

function ResetBall() {
    if(playerScore >= WINNING_SCORE || opponentScore >= WINNING_SCORE) {
        console.log('resetting scores');
        showWinScreen = true;
    }

    ballSpeedX = -ballSpeedX;
    ballPosX = canvas.width/2;
    ballPosY = canvas.height/2;
}

function OpponentMovement() {
    var opponentPaddlePosYCenter = opponentPaddlePosY + (PADDLE_HEIGHT/2);

    // if ball's position is above opponent's paddle, move it down
    if(opponentPaddlePosYCenter < ballPosY - 35) {
        opponentPaddlePosY += OPPONENT_PADDLE_SPEED;
    }
    // if ball's position is below opponent's paddle, move it up
    else if(opponentPaddlePosYCenter > ballPosY + 35) {
        opponentPaddlePosY -= OPPONENT_PADDLE_SPEED;
    }
}

function MoveEverything() {
    if(showWinScreen) {
        return;
    }

    OpponentMovement();

    ballPosX += ballSpeedX;
    ballPosY += ballSpeedY;

    // bounce off bottom
    if(ballPosY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // bounce off top
    if(ballPosY < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // opponent misses ball
    if(ballPosX > canvas.width) {
        if(ballPosY > opponentPaddlePosY && ballPosY < opponentPaddlePosY + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;

            var deltaY = ballPosY - (opponentPaddlePosY + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * SPEED_DAMPENING;
        }
        else {
            playerScore++;
            ResetBall();
        }
    }

    // player misses ball
    if(ballPosX < 0) {
        if(ballPosY > playerPaddlePosY && ballPosY < playerPaddlePosY + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;

            var deltaY = ballPosY - (playerPaddlePosY + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * SPEED_DAMPENING;
        }
        else {
            opponentScore++;
            ResetBall();
        }
    }
}

function DrawNet() {
    for(var i = 0; i < canvas.height; i += 40) {
        CreateColorRect(canvas.width/2 - 1, i, 2, 20, 'white');
    }
}

function DrawEverything() {
    // background area
    CreateColorRect(0, 0, canvas.width, canvas.height, 'black');

    if(showWinScreen) {
        canvasContext.fillStyle = 'white';

        if(playerScore >= WINNING_SCORE) {
            canvasContext.fillText("You Won!", 350, 200);
        }
        else if(opponentScore >= WINNING_SCORE) {
            canvasContext.fillText("You Lost!", 350, 200);
        }


        canvasContext.fillText("Click To Continue", 350, 500);
        return;
    }

    // draw the net
    DrawNet();

    // player paddle
    CreateColorRect(0, playerPaddlePosY, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

    // opponent paddle
    CreateColorRect(canvas.width - PADDLE_WIDTH, opponentPaddlePosY, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

    // ball
    CreateCircle(ballPosX, ballPosY, ballRadius, 'white');

    // player score
    canvasContext.fillText(playerScore, 100, 100);

    // opponent score
    canvasContext.fillText(opponentScore, canvas.width - 100, 100);
}

function CreateColorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

function CreateCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}