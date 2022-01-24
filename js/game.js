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
          elm.domElement.remove();
        }
        elm.removeObstacle(elm);
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
    this.width = 10;
    this.height = 20;
    this.positionX = (100 - this.width) / 2;
    this.positionY = 6;
    this.domElement = null;
  }
  moveLeft() {
    this.positionX -= 5;
  }
  moveRight() {
    this.positionX += 5;
  }
}

// Array with 6 different paths for obstacle to start from and moveDown
let path = [
  { startPosition: 36, moveDownX: -4, moveDownY: 10 },
  { startPosition: 40, moveDownX: -3, moveDownY: 10 },
  { startPosition: 44, moveDownX: -2, moveDownY: 10 },
  { startPosition: 48, moveDownX: 2, moveDownY: 10 },
  { startPosition: 52, moveDownX: 3, moveDownY: 10 },
  { startPosition: 56, moveDownX: 4, moveDownY: 10 },
];

// console.log(path[Math.floor(Math.random() * path.length)]);
//console.log(Math.floor(Math.random() * (Math.floor(6) - Math.ceil(1) + 1)) + Math.ceil(1));
//console.log(path[2].startPosition)

class ParentObstacle {
  constructor() {
    // random number between 1-6
    this.randomPath =
      Math.floor(Math.random() * (Math.floor(6) - Math.ceil(1) + 1)) +
      Math.ceil(1);
    this.positionX = path[this.randomPath].startPosition;
    this.positionY = 75;
    this.width = 4;
    this.height = 8;
    this.domElement = null;
  }

  moveDown() {
    this.positionY -= path[this.randomPath].moveDownY;
    this.positionX += path[this.randomPath].moveDownX;
  }

  removeObstacle(elm) {
    if (elm.positionY < 5) {
      elm.domElement.remove();
    }
  }
}

class Obstacle extends ParentObstacle {
  constructor(positionX, positionY, width, height, domElement) {
    super(positionX, positionY, width, height, domElement);
    this.className = "obstacle";
  }
}

class Goodie extends ParentObstacle {
  constructor(positionX, positionY, width, height, domElement) {
    super(positionX, positionY, width, height, domElement);
    this.className = "goodie";
  }
}

// let obstaclePath = [
//   { this.positionX: 35,
//      moveDownY: this.positionY - 10,
//     moveDownX: this.positionX - 4
//   },
//   {
//     this.positionX: 39,
//     moveDownY: this.positionY - 10,
//     moveDownX: this.positionX - 3,
//   },
//  {
//     this.positionX: 43,
//     moveDownY: this.positionY - 10,
//     moveDownX: this.positionX - 2,
//   },
//  {
//     this.positionX: 47,
//     moveDownY: this.positionY - 10,
//     moveDownX: this.positionX + 2,
//   },
//  {
//     this.positionX: 51,
//     moveDownY: this.positionY - 10,
//     moveDownX: this.positionX + 3,
//   },
//  {
//     this.positionX: 54,
//     moveDownY: this.positionY - 10,
//     moveDownX: this.positionX + 4,
//   },
// ];

const game = new Game();
game.start();
