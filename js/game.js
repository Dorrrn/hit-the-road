class Game {
  constructor() {
    this.obstaclesArr = [];
    this.goodiesArr = [];
    this.timer = 0;
    this.score = 0;
  }
  start() {
    // create player
    this.player = new Player(); //create an instance of the Player
    this.player.domElement = this.createDomElm(this.player); //create DOM element for the player
    this.drawDomElm(this.player);

    this.addEventListeners();

    // setInterval for obstacles
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
        if (this.collision(this.player, elm)) {
          this.stop();
        }
        elm.removeObstacle(elm);
      });
    }, 1000);

    // setInterval for goodies - maybe have it in one
    setInterval(() => {
      this.timer++;

      if (this.timer % 4 === 0) {
        // create obstacle
        const newGoodie = new Goodie();
        this.goodiesArr.push(newGoodie);
        newGoodie.domElement = this.createDomElm(newGoodie);
        this.drawDomElm(newGoodie);
      }
      //move all obstacles to obstaclesArr
      this.goodiesArr.forEach((elm) => {
        elm.moveDown();
        this.drawDomElm(elm);
        if (this.collision(this.player, elm)) {
          this.score += 100;
          console.log(this.score);
          this.printScore();
        }
        elm.removeGoodie(elm);
      });
    }, 1000);
  }

  stop() {
    //alert("Oh noooooo :(");
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
      return true;
    }
  }

  printScore() {
    let score = document.querySelector(".score span");
    score.innerText = this.score;
  }
}

class Player {
  constructor() {
    this.className = "player";
    this.positionX = 0;
    this.positionY = 5;
    this.width = 50;
    this.height = 30;
    this.domElement = null;
  }
  moveLeft() {
    this.positionX -= 5;
  }
  moveRight() {
    this.positionX += 5;
  }
}

class Obstacle {
  constructor() {
    this.className = "obstacle";
    this.positionX = Math.random() * (30 - 20) + 30; //Math.random() * (max - min) + min
    this.positionY = 85;
    this.width = 4;
    this.height = 4;
    this.domElement = null;
  }
  moveDown() {
    this.positionY -= 10;
    this.positionX -= 5;
    // this.width += 10; should increase size, while moving down
    // this.height += 10;
  }
  removeObstacle(elm) {
    if (elm.positionY < 0) {
      elm.domElement.remove();
    }
  }
}

class Goodie {
  constructor() {
    this.className = "goodie";
    this.positionX = Math.random() * (30 - 20) + 30; //Math.random() * (max - min) + min
    this.positionY = 85;
    this.width = 13;
    this.height = 13;
    this.domElement = null;
  }
  moveDown() {
    this.positionY -= 10;
    this.positionX += 5; // should move either left or right -=5
    // this.width += 5;
    // this.height += 5;
  }
  removeGoodie(elm) {
    if (elm.positionY < 0) {
      elm.domElement.remove();
    }
  }
}

const game = new Game();
game.start();
