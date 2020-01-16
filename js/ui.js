function Interface(player) {
  this.container = new PIXI.Container(); //Add global group for inteface
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
  this.container.addChild(this.label);
  this.deadLabel = new PIXI.Text("DEAD", deadStyle); //Death message
  this.deadLabel.visible = false; //Invisible death message
  this.container.addChild(this.deadLabel);
  this.sprites = []; //Lives icons (according to player's health)
  for (let i = 0; i < player.lives; i++) {
    let sprite = new PIXI.Sprite(PIXI.Loader.shared.resources["assets/textures/spaceship.png"].texture);
    sprite.width = 30;
    sprite.height = 30;
    sprite.position.x = this.label.width + i * sprite.width; //Position of sprite
    this.container.addChild(sprite);
    this.sprites.push(sprite);
  }
  this.label.position.y = this.container.height - this.label.height; //Adjust position of label
  this.deadLabel.position.y = this.label.position.y; //Adjust position of label
  this.deadLabel.position.x = this.label.position.x + this.label.width; //Adjust position of label
  this.container.position.x = window.innerWidth - this.container.width; //Adjust position of ui

  this.update = function() {
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
