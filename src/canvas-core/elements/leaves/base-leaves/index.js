import randomInt from "@src/utils/random-int";

class BaseLeaves {
  constructor(metrics, type, image) {
    this.type = type;
    this.image = image;
    this.coordX = (randomInt(0, 1024) - metrics.baisX) / metrics.zoom;
    this.coordY = (-50 - metrics.baisY) / metrics.zoom;
    this.size = randomInt(10, 50);
    this.finish = false;
    this.area = this.findArea(metrics);
    this.fell = false;
    this.clicked = false;
    this.angle = randomInt(0, 180);
    this.opacity = 1;
    this.frequency = randomInt(80, 120);
    this.amplitude = 1.5;
    this.speedFall = Math.random() * (1.7 - 0.7) + 0.7;
    this.fallType = this.defineTypeFalling(randomInt(0, 1));
    this.state = randomInt(0, 15);
    this.stateForLeaf = randomInt(0, 15);
    this.animetionTimeStamp = new Date().getTime() + randomInt(1000, 2000);
    this.sign = 1;
    this.currentSpeed = 0;
    this.flag = false;
    this.nextSpeed = 0.00001;
    this.nextSpeedSecond = 0.0001;
  }

  /**
   * Метод для определения типа анимации
   * @param {int} num 
   * @returns 
   */
  defineTypeFalling(num) {
    switch (num) {
      case 0:
        return this.fallSinRight;

      case 1:
        return this.fallSinLeft;
    }
  }

  findArea(metrics = null) {

  }

  /**
   * Метод для подсчёта стандарной синусоиды
   */
  fallSinRight(b) {
    // const formul = Math.sin((this.coordY / this.frequency));
    // this.coordX += this.amplitude * formul;
    this.coordX += b;
    // this.angle += 2.5 * formul;
  }
  /**
   * Метод для подсчёта иверсированной синусоиды
   */
  fallSinLeft(b) {
    // const formul = Math.sin((this.coordY / this.frequency));
    this.coordX += b;
    // this.angle += -2.5 * formul;
  }

  lcgChangeSign(someDigit) {
    this.state = (5 * someDigit + 4) % 6;
    // return this.state > 3 ? 1 : (-1);
    this.state > 3 ? this.sign = 1 : this.sign = -1;
    // this.sign == 1 ? this.sign = -1 : this.sign = 1;
  }

  lcg() {
    // state = (5 * coordx + 3) % 16;
    // let sign = randomInt(0, 1);
    // if (sign === 0) {
    //   return -((5 * coordx + 3) % 5);
    // }
    let asdf = randomInt(0, 15);
    // console.log(this.lcgSign(coordx) * ((5 * this.stateForLeaf + 3) % 6));
    // ((5 * this.state + 4) % 3) * 2;
    return ((5 * this.state + 4) % 3) * 0.3;
  }

  /**
   * Метод для расчёта, до куда долетит примитив
   * @param {Object} metrics 
   * @param {*} startTime 
   */
  animate(metrics, startTime) {
    let time = new Date().getTime();
    if (this.coordY * metrics.zoom + metrics.baisY <= 700 - this.size * metrics.zoom && !this.finish) {
      this.coordY += this.speedFall;
      // this.fallType(this.lcg(this.coordX));
      if (time >= this.animetionTimeStamp && this.flag == false) {
        this.currentSpeed = this.lcg();
        this.nextSpeed = this.lcg();
        this.nextSpeedSecond = this.nextSpeed;
        let currentSign = this.sign;
        this.lcgChangeSign(this.animetionTimeStamp);
        if (currentSign != this.sign) {
          this.flag = true;
          // this.nextSpeed = this.lcg(this.coordX);
        }
        this.animetionTimeStamp = new Date().getTime() + randomInt(1000, 2000);
        // console.log('sadfsda');
      }
      if (this.flag && this.currentSpeed >= 0) {
        this.coordX += (-1) * this.sign * (this.currentSpeed);
        this.currentSpeed -= 0.0001;
      } else if (this.nextSpeed >= 0) {
        this.coordX += (-1) * this.sign * (this.nextSpeed);
        this.nextSpeed -= 0.0001;
      } else {
        this.coordX += this.sign * this.nextSpeedSecond;
        this.flag = false;
      }
      
      if (
        this.coordY * metrics.zoom + metrics.baisY >= 300 &&
        ((this.coordY * metrics.zoom + metrics.baisY) - 300) / (600 - 300) <= 1
      ) {
        this.opacity = 1 - ((this.coordY * metrics.zoom + metrics.baisY) - 300) / (600 - 300);
      }
    } else {
      this.startLeavesFall(metrics);
    }
    this.area = this.findArea(metrics);
  }

  /**
   * Метод для проверки видимости примитива
   * @param {Object} metrics 
   * @returns 
   */
  isIntersection(metrics) {
    if (
      (this.coordX * metrics.zoom + metrics.baisX) <= 1124 &&
      (this.coordX * metrics.zoom + metrics.baisX) >= -100 &&
      (this.coordY * metrics.zoom + metrics.baisY) <= 800 &&
      (this.coordY * metrics.zoom + metrics.baisY) >= -100
    ) {
      return true
    } else {
      this.startLeavesFall(metrics);
    }
  }

  /**
   * Метод для установки новых стартовых значений
   * @param {object} metrics 
   */
  startLeavesFall(metrics) {
    this.coordX = (randomInt(0, 1024) - metrics.baisX) / metrics.zoom;
    this.coordY = (-50 - metrics.baisY) / metrics.zoom;
    this.time = new Date().getTime();
    this.opacity = 1;
  }

  /**
   * Метод возвращает свойства примитива
   * @returns object
   */
  getParam() {
    return (
      {
        type: this.type,
        coordX: this.coordX,
        coordY: this.coordY,
        color: this.color,
        size: this.size,
        finish: this.finish,
        fell: this.fell
      }
    )
  }

  /**
   * Метод для установик новых свойств
   * @param {Object} param 
   */
  setParam(param) {
    this.coordX = param.coordX;
    this.coordY = param.coordY;
    this.color = param.color;
    this.size = param.size;
    this.finish = false;
  }
}

export default BaseLeaves;