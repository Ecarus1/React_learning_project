import layoutPrimitive from "../layout-primitive";

/**
 * Функция, предназначеная для реализации свободного падения (Объекты могут падать до предельной точки '600px' по оси Y)
 * @param ctx - контекст канваса
 * @param canvasWidth  - ширина канваса
 * @param canvasHeight  - высота канваса
 * @param items - массив с примитивами
 * @param baisX - смещение пикселей по оси X
 * @param baisY - смещение пикселей по оси Y
 * @param zoom - коэффициент зумиривоан канваса
 */
export default function animationPrimitive(ctx, canvasWidth, canvasHeight, items, baisX, baisY, zoom) {
  //Запускаем самую первую отрисовку
  layoutPrimitive(ctx, canvasWidth, canvasHeight, items, baisX, baisY, zoom);

  //Вызываем requestAnimationFrame и тем самым запускаем наш цикл анимации
  window.requestAnimationFrame(function init() {
    // пробегаемся по массиву элементов и редактируем их координаты
    items.forEach((item, i) => {
      //С учётом всех величин (Разность координат начала и смещения и суммы произведения зумирования на отступ)
      //Проверяем, что кость фигуры (точка начала) не должна превышать 700px - size примитива
      if(item.coords.coordY * zoom + baisY <= 700 - item.size * zoom && !item.finish){
        item.coords.coordY = item.coords.coordY + Math.pow((new Date().getTime() - item.time) / 1000, 2) * 10 / 2;
      } else {
        item.finish = true;
      }
    })

    //Заного отрисовываем весь канвас с учётом новой позиции
    layoutPrimitive(ctx, canvasWidth, canvasHeight, items, baisX, baisY, zoom);
    //Если хотя бы один елемент не закончил движение вниз до предельной точки в 600px
    if(items.some(item => !item.finish)) {
      //Заного вызываем init
      requestAnimationFrame(init);
    }
  })
}