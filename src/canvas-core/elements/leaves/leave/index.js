import BaseLeaves from "../base-leaves";

class Leave extends BaseLeaves {
  /**
   * Метод для нахождения области взаимодействия
   * @param {Object} metrics 
   * @returns Условие
   */
  findArea(metrics = null) {
    return Math.pow(this.size / 2, 2);
  }

  /**
   * Метод для проверки нажатой области
   * @param {int} posClickX 
   * @param {int} posClickY 
   * @param {Object} metrics 
   * @returns boolean
   */
  checkClikcInArea(posClickX, posClickY, ctx) {
    if (Math.pow(posClickX - (this.coordX + this.size / 2), 2) + Math.pow(posClickY - (this.coordY + this.size / 2), 2) < this.area) {
      return true
    } else {
      return false
    }
  }

  draw(ctx, metrics) {
    // const d = new Image();
    // d.src = 'https://i.pinimg.com/236x/d7/b3/cf/d7b3cfe04c2dc44400547ea6ef94ba35.jpg';
    ctx.save();
    ctx.translate(this.coordX * metrics.zoom + metrics.baisX + this.size * metrics.zoom / 2, this.coordY * metrics.zoom + metrics.baisY + this.size * metrics.zoom / 2);
    ctx.rotate(this.angle * Math.PI / 180);
    ctx.translate(-(this.coordX * metrics.zoom + metrics.baisX + this.size * metrics.zoom / 2), -(this.coordY * metrics.zoom + metrics.baisY + this.size * metrics.zoom / 2));
    ctx.globalAlpha = this.opacity;
    ctx.drawImage(
      this.image,
      this.coordX * metrics.zoom + metrics.baisX,
      this.coordY * metrics.zoom + metrics.baisY,
      this.size * metrics.zoom,
      this.size * metrics.zoom);
    ctx.restore();
  }
}

export default Leave;