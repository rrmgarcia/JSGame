export default class Player {
  rightPress = false;
  leftPress = false;
  spacePress = false;

  constructor(canvas, velocity, bulletShooter) {
    this.canvas = canvas;
    this.velocity = velocity;
    this.bulletShooter = bulletShooter;

    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 75;
    this.width = 48;
    this.height = 38;
    this.image = new Image();
    this.image.src = "assets/sprites/playership.png";

    document.addEventListener("keydown", this.keydown);
    document.addEventListener("keyup", this.keyup);
  }

  draw(ctx) {
    if (this.spacePress) {
      this.bulletShooter.shoot(this.x + this.width / 2, this.y, 4, 10);
    }
    this.move();
    this.collideWithWalls();
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
  //contains player inside the canvas
  collideWithWalls() {
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x > this.canvas.width - this.width) {
      this.x = this.canvas.width - this.width;
    }
  }
  //keyboard controls
  move() {
    if (this.rightPress) {
      this.x += this.velocity;
    } else if (this.leftPress) {
      this.x -= this.velocity;
    }
  }

  keydown = (event) => {
    if (event.code == "ArrowRight") {
      this.rightPress = true;
    }
    if (event.code == "ArrowLeft") {
      this.leftPress = true;
    }
    if (event.code == "Space") {
      this.spacePress = true;
    }
  };

  keyup = (event) => {
    if (event.code == "ArrowRight") {
      this.rightPress = false;
    }
    if (event.code == "ArrowLeft") {
      this.leftPress = false;
    }
    if (event.code == "Space") {
      this.spacePress = false;
    }
  };
}
