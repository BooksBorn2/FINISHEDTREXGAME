var trex ,trex_running;
var ground , ground_img
var clone_ground
var cloud , cloud_img
var cactus1 , cactus2 , cactus3 , cactus4 , cactus5 , cactus6
var cloud_group, cactus_group
var gameState = 0
var score = 0
var trex_hit
var GAMEOVER , RESTART , gameover_img , restart_img
var checkpoint_sound , die_sound , jump_sound
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png")  
  ground_img = loadImage("ground2.png")
  cloud_img = loadImage("cloud.png")
  trex_hit = loadAnimation("trex_collided.png")
  cactus1 = loadImage("obstacle1.png")
  cactus2 = loadImage("obstacle2.png")
  cactus3 = loadImage("obstacle3.png")
  cactus4 = loadImage("obstacle4.png")
  cactus5 = loadImage("obstacle5.png")
  cactus6 = loadImage("obstacle6.png")
  gameover_img = loadImage("gameOver.png")
  restart_img = loadImage("restart.png")
  checkpoint_sound = loadSound("checkpoint (1).mp3")
  die_sound = loadSound("die.mp3")
  jump_sound = loadSound("jump.mp3")
}

function setup(){
  createCanvas(600,200)
 GAMEOVER = createSprite(300,70,10,10)
 RESTART = createSprite(300,100,10,10)
 trex = createSprite(200,130,30,30)
 trex.addAnimation("running",trex_running)
 trex.addAnimation("collided", trex_hit)
 trex.scale = 0.5
 ground = createSprite(300,180,600,5)
 ground.addImage(ground_img)
 clone_ground = createSprite(300,188,600,5)
 clone_ground.visible = false
 cloud_group = createGroup()
 cactus_group = new Group()
 trex.debug = false
 trex.setCollider("circle", 0,0,40)
 GAMEOVER.addImage(gameover_img)
 GAMEOVER.scale = 1.1
 RESTART.addImage(restart_img)
 RESTART.scale = 0.4
}

function draw(){
  background("white")
  drawSprites()
  textSize(14)
  textFont("Georgia")
  text("Score = "+score, 510,50)
  if (gameState === 0) {
    trex.collide(clone_ground)
    trex.velocityY = trex.velocityY + 0.85
    if (score%500 === 0 && score > 0) {
      checkpoint_sound.play()
    }
    if (ground.x < 0) {
      ground.x = 300 //ground.x = width/2
    }
    if (keyDown("SPACE") && trex.y > 150) {
      trex.velocityY = -14
      jump_sound.play()
    } 
    create_clouds()
    create_cacti()
    if (trex.isTouching(cactus_group)) {
      die_sound.play()
      gameState = 1
      //jump_sound.play()
      //trex.velocityY = -12
    }
    score = score + Math.round(getFrameRate()/60)
    GAMEOVER.visible = false
    RESTART.visible = false
    ground.velocityX = -(6 + score/100)
  }
  else {
    ground.velocityX = 0
    trex.velocityY = 0
    cloud_group.setVelocityXEach(0)
    cactus_group.setVelocityXEach(0)
    trex.changeAnimation("collided")
    cloud_group.setLifetimeEach(-1)
    cactus_group.setLifetimeEach(-1)
    GAMEOVER.visible = true
    RESTART.visible = true
    if (mousePressedOver(RESTART)) {
      reset()
    }
  }
}

function create_clouds() {
  if (frameCount%180 === 0) {
    cloud = createSprite(600,50,30,20)
    cloud.y = Math.round(random(15,100))
    cloud.addImage(cloud_img)
    cloud.velocityX = -3
    cloud.scale = 1.2
    trex.depth = cloud.depth
    trex.depth = trex.depth + 1
    cloud.lifetime = 630
    cloud_group.add(cloud)
  }
}

function create_cacti() {
  if (frameCount%70 === 0) {
    var cactus = createSprite(600,162,10,40)
    cactus.velocityX = -(6 + score/100)
    var choice = Math.round(random(1,6))
    switch(choice) {
      case 1: cactus.addImage(cactus1)
      break
      case 2: cactus.addImage(cactus2)
      break
      case 3: cactus.addImage(cactus3)
      break
      case 4: cactus.addImage(cactus4)
      break
      case 5: cactus.addImage(cactus5)
      break
      case 6: cactus.addImage(cactus6)
      break
    }
    cactus.scale = 0.6
    cactus_group.add(cactus)
    console.log(choice)
    cactus.lifetime = 200
    trex.depth = cactus.depth + 1
  }
}
function reset() {
  gameState = 0
  cactus_group.destroyEach()
  cloud_group.destroyEach()
  score = 0
  trex.changeAnimation("running")
}