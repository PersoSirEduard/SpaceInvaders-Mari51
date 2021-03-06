var Aliens = {
  AlienCrab: function(player, stage) {
    var textures = [PIXI.Loader.shared.resources["assets/textures/aliens/crab0.png"].texture, PIXI.Loader.shared.resources["assets/textures/aliens/crab1.png"].texture];
    this.alien = new Alien(textures, player, stage);
  },
  AlienAnt: function(player, stage) {
    var textures = [PIXI.Loader.shared.resources["assets/textures/aliens/ant0.png"].texture, PIXI.Loader.shared.resources["assets/textures/aliens/ant1.png"].texture];
    this.alien = new Alien(textures, player, stage);
    this.alien.sprite.tint = 0xFA0000;
    this.alien.health = 3;
    this.alien.activity = 0.001;
  },
  AlienSquid: function(player, stage) {
      var textures = [PIXI.Loader.shared.resources["assets/textures/aliens/squid0.png"].texture, PIXI.Loader.shared.resources["assets/textures/aliens/squid1.png"].texture];
      this.alien = new Alien(textures, player, stage);
      this.alien.sprite.tint = 0x1d42c4;
      this.alien.health = 2;
      this.alien.activity = 0.0005;
  },
  AlienSpaceship: function(player, stage) {

  }
};

function Alien(textures, player, stage) {
  this.sprite = new PIXI.AnimatedSprite(textures); //Create animated texture
  this.sprite.tint = 0x2cc91e; //Tint color for texture (Lime)
  this.sprite.width = 50; //Size x
  this.sprite.height = 50; //Size y
  this.sprite.position = new PIXI.Point(0, 0); //Initial position
  this.sprite.autoUpdate = true;
  this.sprite.animationSpeed = 0.04; //Animation speed
  this.sprite.play(); //Play the animation in loop
  this.speed = 1/1500 * settings.screenWidth; //Speed of alien
  this.direction = 1; //Direction of alien
  this.health = 1; //Alien's health
  this.alive = true; //Alien's status
  this.activity = 0.002; //Alien's activity (attacks)

  this.drop = null; //Alien's bullet

  this.update = function() {
    this.sprite.position.x += this.direction * this.speed; //Move alien
    this.activity += 0.000001; //Make it more difficult with time
    if (this.sprite.position.y >= settings.screenHeight) player.lives -= 1; //Damage player if touch bottom of screen
    if (this.drop == null) { //Check if drop exists
      let rdm = Math.random(); //Random event chance
      if (rdm <= this.activity) { //Check activity of alien
          this.attack(); //Make alien attack
        }
    } else {
      this.drop.update(); //Update drop
      if (this.drop.distanceFrom(new PIXI.Point(player.sprite.position.x + player.sprite.width/2, player.sprite.position.y + player.sprite.height/2)) <= player.sprite.width/2) { //Check if hit playerSprite
        player.lives -= this.drop.damage; //Damage player
        stage.addChild(Explosion(this.drop.sprite.position.x, this.drop.sprite.position.y, 50, 50));
        PIXI.Loader.shared.resources["assets/sounds/hit_player.mp3"].data.play(); //Damage player sound effect
        this.drop.toDelete = true;
      }
      if (this.drop.toDelete) { //Check if drop hit
        this.drop.sprite.destroy(); //Destroy tile
        delete this.drop; //Destroy drop
      }
    }
  }
  this.shiftDown = function() {
    this.sprite.position.y += this.sprite.height; //Move down
    this.direction *= -1; //Switch direction
  }
  this.damage = function(value) { //Damage alien
    this.health -= value;
    stage.addChild(Explosion(this.sprite.position.x + this.sprite.width/2, this.sprite.position.y, 30, 30));
    PIXI.Loader.shared.resources["assets/sounds/hit_alien.mp3"].data.volume = 0.6;
    PIXI.Loader.shared.resources["assets/sounds/hit_alien.mp3"].data.play(); //Damage alien sound effect
    if (this.health <= 0) { //If 0 or negative then alien dies
      this.destroy();
    }
  }
  this.destroy = function() { //Kill alien
    this.alive = false;
    stage.addChild(Explosion(this.sprite.position.x, this.sprite.position.y, 60, 60));
    PIXI.Loader.shared.resources["assets/sounds/death_alien.mp3"].data.play(); //Death alien sound effect
  }
  this.attack = function() { //Alien shooting
    this.drop = new Drop(this.sprite.position.x, this.sprite.position.y); //Create new drop
    this.drop.sprite.tint = 0xFA2A00;
    this.drop.speed *= -0.90; //Drop goes down
    stage.addChild(this.drop.sprite);
  }
}

function summonAliens(level, player, stage) {
  var maxPerLine = settings.maxAliensPerLine;
  var initialHeight = 50;
  var aliens = [];
  var currentLine = 0;
  var currentLinePopulation = 0;
  for (let a = 0; a < level * maxPerLine; a++) {
    if (currentLinePopulation>=maxPerLine) {
      currentLine++;
      currentLinePopulation = 0;
    }
    var alien;
    var rdm = Math.random();
    if (rdm < 0.2) {
      alien = new Aliens.AlienCrab(player, stage);
    }
    if (rdm >= 0.2 && rdm < 0.8) {
      alien = new Aliens.AlienSquid(player, stage);
    }
    if (rdm >= 0.8) {
      alien = new Aliens.AlienAnt(player, stage);
    }
    alien.alien.sprite.position.y = initialHeight + currentLine * alien.alien.sprite.height;
    alien.alien.sprite.position.x = settings.screenWidth/2 - (maxPerLine*alien.alien.sprite.width)/2 + currentLinePopulation * alien.alien.sprite.width;
    currentLinePopulation++;
    aliens.push(alien);
  }
  return aliens;
}
