import Bullet from "./Bullet.js ";

export default class BulletShooter {
  bullets = [];
  nextBulletAllowed = 0;

  constructor(canvas, maxBullets, bulletColor, soundEnabled) {
    this.canvas = canvas;
    this.maxBullets = maxBullets;
    this.bulletColor = bulletColor;
    this.soundEnabled = soundEnabled;

    this.shootSound = new Audio("assets/music/alien-blaster.wav");
    this.shootSound.volume = 0.3;
  }
  //filters out bullets outside of canvas
  draw(ctx) {
    this.bullets = this.bullets.filter(
      (bullet) => bullet.y + bullet.width > 0 && bullet.y <= this.canvas.height
    );
    //delay mechanism for bullets (can only fire N bullets at a time)
    this.bullets.forEach((bullet) => bullet.draw(ctx));
    if (this.nextBulletAllowed > 0) {
      this.nextBulletAllowed--;
    }
  }

  //bullet collision with sprite
  collideWith(sprite) {
    const bulletThatHitSpriteIndex = this.bullets.findIndex((bullet) =>
      bullet.collideWith(sprite)
    );

    if (bulletThatHitSpriteIndex >= 0) {
      this.bullets.splice(bulletThatHitSpriteIndex, 1);
      return true;
    }
    return false;
  }

  //shooting bullets
  shoot(x, y, velocity, nextBulletAllowed = 0) {
    if (this.nextBulletAllowed <= 0 && this.bullets.length < this.maxBullets) {
      const bullet = new Bullet(this.canvas, x, y, velocity, this.bulletColor);
      this.bullets.push(bullet);
      if (this.soundEnabled) {
        this.shootSound.currentTime = 0;
        this.shootSound.play();
      }
      this.nextBulletAllowed = nextBulletAllowed;
    }
  }
}
