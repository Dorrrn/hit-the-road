class Game {
  constructor() {
    this.obstaclesArr = [];
    this.goodiesArr = [];
    this.timer = 0;
    this.score = 0;
    this.intervalId = null;
    this.level = 1;

    this.refreshRate = 60;

    this.goodiesFreq = 30;
    this.obsFreq = 40;
  }

  start() {
    this.player = new Player();
    this.player.domElement = this.createDomElm(this.player);
    this.drawDomElm(this.player);
    this.addEventListeners();
    //this.playAudio();

    // setInterval for goodies
    this.intervalId = setInterval(() => {
      this.timer++;

      if (this.timer % Math.floor(this.goodiesFreq * this.level) === 0) {
        const newGoodie = new Goodie();
        this.goodiesArr.push(newGoodie);
        newGoodie.domElement = this.createDomElm(newGoodie);
        this.drawDomElm(newGoodie);
      } else if (this.timer % Math.floor(this.obsFreq / this.level) === 0) {
        const newObstacle = new Obstacle();
        this.obstaclesArr.push(newObstacle);
        newObstacle.domElement = this.createDomElm(newObstacle);
        this.drawDomElm(newObstacle);
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

      this.obstaclesArr.forEach((elm) => {
        elm.moveDown();
        this.drawDomElm(elm);
        if (this.collision(this.player, elm)) {
          this.stop();
          elm.domElement.remove();
        }
        elm.removeObstacle(elm);
      });
    }, this.refreshRate / this.level);
  }

  stop() {
    if (alert("Oh noooo.. game over :( ")) {
    } else window.location.reload();

    // if (confirm("Oh noooo.. game over! Do you want to play again?") === true) {
    //   setTimeout(() => {
    //     location.reload();
    //   }, 1000);
    // } else {
    //   //
    // }
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
    let audioCountScore = new Audio("../js/count-sound.wav");
    audioCountScore.loop = false;
    audioCountScore.play();

    if (this.score % 500 === 0) {
      this.level++;
      let audioLevelUp = new Audio("../js/level-up-sound.wav");
      audioLevelUp.loop = false;
      audioLevelUp.play();
    }
    let levelUp = document.querySelector(".level span");
    levelUp.innerText = this.level;
  }

  // playAudio() {
  //   let audio = new Audio("./../music/background-sound.mp3");
  //   audio.play();
  //   audio.volume = 0.1;
  // }
}

class Player {
  constructor() {
    this.className = "player";
    this.width = 5;
    this.height = 12;
    this.positionX = 38;
    this.positionY = -5;
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

// Array with different paths for obstacle to start from and moveDown
// todo: move into class ParentObstacles
let obstaclesPath = [
  { startPosition: 38, moveDownX: -1, moveDownY: 1 },
  { startPosition: 43, moveDownX: -0.8, moveDownY: 1 },
  { startPosition: 45, moveDownX: -0.3, moveDownY: 1 },
  { startPosition: 47, moveDownX: 0, moveDownY: 1 },
  //{ startPosition: 49, moveDownX: 0.3, moveDownY: 1 },
  { startPosition: 51, moveDownX: 0.8, moveDownY: 1 },
  { startPosition: 53, moveDownX: 0.9, moveDownY: 1 },
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

const game = new Game();
game.start();
