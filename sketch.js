let bg;
let flowers = [];
let flowerImages = [];
let yellowflowerImages = [];
let redflowerImages = [];
let bee;
let witherflowerImages = [];
let witheryellowImages = [];
let witherredImages = [];

function preload() {
  bg = loadImage("background1.png");
  beeImg = loadImage("bee.png");

  // Load flower images
  flowerImages[0] = loadImage("flower0.png");
  flowerImages[1] = loadImage("flower1.png");
  flowerImages[2] = loadImage("flower2.png");
  flowerImages[3] = loadImage("flower3.png");
  flowerImages[4] = loadImage("flower4.png");
  flowerImages[5] = loadImage("flower5.png");

  yellowflowerImages[0] = loadImage("yellow0.png");
  yellowflowerImages[1] = loadImage("yellow1.png");
  yellowflowerImages[2] = loadImage("yellow2.png");
  yellowflowerImages[3] = loadImage("yellow3.png");
  yellowflowerImages[4] = loadImage("yellow4.png");
  yellowflowerImages[5] = loadImage("yellow5.png");

  redflowerImages[0] = loadImage("red0.png");
  redflowerImages[1] = loadImage("red1.png");
  redflowerImages[2] = loadImage("red2.png");
  redflowerImages[3] = loadImage("red3.png");
  redflowerImages[4] = loadImage("red4.png");
  redflowerImages[5] = loadImage("red5.png");

  // Load wither (dead) images for all flowers - assuming all share the same dead images
  for (let i = 0; i < 5; i++) {
    witherflowerImages[i] = loadImage(`dead${i}.png`);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  bee = new Bee();

  // Create flowers with normal and wither images
  flowers.push(new Flower(300, 600, flowerImages, witherflowerImages));
  flowers.push(new Flower(600, 600, flowerImages, witherflowerImages));
  flowers.push(new Flower(900, 600, flowerImages, witherflowerImages));

  flowers.push(new Flower(400, 600, yellowflowerImages, witherflowerImages));
  flowers.push(new Flower(1100, 600, yellowflowerImages, witherflowerImages));
  flowers.push(new Flower(100, 600, yellowflowerImages, witherflowerImages));
  
  flowers.push(new Flower(800, 600, redflowerImages, witherflowerImages));
  flowers.push(new Flower(1500, 600, redflowerImages, witherflowerImages));
  flowers.push(new Flower(200, 600, redflowerImages, witherflowerImages));
  flowers.push(new Flower(1400, 600, redflowerImages, witherflowerImages));
  flowers.push(new Flower(300, 600, flowerImages, witherflowerImages));
flowers.push(new Flower(400, 600, yellowflowerImages, witherflowerImages));
// etc for all flowers

}

function draw() {
  image(bg, width / 2, height / 2, width, height);

  for (let f of flowers) {
    f.display();
  }

  bee.update();
  bee.display();
}

function mousePressed() {
  for (let f of flowers) {
    f.checkClick();
  }
}


class Flower {
  constructor(x, y, images, witherImages) {
    this.x = x;
    this.y = y;
    this.size = 150;

    this.images = images;         // healthy flower images
    this.witherImages = witherImages; // dead flower images

    this.stage = 0;               // bloom stage (0 to images.length -1)
    this.witherStage = -1;        // -1 means no wither yet
    this.dead = false;

    this.clickCount = 0;
    this.lastInteracted = millis();
    this.witherTimer = 0;
  }

  display() {
    let timeSince = millis() - this.lastInteracted;

    if (this.dead) {
      // Fully dead - show last dead image and never change or reset
      image(this.witherImages[this.witherImages.length - 1], this.x, this.y, this.size, this.size);
      return;
    }

    if (timeSince > 10000 && this.stage < this.images.length - 1) {
      // Start withering gradually after 10 seconds if not fully bloomed and not dead
      if (millis() - this.witherTimer > 1000 && this.witherStage < this.witherImages.length - 1) {
        this.witherStage++;
        this.witherTimer = millis();

        if (this.witherStage === this.witherImages.length - 1) {
          this.dead = true; // fully withered
        }
      }
      // Show current wither image
      image(this.witherImages[this.witherStage], this.x, this.y, this.size, this.size);

    } else {
      // Healthy flower or clicked recently
      this.witherStage = -1;
      image(this.images[this.stage], this.x, this.y, this.size, this.size);
    }
  }

  checkClick() {
    if (
      mouseX > this.x - this.size / 2 &&
      mouseX < this.x + this.size / 2 &&
      mouseY > this.y - this.size / 2 &&
      mouseY < this.y + this.size / 2
    ) {
      // Disable clicking if fully bloomed or fully dead
      if (this.stage === this.images.length - 1 || this.dead) {
        return;
      }

      // If currently withering, clicking resets wither and updates bloom
      if (this.witherStage !== -1 && !this.dead) {
        this.witherStage = -1;
      }

      this.stage++;
      if (this.stage >= this.images.length) {
        this.stage = this.images.length - 1;  // Cap at max bloom stage
      }

      this.clickCount++;
      this.lastInteracted = millis();
    }
  }
}

let beeImg;

class Bee {
  constructor() {
    this.reset();
    this.size = 50;
    this.trail = [];
    this.maxTrail = 50;
  }

  reset() {
    this.x = random(-100, -50);
    this.y = random(height);
    this.speedX = random(2, 5);
    this.offset = random(1000);
  }

  update() {
    this.x += this.speedX;
    this.y += sin((this.x + this.offset) * 0.05) * 2;

    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > this.maxTrail) {
      this.trail.shift();
    }

    if (this.x > width + 100) {
      this.reset();
      this.trail = [];
    }
  }

  display() {
    noFill();
    stroke(0);
    strokeWeight(2);
    for (let i = 1; i < this.trail.length; i += 4) {
      let prev = this.trail[i - 1];
      let curr = this.trail[i];
      line(prev.x, prev.y, curr.x, curr.y);
    }

    image(beeImg, this.x, this.y, this.size, this.size);
  }
}
