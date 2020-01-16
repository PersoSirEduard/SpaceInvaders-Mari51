function Interface(player) {
  this.statusContainer = new PIXI.Container(); //Add global group for status interface
  this.scoreContainer = new PIXI.Container(); //Add global group for score interface

  var style = new PIXI.TextStyle({ //load custom font
      fontFamily: "AdvancedPixelFont",
      fontSize: 35,
      fill : 0xffffff
  });
  var deadStyle = new PIXI.TextStyle({ //load custom font
      fontFamily: "AdvancedPixelFont",
      fontSize: 35,
      fill : 0xd91431
  });
  this.label = new PIXI.Text("Status: ", style); //Display text
  this.statusContainer.addChild(this.label);
  this.deadLabel = new PIXI.Text("DEAD", deadStyle); //Death message
  this.deadLabel.visible = false; //Invisible death message
  this.statusContainer.addChild(this.deadLabel);
  this.sprites = []; //Lives icons (according to player's health)
  for (let i = 0; i < player.lives; i++) {
    let sprite = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/textures/spaceship.png"].texture);
    sprite.width = 30;
    sprite.height = 30;
    sprite.position.x = this.label.width + i * sprite.width; //Position of sprite
    this.statusContainer.addChild(sprite);
    this.sprites.push(sprite);
  }
  this.label.position.y = this.statusContainer.height - this.label.height; //Adjust position of label
  this.deadLabel.position.y = this.label.position.y; //Adjust position of label
  this.deadLabel.position.x = this.label.position.x + this.label.width; //Adjust position of label
  this.statusContainer.position.x = window.innerWidth - this.statusContainer.width; //Adjust position of ui

  this.scoreLabel = new PIXI.Text("Score: 0", style);
  this.scoreContainer.addChild(this.scoreLabel);
  this.scoreContainer.position = new PIXI.Point(0, 0);

  this.update = function() {
    this.scoreLabel.text = "Score: " + Math.round(player.score).toString();
    for (let i = 0; i < this.sprites.length; i++) { //Reset visibility of lives
      this.sprites[i].visible = false;
    }
    for (let i = 0; i < player.lives; i++) { //Show remaining lives
      this.sprites[i].visible = true;
    }
    if (player.lives <= 0) { //Check if player is dead
      this.deadLabel.visible = true; //Visible death message
    }
  }
}

function VictoryDisplay() {
  this.sprite = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/textures/mari51.png"].texture); //Create sprite with logo
  this.sprite.width = 0.6 * window.innerWidth;
  this.sprite.height = this.sprite.width;
  this.sprite.position.x = window.innerWidth/2 - this.sprite.width/2;
  this.sprite.position.y = -this.sprite.height;
  this.sprite.visible = false;
  this.deltaColor = 0;
  this.colorChangeDelta = 20; //Speed for color change

  this.update = function(delta) {
    this.deltaColor += delta;
    if (this.sprite.visible) {
      if (this.deltaColor >= this.colorChangeDelta) {
        this.sprite.tint = this.randomColor();
        this.deltaColor = 0;
      }
      if (this.sprite.position.y + this.sprite.height/2 < window.innerHeight/2) {
        this.sprite.position.y += 3;
      }
    }
  }

  this.randomColor = function() {
    var letters = "0123456789ABCDEF";
    var color = '0x';
    for (var i = 0; i < 6; i++) {
      color += letters[(Math.floor(Math.random() * 16))];
    }
    return color;
  }
}
