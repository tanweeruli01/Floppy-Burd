
//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34; //width/height ratio = 408/228 = 17/12
let birdHeight = 24;
birdX = boardWidth/8;
birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height = 384/3072 = 1/8 =>//pipeimages
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0; // bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;


window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //draw flappy bird
    //context.fillStyle = "green";
    //context.fillRect (bird.x, bird.y, bird.width, bird.height);

    //load images
    birdImg = new Image();
    birdImg.src = "/Floppy-Burd/media/flappybird.png";
    birdImg.onload = function () { 
     context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "/Floppy-Burd/media/toppipe.png";

    bottomPipeImg = new Image ();
    bottomPipeImg.src = "/Floppy-Burd/media/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //every 1.5 seconds
    document.addEventListener("keydown", moveBird);
    document.addEventListener("click", moveBird);

}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect (0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max (bird.y + velocityY, 0); // apply gravity to current bird.y, limit bird.y to top of the canvas
    context.drawImage (birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true; 
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //two pipes meaning score goes up by two after passing both top and bottom pipe
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
        
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //removes first element from the array
    }

    //score
    context.fillStyle = "white"; //colour of font
    context.font = "45px sans-serif";
    context.fillText (score, 5, 45);

    if (gameOver) {
        context .fillText("GAME OVER!", 40, 330);
      }
    if (gameOver) {
        context.fillText("Score:", 40, 380);
        context.fillText(score, 200, 380);
    }
    if (gameOver) {
        context.font = "25px   sans-serif"; 
        context.fillText("Press JUMP to restart...", 40, 430);
    }
}

function placePipes () {
    if(gameOver) {
        return;
    }

    //(0-1) * pipeHeight/2
    //if 0 -> -128 (pipeHeight/4)
    //if 1 -> -128 -256 because pipe height is 512 so 512/2 = 256 (pipeHeight/4 - pipeHeight/2) = - 3/4 pipeHeight
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4; 


    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push (topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX, 
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push (bottomPipe);
}

function moveBird(e){
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyR" || e.type == "click") {
        //jump
        velocityY = -6;

        // //reset game
        if (gameOver){
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
        console.log("Clicked!")
    }
}   


function detectCollision (a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

