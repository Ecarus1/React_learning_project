// Список фугур, доступных для отрисовки. 
// Чтобы добавить новую, нужно в store Canvas в методе CreateTypeFigure изменить диапазон выпадения случайного числа.
// И в Switch Case добавить новую возвращаемую строку и использовать название фигуры в качесте вызова функции
const figures = {
  //отрисовка квадрата
  rectangle: (ctx, color, coordX, coordY, baisX, baisY, size, zoom) => {
    ctx.fillStyle = color;
    ctx.fillRect(
      (coordX * zoom + baisX), 
      (coordY * zoom + baisY), 
      size * zoom, 
      size * zoom);
  },
  
  //Отрисовка круга
  circle: (ctx, color, coordX, coordY, baisX, baisY, size, zoom) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(
      (coordX * zoom + baisX), 
      (coordY * zoom + baisY), 
      size * zoom, 0, 2 * Math.PI);
    ctx.fill();
  }
}

/**
 * Функция для отрисовки примитивов
 * @param ctx - контекст канваса
 * @param canvasWidth  - ширина канваса
 * @param canvasHeight  - высота канваса
 * @param items - массив с примитивами
 * @param baisX - смещение пикселей по оси X
 * @param baisY - смещение пикселей по оси Y
 * @param zoom - коэффициент зумиривоан канваса
 */
export default function layoutPrimitive(ctx, canvasWidth, canvasHeight, items, baisX, baisY, zoom) {
  // Очищаем канвас без отступа по ширине и высоте канваса
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.save();
  items.forEach(element => {
    figures[element.type](ctx, element.color, element.coords.coordX, element.coords.coordY, baisX, baisY, element.size, zoom);
  });
  ctx.restore();
}

