class Game {
  constructor() {
    this.obstaclesArr = [];
    this.goodiesArr = [];
    this.timer = 0;
    this.score = 0;
    // this.refreshRate = 1000 / 5;
    // this.obstacleFrequency = 10;
    this.levels = [
      { level: 1, freqObs: 200, freqGoodies: 400 },
      { level: 2, freqObs: 150, freqGoodies: 450 },
      { level: 3, freqObs: 100, freqGoodies: 500 },
      { level: 4, freqObs: 50, freqGoodies: 550 },
    ];
  }

  start() {
    this.player = new Player();
    this.player.domElement = this.createDomElm(this.player);
    this.drawDomElm(this.player);
    this.addEventListeners();

    // setInterval for goodies
    setInterval(() => {
      this.timer++;

      if (this.timer % 200 === 0) {
        const newGoodie = new Goodie();
        this.goodiesArr.push(newGoodie);
        newGoodie.domElement = this.createDomElm(newGoodie);
        this.drawDomElm(newGoodie);
      }
      this.goodiesArr.forEach((elm) => {
        elm.moveDown();
        this.drawDomElm(elm);
        if (this.collision(this.player, elm)) {
          this.countScore();
          this.removeElmFromArr(this.goodiesArr, elm);
          elm.domElement.remove();
        }
        elm.removeObstacle(elm);
      });
    }, 60);

    // setInterval for obstacles
    // obs: 30/80 ; goodies: 180/60 (<-- this works)

    setInterval(() => {
      this.timer++;

      if (this.timer % 120 === 0) {
        const newObstacle = new Obstacle();
        this.obstaclesArr.push(newObstacle);
        newObstacle.domElement = this.createDomElm(newObstacle);
        this.drawDomElm(newObstacle);
      }

      this.obstaclesArr.forEach((elm) => {
        elm.moveDown();
        this.drawDomElm(elm);
        if (this.collision(this.player, elm)) {
          //this.stop();
        }
        elm.removeObstacle(elm);
      });
    }, 60);
  }

  stop() {
    //alert("Oh noooooo :(");

    // Undisplay divs from board
    let gameDiv = document.getElementById("game");
    gameDiv.style.display = "none";

    // Display game-over div
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

  removeElmFromArr(arr, elm) {
    let index = arr.indexOf(elm);
    if (index > -1) {
      arr.splice(index, 1);
    }
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

  countScore() {
    this.score += 100;
    let score = document.querySelector(".score span");
    score.innerText = this.score;
  }
}

class Player {
  constructor() {
    this.className = "player";
    this.width = 5;
    this.height = 12;
    this.positionX = 38;
    this.positionY = 0;
    this.domElement = null;
  }
  moveLeft() {
    if (this.positionX > 3) {
      this.positionX -= 4;
    }
  }
  moveRight() {
    if (this.positionX < 88) {
      this.positionX += 4;
    }
  }
}

// Array with 6 different paths for obstacle to start from and moveDown
// todo: move into class ParentObstacles
let obstaclesPath = [
  { startPosition: 36, moveDownX: -1, moveDownY: 1 },
  { startPosition: 40, moveDownX: -0.8, moveDownY: 1 },
  { startPosition: 44, moveDownX: -0.3, moveDownY: 1 },
  { startPosition: 48, moveDownX: 0.3, moveDownY: 1 },
  { startPosition: 52, moveDownX: 0.8, moveDownY: 1 },
  { startPosition: 54, moveDownX: 1, moveDownY: 1 },
];

class ParentObstacle {
  constructor() {
    // random number between 1-6
    this.randomPath =
      Math.floor(Math.random() * (Math.floor(6) - Math.ceil(1) + 1)) +
      Math.ceil(1);
    this.positionX = obstaclesPath[this.randomPath].startPosition;
    this.positionY = 48;
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
    this.height = 11;
  }
}

class Goodie extends ParentObstacle {
  constructor(positionX, positionY, width, height, domElement) {
    super(positionX, positionY, width, height, domElement);
    this.className = "goodie";
    this.width = 3;
    this.height = 9;
  }
}

// const levels = [
//     { score: 1500, speed: xx},
//     { score: 3000, speed: xx},
//     { score: 5000, speed: xx}
// ]

const game = new Game();
game.start();
