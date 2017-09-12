var canvas;
var canvasContext;

const GAME_STATE_LOADING = 'loading';
const GAME_STATE_IN_ROUND = 'in-round';
const GAME_STATE_SCORE = 'score';
const GAME_STATE_CONTINUE = 'continue';
var gameState = GAME_STATE_LOADING;

var startTime = null;
var ballImages = [];
const BALL_IMAGE_DURATION = 100;

var playerScore = 0;
var opponentScore = 0;
const WINNING_SCORE = 3;

var ballPosX = 50;
var ballPosY = 100;
var ballSpeedX = 10;
var ballSpeedY = 4;

var playerPaddlePosY = 250;

var opponentPaddlePosY = 250;
const OPPONENT_PADDLE_SPEED = 6;

const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 25;

const SPEED_DAMPENING = 0.35;

var gameBGImage = null;
var playerPaddleImage = null;
var opponentPaddleImage = null;
var ballImage = null;


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
    if(gameState === GAME_STATE_CONTINUE) {
        playerScore = 0;
        opponentScore = 0;

        gameState = GAME_STATE_IN_ROUND;
    }
}

window.onload = function() {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext('2d');

    // SET start time
    startTime = new Date().getTime();

    // populate ball images array
    ballImages.push(document.getElementById('ball1'));
    ballImages.push(document.getElementById('ball2'));
    ballImages.push(document.getElementById('ball3'));
    ballImages.push(document.getElementById('ball4'));
    ballImages.push(document.getElementById('ball5'));
    ballImages.push(document.getElementById('ball6'));
    ballImages.push(document.getElementById('ball7'));
    ballImages.push(document.getElementById('ball8'));

    // console.log(JSON.stringify(ballImages));


    var bgImg = new Image();
    bgImg.addEventListener('load', function() {
        gameBGImage = bgImg;
    }, false);
    bgImg.src = './Art/gameBG.png';

    var tempPlayerPaddleImg = new Image();
    tempPlayerPaddleImg.addEventListener('load', function() {
        playerPaddleImage = tempPlayerPaddleImg;
    }, false);
    tempPlayerPaddleImg.src = './Art/playerPaddle.png';

    var tempOpponentPaddleImg = new Image();
    tempOpponentPaddleImg.addEventListener('load', function() {
        opponentPaddleImage = tempOpponentPaddleImg;
    }, false);
    tempOpponentPaddleImg.src = './Art/opponentPaddle.png';


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

    gameState = GAME_STATE_IN_ROUND;

    var recordScoreContainer = document.getElementById('recordScoreContainer');
    recordScoreContainer.style.display = "none";
};

function ResetBall() {
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

function CheckForRoundEnd() {
    if(playerScore >= WINNING_SCORE || opponentScore >= WINNING_SCORE) {
        console.log('resetting scores');

        gameState = GAME_STATE_SCORE;
        recordScoreContainer.style.display = "";
    }
}

function MoveEverything() {
    if(gameState != GAME_STATE_IN_ROUND) {
        // don't move when not in round
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
    if(ballPosX > canvas.width - PADDLE_WIDTH) {
        if(ballPosY > opponentPaddlePosY && ballPosY < opponentPaddlePosY + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;

            var deltaY = ballPosY - (opponentPaddlePosY + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * SPEED_DAMPENING;
        }
        else {
            playerScore++;
            ResetBall();

            CheckForRoundEnd();
        }
    }

    // player misses ball
    if(ballPosX < PADDLE_WIDTH) {
        if(ballPosY > playerPaddlePosY && ballPosY < playerPaddlePosY + PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;

            var deltaY = ballPosY - (playerPaddlePosY + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * SPEED_DAMPENING;
        }
        else {
            opponentScore++;
            ResetBall();

            CheckForRoundEnd();
        }
    }
}

function DrawBG() {
    // OLD //
    CreateColorRect(0, 0, canvas.width, canvas.height, 'black');

    // background area
    if(gameBGImage) {
        canvasContext.drawImage(gameBGImage, 0, 0);
    }
}

function DrawNet() {
    for(var i = 0; i < canvas.height; i += 40) {
        CreateColorRect(canvas.width/2 - 1, i, 2, 20, 'white');
    }
}

function DrawScores() {
    // player score
    canvasContext.fillText(playerScore, 100, 100);

    // opponent score
    canvasContext.fillText(opponentScore, canvas.width - 100, 100);
}

function DrawPaddles() {
    // player paddle

    if(playerPaddleImage) {
        canvasContext.drawImage(playerPaddleImage, 0, playerPaddlePosY);
    }
    // CreateColorRect(0, playerPaddlePosY, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

    // opponent paddle
    if(opponentPaddleImage) {
        canvasContext.drawImage(opponentPaddleImage, canvas.width - PADDLE_WIDTH, opponentPaddlePosY);
    }
    //CreateColorRect(canvas.width - PADDLE_WIDTH, opponentPaddlePosY, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
}

function DrawBall() {
    var now = new Date().getTime();
    var timeElapsed = now - startTime;
    var ballImageChangeCount = timeElapsed/BALL_IMAGE_DURATION;
    var imgIndex = Math.floor(ballImageChangeCount % ballImages.length);

    var currentBallImage = ballImages[imgIndex];

    //console.log('this is imgIndex: ' + imgIndex);

    // ball
    canvasContext.drawImage(currentBallImage, ballPosX - currentBallImage.width/2, ballPosY - currentBallImage.height/2);

    // CreateCircle(ballPosX, ballPosY, ballRadius, 'white');
}

function DrawEverything() {
    DrawBG();

    if(gameState === GAME_STATE_SCORE || gameState === GAME_STATE_CONTINUE) {
        canvasContext.fillStyle = 'white';

        if(playerScore >= WINNING_SCORE) {
            canvasContext.fillText("You Won!", 350, 200);
        }
        else if(opponentScore >= WINNING_SCORE) {
            canvasContext.fillText("You Lost!", 350, 200);
        }

        if(gameState === GAME_STATE_CONTINUE) { 
            canvasContext.fillText("Click To Continue", 350, 500); 
        }

        return;
    }

    // draw the net
    DrawNet();

    DrawPaddles();

    DrawBall();

    DrawScores();
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