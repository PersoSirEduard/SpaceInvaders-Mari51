function Drop(x, y) {
  this.sprite = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/textures/star.png"].texture); //Star texture will be modified
  this.sprite.width = 6; //Size x
  this.sprite.height = 15; //Size y
  this.sprite.position = new PIXI.Point(x - this.sprite.width/2, y); //Initial spawn position
  this.sprite.tint = 0xeb34eb; //Color of drop (Magenta like color)
  this.speed = 6; //Speed of drop
  this.damage = 1; //Damage that bullet makes
  this.toDelete = false; //Destroy the bullet if true

  this.evaporate = function() { //Call when hit
    this.toDelete = true;
    this.sprite.visible = false;
  };

  this.update = function() {
    this.sprite.position.y -= this.speed;
    if (this.sprite.position.y < -this.sprite.height) this.evaporate(); //Evaporate if reach top of screen
    if (this.sprite.position.y > settings.screenHeight) this.evaporate(); //Evaporate if reach bottom of screen
  };

  this.distanceFrom = function(point) { //Returns distance from object
    return Math.sqrt(Math.pow(this.sprite.position.x - point.x, 2) + Math.pow(this.sprite.position.y - point.y, 2));
  }
}

function Explosion(x, y, w, h) {
  var textures = [
    PIXI.Loader.shared.resources["assets/textures/explosion/exp0.png"].texture,
    PIXI.Loader.shared.resources["assets/textures/explosion/exp1.png"].texture,
    PIXI.Loader.shared.resources["assets/textures/explosion/exp2.png"].texture,
    PIXI.Loader.shared.resources["assets/textures/explosion/exp3.png"].texture,
    PIXI.Loader.shared.resources["assets/textures/explosion/exp4.png"].texture,
    PIXI.Loader.shared.resources["assets/textures/explosion/exp5.png"].texture,
    PIXI.Loader.shared.resources["assets/textures/explosion/exp6.png"].texture,
    PIXI.Loader.shared.resources["assets/textures/explosion/exp7.png"].texture,
    PIXI.Loader.shared.resources["assets/textures/explosion/exp8.png"].texture,
    PIXI.Loader.shared.resources["assets/textures/explosion/exp9.png"].texture
  ];
  var sprite = new PIXI.AnimatedSprite(textures); //Create animated texture
  sprite.width = w; //Size x
  sprite.height = h; //Size y
  sprite.position = new PIXI.Point(x, y); //Initial position
  sprite.autoUpdate = true;
  sprite.loop = false;
  sprite.animationSpeed = 0.2; //Animation speed
  sprite.play(); //Play the animation in loop

  sprite.onComplete = function() {
    sprite.destroy();
  }
  return sprite;
}
