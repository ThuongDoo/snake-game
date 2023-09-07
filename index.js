const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let speed = 7;

let blockCount = 20;
let blockSize = 18;

let xvelocity = 1;
let yvelocity = 0;

let appleX = 5;
let appleY = 5; 

const snakeParts=[];
let tailLength=2;

let score = 0;

class snakePart{
  constructor(x, y, prevx, prevy){
    this.x=x;
    this.y=y;
    this.prevx=prevx;
    this.prevy=prevy;
  }

  setX(x) {
    this.x=x;
  }

  setY(y) {
    this.y=y;
  }

  getX(){
    return this.x;
  }

  getY(){
    return this.y
  }

  setPrevx(x){
    this.prevx=x;
  }

  setPrevy(y){
    this.prevy=y;
  }

  getPrevy(){
    return this.prevy;
  }

  getPrevx(x){
    return this.prevx;
  }
}

const snakeHead = new snakePart(10, 10, 9, 10);
snakeParts.push(snakeHead);

document.addEventListener('keydown', keyDown);

function changeSnakePosition(block){
  block.setPrevx(block.getX());
  block.setPrevy(block.getY());
  block.setX(block.getX() + xvelocity);
  block.setY(block.getY() + yvelocity);
  isChangingDirection=false;
}

function drawgame(){
  let result=isGameOver();
  
  if(result){// if result is true stop other following function from exucuting
    return;
  }
  clearScreen();
  savePath();

  changeSnakePosition(snakeHead);
  
  drawSnake();
  checkCollision();

  
  drawApple();
  drawScore();
  setTimeout(drawgame, 1000/speed);
}

function savePath(){
  for(let i=1; i<snakeParts.length;i++){
    snakeParts[i].setPrevx(snakeParts[i].getX());
    snakeParts[i].setPrevy(snakeParts[i].getY());
  }
}

function drawSnake(){
  ctx.fillStyle="orange";
  ctx.fillRect(snakeParts[0].getX()* blockCount,snakeParts[0].getY()* blockCount, blockSize,blockSize);


  ctx.fillStyle='green';
  for(let i=1; i<snakeParts.length; i++){
    if(snakeParts[i]){
      snakeParts[i].setX(snakeParts[i-1].getPrevx());
      snakeParts[i].setY(snakeParts[i-1].getPrevy());
      ctx.fillRect(snakeParts[i].getX()*blockCount, snakeParts[i].getY()*blockCount, blockSize, blockSize)
    }
  }
}

function drawApple(){
  ctx.fillStyle='red';
  ctx.fillRect(appleX*blockCount, appleY*blockCount, blockSize, blockSize);
}

function drawScore(){
  ctx.fillStyle='white';
  ctx.font="10px verdena";
  ctx.fillText("Score: "+ score, canvas.clientWidth-50,10)
}

function clearScreen(){
  ctx.fillStyle='black';
  ctx.fillRect(0,0,canvas.clientWidth,canvas.clientHeight)
}

let isChangingDirection = false; // Biến để kiểm tra xem đang thay đổi hướng di chuyển hay không

function keyDown(event) {
  if (isChangingDirection) {
    return; // Nếu đã đang thay đổi hướng thì không làm gì cả
  }

  if (event.keyCode == 38 && yvelocity != 1) { // Mũi tên lên
    yvelocity = -1; // Di chuyển lên
    xvelocity = 0;
    isChangingDirection = true; // Đang thay đổi hướng
  } else if (event.keyCode == 40 && yvelocity != -1) { // Mũi tên xuống
    yvelocity = 1; // Di chuyển xuống
    xvelocity = 0;
    isChangingDirection = true; // Đang thay đổi hướng
  } else if (event.keyCode == 37 && xvelocity != 1) { // Mũi tên trái
    xvelocity = -1; // Di chuyển sang trái
    yvelocity = 0;
    isChangingDirection = true; // Đang thay đổi hướng
  } else if (event.keyCode == 39 && xvelocity != -1) { // Mũi tên phải
    xvelocity = 1; // Di chuyển sang phải
    yvelocity = 0;
    isChangingDirection = true; // Đang thay đổi hướng
  }
}



function checkCollision(){
  if(appleX == snakeHead.getX() && appleY == snakeHead.getY()){
    appleX=Math.floor(Math.random()*blockCount);
    appleY=Math.floor(Math.random()*blockCount);
    snakeParts.push(new snakePart(snakeParts[snakeParts.length-1].getPrevx(), snakeParts[snakeParts.length-1].getPrevy(), 0,0))
    score++;
  }
}

function isGameOver(){
  let gameOver=false;
  if(yvelocity===0 && xvelocity===0){
    return false;
  }
  if(snakeHead.getX()<0){//if snake hits left wall
      gameOver=true;
  }
  else if(snakeHead.getX()===blockCount){//if snake hits right wall
      gameOver=true;
  }
  else if(snakeHead.getY()<0){//if snake hits wall at the top
      gameOver=true;
  }
  else if(snakeHead.getY()===blockCount){//if snake hits wall at the bottom
      gameOver=true;
  }
  for(let i=1; i<snakeParts.length;i++){
    let part=snakeParts[i];
    if(part.getX()===snakeHead.getX() && part.getY()===snakeHead.getY()){//check whether any part of snake is occupying the same space
        gameOver=true;
        break; // to break out of for loop
    }
  }
  if(gameOver){
    ctx.fillStyle="white";
    ctx.font="50px verdana";
    ctx.fillText("Game Over! ", canvas.clientWidth/6.5, canvas.clientHeight/2);//position our text in center
   }

   return gameOver;
}


drawgame();