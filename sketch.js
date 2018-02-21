/*****************Objects*****************/
//Player-Controlled Square Object
var player = {
  //Player object parameters
  posX: 175,
  posY: 175,
  pixelSize: 10,
  
  //Function to draw player object
  shape: function() {
    //Player Controlled Square
    stroke(0);
    fill(0);
    rect(this.posX, this.posY, this.pixelSize, this.pixelSize);
  
    //Direction Speed
    var controlSpeed = 2.5;
    
    //Directional Buttons    
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
      this.posY -= controlSpeed;
    } 
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      this.posX += controlSpeed;
    } 
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
      this.posY += controlSpeed;
    } 
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      this.posX -= controlSpeed;
    } 
  }
}

function makeEnemy() {
  //Enemy Square Object
  var enemy = {
    //Enemy object Parameters
    posX: 0,
    posY: 0,
    pixelSize: 30,
    direction:  0,
    side: 0,
    r: 240,
    g: 0,
    b: 0,
    
    //Function to draw enemy object
    shape: function() {
      stroke(this.r, this.g, this.b);
      fill(this.r, this.g, this.b);
      rect(this.posX, this.posY, this.pixelSize, this.pixelSize);
      setMovement(this);
    }
  }
  
  return enemy;
}

//Pickup Object
var pickup = {
  //Pickup object parameters
  posX: 0,
  posY: 0,
  pixelSize: 5,
  direction:  0,
  side: 0,
  r: 0,
  g: 240,
  b: 0,
  
  //Function to draw pickup Object
  shape: function() {
    stroke(this.r, this.g, this.b);
    fill(this.r, this.g, this.b);
    rect(this.posX, this.posY, this.pixelSize, this.pixelSize);
    setMovement(this);
  }
}

var enemy1 = makeEnemy();
var enemy2 = makeEnemy();
var enemy3 = makeEnemy();
var enemy4 = makeEnemy();
var enemy5 = makeEnemy();

var enemy = [enemy1, enemy2, enemy3, enemy4, enemy5];

/*****************End Objects*****************/

/*****************Variables*****************/
//Canvas Size Variables
var canvasSizeX = 350, canvasSizeY = 350, maxCanvas = 350;

//Timer Variable
var pickupTimer = 0, enemyTimer= 0;

//Pickup Active Toggle
var pickupActive = false;

//Variable to determine State
var state = 1;

//Score Counter
var score = 0, scoreCap = 25;

var count = 1;

/*****************End Variables*****************/

/*****************Functions*****************/
function positionSelect(npc, i) {
  //Identify Side
  var sideSelect = random(4);
  
  //Set to Left
  if(sideSelect >= 0 && sideSelect < 1) {
    npc.posX = 0 - npc.pixelSize;
    npc.posY = random(height);
    npc.side = 1;
  }
  
  //Set to Bottom
  else if(sideSelect >= 1 && sideSelect < 2) {
    npc.posY = height;
    npc.posX = random(width);
    npc.side = 2;
  }
  
  //Set to Right
  else if(sideSelect >= 2 && sideSelect < 3) {
    npc.posX = width;
    npc.posY = random(height);
    npc.side = 3;
  }
  
  //Set to Top
  else if(sideSelect >= 3 && sideSelect <= 4) {
    npc.posY = 0 - npc.pixelSize;
    npc.posX = random(width);
    npc.side = 4;
  }
  
  //Identify Direction and Size
  npc.direction = random(-3, 3);
  
  //Detects if object is named "enemy"
  if (npc == enemy[0] || npc == enemy[1] || npc == enemy[2] || npc == enemy[3] || npc == enemy[4]) {
  npc.pixelSize = random(20, 45); //Random Size
  }
}

//X-axis Movement Selector
function movementX(npc, i) {
  //From Left or Right
  if(npc.side == 1 || npc.side == 3) {
    return 3;
  }
  //From Bottom or Top 
  else if(npc.side == 2 || npc.side == 4) {
    return npc.direction;
  }
}

//Y-axis Movement Selector
function movementY(npc, i) {
  //From Left or Right
  if(npc.side == 1 || npc.side == 3) {
    return npc.direction;
  }
  //From Bottom or Top 
  else if(npc.side == 2 || npc.side == 4) {
    return 3;
  }
}

//Aplies returned values to object movement
function setMovement(npc, i) {
    npc.posX += movementX(npc);
    npc.posY += movementY(npc);
}

function createBorder() {
  //Border
  noFill()
  stroke(0);
  strokeWeight(5);
  line(0, 0, width - 2, 0);
  line(width - 2, 0, width - 2, height - 2);
  line(width - 2, height - 2, 0, height - 2);
  line(0, height - 2, 0, 0);
}

function playerBoundary() {
  //Flexible Boundaries X-axis
  if (player.posX > width) {
    player.posX = 0 - player.pixelSize;
  } else if (player.posX + player.pixelSize < 0) {
    player.posX = width;
  }
  
  //Flexible Boundaries Y-axis
  if (player.posY > height) {
    player.posY = 0 - player.pixelSize;
  } else if (player.posY + player.pixelSize < 0) {
    player.posY = height;
  }
}

function npcBoundary(npc, i) {
  //Dynamic Boundaries for Enemy
  if(npc.posX > width || npc.posX + npc.pixelSize < 0 || npc.posY > height || npc.posY + npc.pixelSize < 0) {
    positionSelect(npc);
  }
}

function spawnCheck() {
  //Condition for spawning pickup 
  if(pickupTimer > 400) {
      pickupActive = true;
      positionSelect(pickup);
      //Timer Variable reset
      pickupTimer = 0;
  }
  
  // Condition for spawning extra enemy
    if(enemyTimer > 1600 && count < enemy.length) {
      enemyTimer = 0;
      count++;
      positionSelect(enemy[count - 1]);
    }
}

function despawn() {

  //Local variable created upon first pickup spawn
  if(pickupActive === true && score < 5) {
    //Variable to activate operation once
    var cap = 0;
    //Local variable reset upon spawning pickup
  } else if(pickupActive === true) {
    cap = 0;
  }
  
  //Collision between player and pickup
  if(player.posX <= pickup.posX + pickup.pixelSize
  && player.posY <= pickup.posY + pickup.pixelSize
  && player.posX + player.pixelSize >= pickup.posX
  && player.posY + player.pixelSize >= pickup.posY) {
    
    //Despawns pickup and resets hidden timer  
    pickupActive = false;
    
    //Checks if condition has been met once
    if(cap < 1) {
      //Grows player
      player.pixelSize += 5;
      score += 5;
      
      //Prevents repeated use of operation
      cap++;
    }
  }
}
/*****************End Functions*****************/

/*****************Initiallisation*****************/
function setup() {
  createCanvas(canvasSizeX, canvasSizeY);
  positionSelect(enemy[0]);
}

function draw() {
  
  //Main Game State
  if(state == 1) {
    //Refresh
    background(255);
    
    if(canvasSizeX < maxCanvas || canvasSizeY < maxCanvas) {
      canvasSizeX+= 0.5;
      canvasSizeY+= 0.5;
      createCanvas(canvasSizeX, canvasSizeY);
    }
  
    //Drawn Characters
    if(pickupActive === true) {
      pickup.shape();
    }
    player.shape();
    for(i = 0; i < count; i++) {
          enemy[i].shape();
    }
    
    //Draw Border
    createBorder();
    
    strokeWeight(1);
    text("Score: " + score, width - 60, 20);
  
    //Boundary to keep characters in place
    playerBoundary();
    for(i = 0; i < count; i++) {    
      npcBoundary(enemy[i]);
    }
    npcBoundary(pickup);
  
    //Timer for pickup and enemy spawn
    if(pickupActive === false) {
      pickupTimer++;
    }
    if(count < enemy.length) {
      enemyTimer++;
    }
    
    //Checks if appropriate to activate pickup
    spawnCheck();
    
    //Check for despawning pickup
    despawn();
    
    if(score >= scoreCap && maxCanvas < 500) {
      maxCanvas += 50;
      scoreCap += 25;
    }
    
    for(i = 0; i < count; i++) { 
      //Game Over Condition
      if(player.posX <= enemy[i].posX + enemy[i].pixelSize
      && player.posY <= enemy[i].posY + enemy[i].pixelSize
      && player.posX + player.pixelSize >= enemy[i].posX
      && player.posY + player.pixelSize >= enemy[i].posY) {
        
          state = 2
      }
    }
    println(enemyTimer);   
  }
  
  //Game Over State
  if(state == 2) {
    strokeWeight(1);
    background(255, 0, 0);
    
    text("Game Over", width/2-40, height/2-30);
    text("Final Score: " + score, width/2-47, height/2);
    text("Press Enter to try again", width/2-70, height/2+30)
    
    if(keyIsDown(ENTER)) {
      //State Reset
      canvasSizeX = 350;
      canvasSizeY = 350;
      maxCanvas = 350;
      createCanvas(canvasSizeX, canvasSizeY);
      
      score = 0;
      count = 1;
      pickupTimer = 0;
      enemyTimer = 0;
      
      player.pixelSize = 10;
      player.posX = 175;
      player.posY = 175;
      
      positionSelect(enemy[0]);
      pickupActive = false;
      
      state = 1;
    }
  }
}
/*****************End Innitialisation*****************/