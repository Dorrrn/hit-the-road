class Game {
  constructor() {
    this.obstaclesArr = [];
    this.goodiesArr = [];
    this.timer = 0;
    this.refreshRate = 1000 / 5; //60 frames per second
    this.obstacleFrequency = 10;
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

      // somehow only works when 3 ????
      if (this.timer % 30 === 0) {
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
    }, 100);

    // setInterval for goodies - maybe have it in one
    setInterval(() => {
      this.timer++;

      if (this.timer % 30 === 0) {
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
          this.countScore();
        }
        elm.removeObstacle(elm);
      });
    }, 80);
  }

  stop() {
    //alert("Oh noooooo :(");
    // Undisplay divs from board
    let boardDiv = document.getElementById("board");
    boardDiv.style.display = "none";

    let headlineDiv = document.getElementById("headline");
    headlineDiv.style.display = "none";

    // let obstalcesDiv = document.getElementById("obstacle");
    // obstalcesDiv.style.display = "none";
    // let goodiesDiv = document.getElementById("goodie");
    // goodiesDiv.style.display = "none";
    // let playerDiv = document.getElementById("player");
    // playerDiv.style.display = "none";
    // let scoreDiv = document.getElementById("score");
    // scoreDiv.style.display = "none";

    // Display game-over divs
    let gameOverDiv = document.getElementById("game-over");
    gameOverDiv.style.display = "block";
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
    instance.domElement.style.left = instance.positionX + "%";
    instance.domElement.style.bottom = instance.positionY + "%";
  }

  collision(instance1, instance2) {
    if (
      instance1.positionX < instance2.positionX + instance2.width &&
      instance1.positionY < instance2.positionY + instance2.height &&
      instance2.positionX < instance1.positionX + instance1.width &&
      instance2.positionY < instance1.positionY + instance1.height
    ) {
      instance2.domElement.remove();
      return true;
    }
  }

  countScore() {
    this.score += 100;
    let score = document.querySelector(".score span");
    score.innerText = this.score;
  }
}

class Player {
  constructor() {
    this.className = "player";
    this.width = 6;
    this.height = 20;
    this.positionX = 38;
    this.positionY = 0;
    this.domElement = null;
  }
  moveLeft() {
    if (this.positionX > 5) {
      this.positionX -= 5;
    }
  }
  moveRight() {
    if (this.positionX < 88) {
      this.positionX += 5;
    }
  }
}

// Array with 6 different paths for obstacle to start from and moveDown
let obstaclesPath = [
  { startPosition: 36, moveDownX: -1.5, moveDownY: 1 },
  { startPosition: 40, moveDownX: -0.8, moveDownY: 1 },
  { startPosition: 44, moveDownX: -0.3, moveDownY: 1 },
  { startPosition: 48, moveDownX: 0.3, moveDownY: 1 },
  { startPosition: 52, moveDownX: 0.8, moveDownY: 1 },
  { startPosition: 56, moveDownX: 1.5, moveDownY: 1 },
];

class ParentObstacle {
  constructor() {
    // random number between 1-6
    this.randomPath =
      Math.floor(Math.random() * (Math.floor(6) - Math.ceil(1) + 1)) +
      Math.ceil(1);
    this.positionX = obstaclesPath[this.randomPath].startPosition;
    this.positionY = 45;
    this.domElement = null;
  }

  moveDown() {
    this.positionY -= obstaclesPath[this.randomPath].moveDownY;
    this.positionX += obstaclesPath[this.randomPath].moveDownX;
  }

  removeObstacle(elm) {
    if (elm.positionX < 0 || elm.positionY < 0 || elm.positionX > 96) {
      elm.domElement.remove();
    }
  }
}

class Obstacle extends ParentObstacle {
  constructor(positionX, positionY, width, height, domElement) {
    super(positionX, positionY, width, height, domElement);
    this.className = "obstacle";
    this.width = 3;
    this.height = 10;
  }
}

class Goodie extends ParentObstacle {
  constructor(positionX, positionY, width, height, domElement) {
    super(positionX, positionY, width, height, domElement);
    this.className = "goodie";
    this.width = 3;
    this.height = 8;
  }
}

// const levels = [
//     { score: 1500, speed: xx},
//     { score: 3000, speed: xx},
//     { score: 5000, speed: xx}
// ]

const game = new Game();
game.start();
