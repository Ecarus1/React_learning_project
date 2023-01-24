import BaseFigure from "../base-figure";

class Square extends BaseFigure {
  /**
   * Метод для нахождения области взаимодействия
   * @param {Object} metrics 
   * @returns Условие
   */
  findArea(metrics = null) {
    return [
      this.coordX + this.size,
      this.coordY + this.size
    ];
  }

  /**
   * Метод для проверки нажатой области
   * @param {int} posClickX 
   * @param {int} posClickY 
   * @param {Object} metrics 
   * @returns boolean
   */
  checkClikcInArea(posClickX, posClickY, metrics) {
    if(
        posClickX >= this.coordX &&
        posClickX <= this.area[0] &&
        posClickY >= this.coordY &&
        posClickY <= this.area[1]
      ) 
    {
      return true
    } else {
      return false 
    }
  }

  draw(ctx, metrics) {
    ctx.fillStyle = this.color;
    ctx.lineWidth = 5 * metrics.zoom;
    ctx.beginPath();
    ctx.rect(
      this.coordX * metrics.zoom + metrics.baisX, 
      this.coordY * metrics.zoom + metrics.baisY, 
      this.size * metrics.zoom, 
      this.size * metrics.zoom
    );
    ctx.fill();
    this.clicked ? ctx.stroke() : null;
  }
}

export default Square