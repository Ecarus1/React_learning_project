import BaseFigure from "../base-figure";

class Circle extends BaseFigure {
  /**
   * Метод для нахождения области взаимодействия
   * @param {Object} metrics 
   * @returns Условие
   */
  findArea(metrics = null) {
    return Math.pow(this.size, 2);
  }

  /**
   * Метод для проверки нажатой области
   * @param {int} posClickX 
   * @param {int} posClickY 
   * @param {Object} metrics 
   * @returns boolean
   */
  checkClikcInArea(posClickX, posClickY, ctx) {
    if(Math.pow(posClickX - this.coordX, 2) + Math.pow(posClickY - this.coordY, 2) < this.area) {
      return true
    } else {
      return false
    }
  }

  draw(ctx, metrics) {
    ctx.fillStyle = this.color;
    ctx.lineWidth = 5 * metrics.zoom;
    ctx.beginPath();
    ctx.arc(
      (this.coordX * metrics.zoom + metrics.baisX), 
      (this.coordY * metrics.zoom + metrics.baisY), 
      this.size * metrics.zoom, 0, 2 * Math.PI);
    ctx.fill();
    this.clicked ? ctx.stroke() : null;
  }
}

export default Circle