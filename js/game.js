class Game {
  constructor() {
    this.obstaclesArr = [];
    this.timer = 0;
  }
  start() {
    // create player
    this.player = new Player(); //create an instance of the Player
    this.player.domElement = this.createDomElm(this.player); //create DOM element for the player
    this.drawDomElm(this.player);

    this.addEventListeners();

    setInterval(() => {
      this.timer++;

      if (this.timer % 3 === 0) {
        // create obstacle
        const newObstacle = new Obstacle();
        this.obstaclesArr.push(newObstacle);
        newObstacle.domElement = this.createDomElm(newObstacle);
        this.drawDomElm(newObstacle);
      }
      //move all obstacles to obstaclesArr
      this.obstaclesArr.forEach((elm) => {
        elm.moveDown();
        this.drawDomElm(elm);
        this.collision(this.player, elm);
        elm.removeObstacle(elm);
      });
    }, 2000);
  }

  addEventListeners() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        this.player.moveLeft();
      } else if (event.key === "ArrowRight") {
        this.player.moveRight();
      }
      this.drawDomElm(this.player);
    });
  }

  createDomElm(instance) {
    const htmlTag = document.createElement("div");
    htmlTag.className = instance.className;
    htmlTag.style.width = instance.width + "vw";
    htmlTag.style.height = instance.height + "vh";
    const board = document.getElementById("board");
    board.appendChild(htmlTag);
    return htmlTag;
  }
  drawDomElm(instance) {
    instance.domElement.style.left = instance.positionX + "vw";
    instance.domElement.style.bottom = instance.positionY + "vh";
  }

  collision(instance1, instance2) {
    if (
      instance1.positionX < instance2.positionX + instance2.width &&
      instance1.positionY < instance2.positionY + instance2.height &&
      instance2.positionX < instance1.positionX + instance1.width &&
      instance2.positionY < instance1.positionY + instance1.height
    ) {
      console.log("oh nooooo");
    }
  }
}

class Player {
  constructor() {
    this.className = "player";
    this.positionX = 0;
    this.positionY = 5;
    this.width = 15;
    this.height = 20;
    this.domElement = null;
  }
  moveLeft() {
    this.positionX -= 10;
  }
  moveRight() {
    this.positionX += 10;
  }
}

class Obstacle {
  constructor() {
    this.className = "obstacle";
    this.positionX = Math.random() * (50 - 30) + 50; //Math.random() * (max - min) + min
    this.positionY = 80;
    this.width = 3;
    this.height = 3;
    this.domElement = null;
  }
  moveDown() {
    this.positionY -= 10;
    this.width += 10;
    this.height += 10;
    //console.log("moving down.... current poistion: " + this.positionX);
  }
  removeObstacle(elm) {
    if (elm.positionY < 0) {
      elm.domElement.remove();
    }
  }
}

class Goods {}

const game = new Game();
game.start();
