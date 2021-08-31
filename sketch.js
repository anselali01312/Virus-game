var PLAY = 1;
var END = 0;
var gameState = PLAY;

var student, student_running, student_collided;
var ground, invisibleGround, groundImage;

var virusGroup, virus1, virus2, virus3, virus4, virus5, virus6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  student_running = loadAnimation("student2.png","student1.png");
  student_collided = loadAnimation("studentcollided.png");
  
  groundImage = loadImage("ground2.png");
  bgImg = loadImage("HallwayBG1.png");
  
  virus1 = loadImage("OBS1.png");
  virus2 = loadImage("OBS2.png");
  virus3 = loadImage("OBS3.png");
  virus4 = loadImage("OBS4.png");
  virus5 = loadImage("OBS5.png");
  virus6 = loadImage("OBS6.png");
  
  sanitizerImage = loadImage("Santizer.png");

  maskImage = loadImage("mask.png");

  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight );

  var message = "This is a message";
 console.log(message)
  
  student = createSprite(80,height-70,20,50);
  student.addAnimation("running", student_running);
  student.addAnimation("collided", student_collided);
  student.scale = 1.5;
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  invisibleGround.visible = false;
  
  //create Virus, Sanitizer and Mask Groups
  virusGroup = createGroup();
  sanitizerGroup = createGroup();
  maskGroup = createGroup();
  
  student.setCollider('circle',0,0,50);
  student.debug = true 
  
  score = 0;
  
}

function draw() {
  
  background(bgImg);
  background.velocityX = 2;
  //displaying score
  text("Score: " +score, 300,50);
  console.log(student.y);
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    student.changeAnimation("running", student_running)
 
    ground.velocityX = -(4 + 3* score/100);
    
    //scoring
    score = score + Math.round(getFrameRate()/60);
  
      if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space") && student.y >= height-200) {
        student.velocityY = -21;
        jumpSound.play();
    }
    
    //add gravity
    student.velocityY = student.velocityY + 0.8
  
    //spawn virus
    spawnVirus();

   // spawnSanitizer();
   // spawnMasks();
    
    if(virusGroup.isTouching(student)){
        dieSound.play();
        gameState = END;
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the student animation
      student.changeAnimation("collided", student_collided);
     
        
  if(mousePressedOver(restart)) {
    reset();
  }

      ground.velocityX = 0;
      student.velocityY = 0

      //set lifetime of the game objects so that they are never destroyed
    virusGroup.setLifetimeEach(-1);

     virusGroup.setVelocityXEach(0);
   
   }
  
  //stop student from falling down
  student.collide(invisibleGround);

  drawSprites();
}

function reset(){ 
  gameState=PLAY;
  virusGroup.destroyEach();
  score=0
  
}

function spawnVirus(){
 if (frameCount % 150 === 0){
   var virus = createSprite(width+20,height-10,30,10);
   virus.y = Math.round(random(height-70,height-180));
   virus.velocityX = -(6 + score/100);
   virus.scale = 0.4;
   
    //generate random viruses
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: virus.addImage(virus1);
              break;
      case 2: virus.addImage(virus2);
              break;
      case 3: virus.addImage(virus3);
              break;
      case 4: virus.addImage(virus4);
              break;
      case 5: virus.addImage(virus5);
              break;
      case 6: virus.addImage(virus6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    virus.scale = 0.5;
    virus.lifetime = 300;

   //add each obstacle to the group
    virusGroup.add(virus);


    var sanitizer = createSprite(width+10,height-30,30,10);
    sanitizer.y = virus.y;
    sanitizer.addImage(sanitizerImage);
    sanitizer.scale = 0.5;
    sanitizer.velocityX = -3;
    
     //assign lifetime to the variable
     sanitizer.lifetime = 600;
    
    //adjust the depth
    sanitizer.depth = student.depth;
    student.depth = student.depth+1;
    
    //add each cloud to the group
    sanitizerGroup.add(sanitizer);


    var mask = createSprite(width+20,height-50,30,10);
  mask.y = virus.y;
     mask.addImage(maskImage);
    mask.scale = 0.5;
    mask.velocityX = -3;
    
     //assign lifetime to the variable
    mask.lifetime = 700;
    
    //adjust the depth
    mask.depth = student.depth;
    student.depth = student.depth+1;
    
    //add each mask to the group
    maskGroup.add(mask);
   }
}
/*
function spawnSanitizer() {
  //write code here to spawn the sanitizer
  if (frameCount % 200 === 0) {
    var sanitizer = createSprite(width+20,height-10,30,10);
    sanitizer.y = Math.round(random(150,350));
    sanitizer.addImage(sanitizerImage);
    sanitizer.scale = 0.5;
    sanitizer.velocityX = -3;
    
     //assign lifetime to the variable
     sanitizer.lifetime = 600;
    
    //adjust the depth
    sanitizer.depth = student.depth;
    student.depth = student.depth+1;
    
    //add each cloud to the group
    sanitizerGroup.add(sanitizer);
  }
  
}

trex = student
function spawnMasks() {
  
  if (frameCount % 200 === 0) {
    var mask = createSprite(width+20,height-10,30,10);
    mask.y = Math.round(random(200,350));
    mask.addImage(maskImage);
    mask.scale = 0.5;
    mask.velocityX = -3;
    
     //assign lifetime to the variable
    mask.lifetime = 600;
    
    //adjust the depth
    mask.depth = student.depth;
    student.depth = student.depth+1;
    
    //add each mask to the group
    maskGroup.add(mask);
  }
  
}

  

*/