function Ship(stage) {
  this.sprite = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/textures/spaceship.png"].texture);
  this.sprite.width = 75;
  this.sprite.height = 75;
  this.sprite.position.x = (settings.screenWidth - this.sprite.width)/2; //Center player
  this.sprite.position.y =settings.screenHeight - this.sprite.height; //Set player at the bottom of the screen
  this.direction = 0; //Direction of movement
  this.speed = 5; //Speed of the player
  this.drop = null;
  this.lives = 3; //Initial lives
  this.score = 0; //Player's score
  this.alive = true;
  this.control = true;

  var map = {68: false, 39: false, 65: false, 37: false, 32: false}; //Map of controls

  this.update = function() { // Update function for player
    if (this.alive && this.control) { //Update only if alive
      this.sprite.position.x += this.direction * this.speed; //Make the player move
      if (this.sprite.position.x < 0) this.sprite.position.x = 0; //Invisible wall on the left side of the screen
      if (this.sprite.position.x > settings.screenWidth - this.sprite.width) this.sprite.position.x = settings.screenWidth - this.sprite.width; //Invisible wall on the right side of the screen
    } else if (this.alive && this.control == false) { //Fly away
      this.speed += 0.005;
      this.sprite.position.y -= this.speed;
    }
    if (this.drop) { //Check if bullet exists
      this.drop.update(); //Update bullet
      if (this.drop.toDelete) { //Check if bullet hit
        this.drop.sprite.destroy(); //Destroy tile
        delete this.drop; //Destroy bullet
      }
    }
  }

  this.onKeyUp = function(e) {
    if (e.keyCode in map) {
      map[e.keyCode] = false;
    }
    if (e.keyCode != 32) { //if its not space bar
      this.direction = 0; //Player stops moving
    }
  }

this.onKeyDown = function(e) {
    // W Key is 87
    // S Key is 83
    // D Key is 68
    // A Key is 65
    if (e.keyCode in map) {
      map[e.keyCode] = true;
      if (map[68] || map[39]) { //Right
        this.direction = 1; //Go to the right
      } else if (map[65] || map[37]) { //Left
        this.direction = -1; //Go to the left
      }
      if (map[32] && this.drop == null) { //Shoot
        this.drop = new Drop(this.sprite.position.x + this.sprite.width/2, this.sprite.position.y); //Create new bullet
        var rdmSoundEffect = Math.random();
        if (rdmSoundEffect < 0.33) {
           PIXI.Loader.shared.resources["assets/sounds/laser1.mp3"].data.volume = 0.6;
           PIXI.Loader.shared.resources["assets/sounds/laser1.mp3"].data.play();
        }
        if (rdmSoundEffect >= 0.33 && rdmSoundEffect < 0.66) {
           PIXI.Loader.shared.resources["assets/sounds/laser2.mp3"].data.volume = 0.6;
           PIXI.Loader.shared.resources["assets/sounds/laser2.mp3"].data.play();
        }
        if (rdmSoundEffect >= 0.66 && rdmSoundEffect <= 1) {
           PIXI.Loader.shared.resources["assets/sounds/laser3.mp3"].data.volume = 0.6;
           PIXI.Loader.shared.resources["assets/sounds/laser3.mp3"].data.play();
        }
        this.drop.speed = 8;
        stage.addChild(this.drop.sprite);
        game.play = true; //Start game if not already
      }
    }
  }
}
