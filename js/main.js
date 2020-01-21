var assets = [ //INSERT ALL ASSETS INCLUDING IMAGES AND SOUNDS HERE
  "assets/textures/spaceship.png",
  "assets/textures/star.png",
  "assets/textures/aliens/crab0.png",
  "assets/textures/aliens/crab1.png",
  "assets/textures/aliens/squid0.png",
  "assets/textures/aliens/squid1.png",
  "assets/textures/aliens/ant0.png",
  "assets/textures/aliens/ant1.png",
  "assets/textures/explosion/exp0.png",
  "assets/textures/explosion/exp1.png",
  "assets/textures/explosion/exp2.png",
  "assets/textures/explosion/exp3.png",
  "assets/textures/explosion/exp4.png",
  "assets/textures/explosion/exp5.png",
  "assets/textures/explosion/exp6.png",
  "assets/textures/explosion/exp7.png",
  "assets/textures/explosion/exp8.png",
  "assets/textures/explosion/exp9.png",
  "assets/textures/mari51.png"
];

const game = new PIXI.Application({ //New PIXI engine container
  width: settings.screenWidth,
  height: settings.screenHeight,
  autoResize: true,
  antialias: true
});

game.play = false; //Wait until player is ready
var player; //Player spaceship
var ui; //User interface
var aliens = []; //Alien array
var level = settings.level; //Game's level
var starsCount = 100; //Number of stars in the background
var starSpeed = 2; //How fast the stars are moving
var particleContainer = new PIXI.ParticleContainer(); //Particle system for stars
var victoryScreen; //Victory screen when player wins
var waitingInputScreen;

document.body.appendChild(game.view); //Add canvas to html body
window.addEventListener('resize', resize); //Window resize event

function resize() { //Resize Event
  game.renderer.resize(settings.screenWidth, settings.screenheight);
}

document.addEventListener('keydown', onKeyDown); //Key press event
document.addEventListener('keyup', onKeyUp); //Key up event

game.renderer.backgroundColor = 0x000000; //Black background color
WebFont.load({ //Load the font
  custom: {
    families: ['AdvancedPixelFont']
  }
});

for (let a = 0; a < assets.length; a++) { ///Load all assets
  PIXI.Loader.shared.add(assets[a]);
}
PIXI.Loader.shared.load(setup); //When finish loading --> go to setup()

function setup() { //Assets ready
  for (let i = 0; i < starsCount; ++i) { //Generate stars in the background
    let starSprite = PIXI.Sprite.from(PIXI.Loader.shared.resources["assets/textures/star.png"].texture); //Load star texture
    let starSize = Math.random() * 5; //Random size for star
    starSprite.width = starSize;
    starSprite.height = starSize;
    starSprite.position = new PIXI.Point(Math.random() * settings.screenWidth, Math.random() * settings.screenHeight); //Random position for star on screen
    starSprite.parallaxFactor = Math.random(); //Parallax effect
    particleContainer.addChild(starSprite); //Add star to particle container
  }
  game.stage.addChild(particleContainer); //Add particle system to scene

  player = new Ship(game.stage); //New spaceship with texture
  game.stage.addChild(player.sprite); //Add spaceship to scene

  ui = new Interface(player); //Create new interface
  game.stage.addChild(ui.statusContainer);
  game.stage.addChild(ui.scoreContainer);

  victoryScreen = new VictoryDisplay();
  game.stage.addChild(victoryScreen.sprite);

  waitingInputScreen = new PIXI.Text("Press Space to start\nAppuie sur Espace pour commencer", {
    fontFamily: "AdvancedPixelFont",
    fontSize: 60,
    fill : 0xffffff,
    align: "center"
  });
  waitingInputScreen.position = new PIXI.Point(settings.screenWidth/2 - waitingInputScreen.width/2, settings.screenHeight/2 + waitingInputScreen.height/2);
  game.stage.addChild(waitingInputScreen);

  aliens = summonAliens(level, player, game.stage); //Create aliens
  for (let a = 0; a < aliens.length; a++) { //Initialize each alien
    game.stage.addChild(aliens[a].alien.sprite);
  }

  game.ticker.add(delta => { //Tick update
    update(delta);
    render(delta);
  });
}

function update(delta) { //Update function
  player.update(); //Update player position and controls
  if (game.play) {
  waitingInputScreen.visible = false;
  if (player.lives <= 0 && player.alive) { //Check if player is dead
    game.stage.addChild(Explosion(player.sprite.position.x, player.sprite.position.y, 100, 100)); //Spawn explosion
    player.alive = false;
    player.sprite.visible = false; //Make player invisible
    game.stage.filters = [new PIXI.filters.GlitchFilter({
      red: new PIXI.Point(2,2),
      green: new PIXI.Point(-10, 4),
      blue: new PIXI.Point(10, -4),
      slices: 12
    })]; //Add game over screen filter
    var deadLabelBig = new PIXI.Text("ERROR/ERREUR: GAME OVER", { //Game over message
        fontFamily: "AdvancedPixelFont",
        fontSize: 100,
        fill : 0xd91431
    });
    deadLabelBig.position = new PIXI.Point(settings.screenWidth/2 - deadLabelBig.width/2, settings.screenHeight/2 - deadLabelBig.height/2)
    game.stage.addChild(deadLabelBig);
  }
  if (aliens.length <= 0) { //Check if all aliens died (player wins)
    player.control = false; //Stop control input
    victoryScreen.sprite.visible = true; //Make victory screen visible
    if (player.sprite.position.y >= 0) {
    starSpeed += 0.3; //Speed up background
    }
  }
  for (let i = 0; i < particleContainer.children.length; ++i) { //Update for each star
    let particle = particleContainer.children[i];
    particle.position.y += particle.parallaxFactor + starSpeed; //Update position of star
    if (particle.position.y > settings.screenHeight + particle.height) particle.position.y = 0; //Teleport star at top if reach bottom
  }

  var hitWall = false; //Variable to check if an alien hit a wall
  for (let a = 0; a < aliens.length; a++) { //Update each alien
    aliens[a].alien.update(); //Update alien
    if (aliens[a].alien.sprite.position.x <= 0 || aliens[a].alien.sprite.position.x >= settings.screenWidth - aliens[a].alien.sprite.width) { //Check if an alien hit a wall
      hitWall = true;
    }
    if (player.drop) { //Check if bullet exists within player
      var alienCenter = new PIXI.Point(aliens[a].alien.sprite.position.x + aliens[a].alien.sprite.width/2, aliens[a].alien.sprite.position.y - aliens[a].alien.sprite.height/2);
      if (player.drop.distanceFrom(alienCenter) <= aliens[a].alien.sprite.height/2) { //Check if bullet hit an alien
        aliens[a].alien.damage(player.drop.damage); //Damage alien
        player.drop.evaporate(); //Destroy bullet
        if (aliens[a].alien.alive == false) { //Check if alien is alive
          aliens[a].alien.destroy(); //Kill alien
          player.score += aliens[a].alien.activity * 10000; //Update player's score
          if (aliens[a].alien.drop) {
            aliens[a].alien.drop.sprite.destroy(); //Destroy tile
            delete aliens[a].alien.drop; //Destroy drop
          }
          aliens[a].alien.sprite.destroy(); //Destroy alien's sprite
          aliens.splice(a, 1); //Remove alien from array
        }
      }
    }
  }
  if (hitWall) { //Do when an alien hit wall
    for (let a = 0; a < aliens.length; a++) { //Change position aliens
      aliens[a].alien.shiftDown(); //Move down + switch direction
    }
  }
  ui.update(); //Update interface
  victoryScreen.update(delta); //Update victory screen when activated
  }
}

function render(delta) { //Render function

}

function onKeyDown(e) {
  player.onKeyDown(e);
}

function onKeyUp(e) {
  player.onKeyUp(e);
}
