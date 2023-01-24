import randomInt from "@src/utils/random-int";
import { v4 as uuidv4 } from 'uuid';

class BaseFigure {
  constructor(
    metrics, type, coordX = null, coordY = null, time = null, size = null, color = null, finish = null, key=null, clicked
  ) {
    this.type = type;
    this.coordX = coordX ? coordX : (randomInt(0, 1024) - metrics.baisX) / metrics.zoom;
    this.coordY = coordY ? coordY : (randomInt(0, 500) - metrics.baisY) / metrics.zoom;
    this.time = time ? time : new Date().getTime();
    this.size = size ? size : randomInt(20, 100);
    this.color = color ? color : `rgb(${randomInt(0, 255) + "," + randomInt(0, 255) + "," + randomInt(0, 255)})`;
    this.finish = finish ? finish : false;
    this.key = key ? key : uuidv4();
    this.area = this.findArea(metrics);
    this.fell = false;
    this.clicked = clicked ? clicked : false;
  }

  findArea(metrics = null) {

  }

  /**
   * Метод для расчёта, до куда долетит примитив
   * @param {Object} metrics 
   * @param {*} startTime 
   */
  animate(metrics, startTime) {
    let newCoordY = this.coordY + Math.pow((startTime - this.time) / 1000, 2) * 10 / 2;
    if(newCoordY * metrics.zoom + metrics.baisY <= 700 - this.size * metrics.zoom && !this.finish) {
      this.coordY = newCoordY;
    } else {
      this.coordY = (700 - metrics.baisY - this.size * metrics.zoom) / metrics.zoom
      this.finish = true;
    }
    this.area = this.findArea(metrics);
  }

  /**
   * Метод для проверки видимости примитива
   * @param {Object} metrics 
   * @returns 
   */
  isIntersection(metrics) {
    if(
      (this.coordX * metrics.zoom + metrics.baisX) <= 1124 &&
      (this.coordX * metrics.zoom + metrics.baisX) >= -100 &&
      (this.coordY * metrics.zoom + metrics.baisY) <= 800 &&
      (this.coordY * metrics.zoom + metrics.baisY) >= -100
    ) {
      return true
    } else {
      this.finish = true;
    }
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
    this.time = new Date().getTime();
  }
}

export default BaseFigure;