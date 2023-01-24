import Square from "./elements/square";
import Circle from "./elements/circle";
import randomInt from "@src/utils/random-int";
import Leave from "./elements/leaves/leave";
import * as leaves from "@src/assets/leaves/exports"

class CanvasCore {
  constructor(zoom, baisX, baisY, changeThrottle, saveItems, changeCurrentItem, changeMetrics) {
    this.elements = [];
    this.metrics = {
      zoom: zoom,
      baisX: baisX,
      baisY: baisY
    };
    this.lastPosition = {
      x: 0,
      y: 0
    };
    this.mouseClickLogic = false;
    this.draging = false;
    this.changeThrottle = changeThrottle;
    this.saveItems = saveItems;
    this.changeCurrentItem = changeCurrentItem;
    this.changeMetrics = changeMetrics;
    this.leavesObj = [];
    this.intervaId;
  }

  /**
   * Метод возвращает все примитивы обратно на конву при первом рендере
   */
  firstStart(items) {
    this.elements = items.map(item => {
      if (item.type === 'square')
        return (new Square(this.metrics, item.type, item.coordX, item.coordY, item.time, item.size, item.color, item.finish));
      if (item.type === 'circle')
        return (new Circle(this.metrics, item.type, item.coordX, item.coordY, item.time, item.size, item.color, item.finish));
    });
    console.log(new Date().getTime())
  }

  /**
   * Метод генерации типа фигуры
   * @returns String
   */
  createTypeFigure() {
    //Генерируем случайное число 
    const typeNum = randomInt(0, 1);
    switch (typeNum) {
      case 0:
        return 'square'

      case 1:
        return 'circle'
    }
  }

  /**
   * Метод создания нового примитива
   */
  createFigure() {
    // запускаем генератор типа примитива
    // this.elements.push(new Leave(this.metrics, 'leave', this.leavesObj[randomInt(0, this.leavesObj.length - 1)]))
    const typeFigure = this.createTypeFigure();
    switch (typeFigure) {
      case 'square':
        this.elements.push(new Square(this.metrics, 'square'))
        break;

      case 'circle':
        this.elements.push(new Circle(this.metrics, 'circle'))
        break;
    }
  }

  cycleSpawnForLeaves() {
    let counter = 0
    this.intervaId = setInterval(() => {
      if (counter <= 40) {
        this.elements.unshift(new Leave(this.metrics, 'leave', this.leavesObj[randomInt(0, this.leavesObj.length - 1)]))
        counter++;
      } else {
        clearInterval(this.intervaId);
      }
    }, 300)
  }

  createLeaves() {
    let counter = 1;
    const lengthArrImages = Object.keys(leaves).length;
    for (let i = 0; i < lengthArrImages; i++) {
      this.leavesObj[i] = new Image();
      this.leavesObj[i].src = leaves['leave' + i];
      this.leavesObj[i].onload = () => {
        counter++;
        if (lengthArrImages === counter) {
          this.draw();
          this.cycleSpawnForLeaves();
        }
      }
    }
  }

  /**
   * Метод вызывается при монтировании компоненнта. Запускаем основные функции и слушатели
   * @param {node} canvasRef 
   */
  mount(canvasRef, items) {
    this.canvas = canvasRef;
    this.ctx = this.canvas.getContext('2d');
    //Прокрутка колёсиком мышки по канвасу
    this.canvas.addEventListener('wheel', this.scrollingCanvas);
    //Нажатие левой кнопки мыши
    this.canvas.addEventListener('mousedown', this.clickCanvasRetention);
    //Отпускание левой кнопки мышы
    this.canvas.addEventListener('mouseup', this.clickCanvasLetting);
    //Действие обработчика отслеживания положения мыши распространяем по всему окну
    window.addEventListener('mousemove', this.moveWindowForCanvas);
    window.addEventListener('mouseup', this.clickUpWindowForCanvas);
    this.canvas.addEventListener('mousedown', this.findFigures);
    this.firstStart(items);
    this.createLeaves();
  }

  /**
   * Метод вызывается при размантировании компонента. Происходит отписка от всех слушателей
   */
  unmount() {
    this.saveItems(
      this.elements.filter(item => {
        if (item.type !== 'leave')
          return ({
            type: item.type,
            coordX: item.coordX,
            coordY: item.coordY,
            time: item.time,
            size: item.size,
            color: item.color,
            finish: item.finish
          })
      })
    );
    this.chooseFigure = undefined;
    clearInterval(this.intervaId);
    this.changeCurrentItem();
    this.changeMetrics(
      this.metrics.zoom,
      this.metrics.baisX,
      this.metrics.baisY
    )
    this.canvas.removeEventListener('wheel', this.scrollingCanvas);
    this.canvas.removeEventListener('mousedown', this.clickCanvasRetention);
    this.canvas.removeEventListener('mouseup', this.clickCanvasLetting);
    window.removeEventListener('mousemove', this.moveWindowForCanvas);
    window.removeEventListener('mouseup', this.clickUpWindowForCanvas);
    this.canvas.removeEventListener('mousedown', this.findFigures);
  }

  /**
   * Метод вызывается при скролле.
   * При не зажатом shift смешаем примитивы по Y
   * С зажатым shift происходит смещение по X и Y, а так же zoom по положению курсора
   * @param {Event} e 
   */
  scrollingCanvas = (e) => {
    e.preventDefault();
    // e.shiftKey возвращает boolean значение, где true - пользователь нажал на Shift, а false - не нажал
    if (!e.shiftKey) {
      this.metrics.baisY += e.deltaY > 0 ? -10 : 10;

    } else if (e.shiftKey) {
      const deltaZoom = e.deltaY > 0 ? -0.1 : 0.1;
      //Вычисляем позицию мышки на конвасе
      const posCursorX = e.pageX - this.canvas.offsetParent.offsetLeft;
      const posCursorY = e.pageY - this.canvas.offsetParent.offsetTop;
      //Вычисляем вес каждого пикселя
      const wx = (posCursorX - this.metrics.baisX) / (this.metrics.zoom);
      const wy = (posCursorY - this.metrics.baisY) / (this.metrics.zoom);
      const newZoom = this.metrics.zoom + deltaZoom
      if (newZoom >= 0.2 && newZoom <= 5) {
        this.metrics.baisX -= wx * deltaZoom;
        this.metrics.baisY -= wy * deltaZoom;
        this.metrics.zoom = newZoom;
      }
    }
  }

  /**
   * Метод для обработки зажатия кнопки мышы
   * @param {Event} e 
   */
  clickCanvasRetention = (e) => {
    //Ставим статус того, что пользователь удерживает кнопку 
    this.mouseClickLogic = true;
    // Вычисляем последние координаты положения мыши в окне
    this.lastPosition = {
      x: e.pageX,
      y: e.pageY
    }
  }

  /**
   * Метод для обработки отпускания кнопки мышы
   * @param {Event} e 
   */
  clickCanvasLetting = (e) => {
    this.mouseClickLogic = false;
  }

  /**
   * Метод срабатывает при перемещении мышки
   * @param {Event} e 
   */
  moveWindowForCanvas = (e) => {
    //в функции clickCanvasRetention мы писали, что пользователь нажал на кнопку
    //Изменённое значение используем в условии
    if (this.mouseClickLogic) {
      //Вычисляем на сколько сместились по осям X и Y относитедьно новому положению
      let tempX = e.pageX - this.lastPosition.x;
      let tempY = e.pageY - this.lastPosition.y;
      // Если происходит перемещение фигуры
      if (this.draging) {
        this.chooseFigure.coordX += tempX / this.metrics.zoom;
        this.chooseFigure.coordY += tempY / this.metrics.zoom;
        // при перемещении фигуры нужно заного установить его область
        this.chooseFigure.area = this.chooseFigure.findArea(this.metrics);
        this.changeThrottle(this.chooseFigure.getParam());
      } else {
        // Иначе меняем базовые отступы
        this.metrics.baisX += tempX;
        this.metrics.baisY += tempY;
      }
      //устанавливаем новое началоное положение мышки, что бы избежать ускорения при перемещении
      this.lastPosition = {
        x: e.pageX,
        y: e.pageY
      }
    }
  }

  /**
   * Метод обрабатывет событие отпускания мышки на всей странице
   * @param {Event} e 
   */
  clickUpWindowForCanvas = (e) => {
    this.mouseClickLogic = false;
    // Если выбранная фигура не undefined и флаг падения true
    if (typeof this.chooseFigure !== 'undefined' && this.chooseFigure.fell == true) {
      this.chooseFigure.finish = false;
      this.chooseFigure.time = new Date().getTime();
      this.chooseFigure.fell = false;
      this.draging = false;
    }
  }

  /**
   * Метод нахождения фигуры по положению мышки
   * @param {Event} e 
   */
  findFigures = (e) => {
    const posCursorX = ((e.pageX - this.canvas.offsetParent.offsetLeft) - this.metrics.baisX) / this.metrics.zoom;
    const posCursorY = ((e.pageY - this.canvas.offsetParent.offsetTop) - this.metrics.baisY) / this.metrics.zoom;
    this.draging = this.getFigureInClickArea(posCursorX, posCursorY);
  }

  /**
   * Метод по полученным координатам ищет фигуру
   * @param {int} posClickX 
   * @param {int} posClickY 
   * @returns 
   */
  getFigureInClickArea(posClickX, posClickY) {
    let inClick;
    // Пробегаемся по массиву и проверяем каждый элемент (Есть ли в этой зоне примитив)
    this.elements.forEach(element => {
      if (element.checkClikcInArea(posClickX, posClickY, this.metrics, this.ctx)) {
        inClick = element;
      }
      element.clicked = false;
    });
    // Если полученный примитив не undefined
    if (typeof inClick !== 'undefined') {
      this.chooseFigure = inClick;
      this.chooseFigure.clicked = true;
      this.chooseFigure.finish = true;
      this.chooseFigure.fell = true;
      this.chooseFigure.opacity = 1;
      // Устанавливаем параметры выбранного примитива в Store
      this.changeThrottle(this.chooseFigure.getParam());
      return true;
    } else {
      //Иначе очищаем
      this.changeThrottle();
      return false;
    }
  }

  /**
   * Метод вызывается при принятии новых свойств (В данном случае вызывается при кнопке отправить)
   * @param {object} param 
   */
  acceptNewPropertyForFigure(param) {
    this.chooseFigure.setParam(param);
    this.chooseFigure.area = this.chooseFigure.findArea(this.metrics);
  }

  /**
   * Метод для сбрасывания всех примитивов и метрики
   */
  clearItems() {
    this.elements = this.elements.filter(item => item.type === 'leave')
      this.metrics = {
        zoom: 1,
        baisX: 0,
        baisY: 0
      }
    this.changeThrottle();
  }

  /**
   * Метод для отрисовки примитивов (Вызывается рекурсивно)
   */
  draw = () => {
    //Очищаем полотно
    this.ctx.clearRect(0, 0, 1024, 700);
    this.ctx.save()
    this.ctx.font = '16px serif';
    this.ctx.textAlign = "right"
    this.ctx.fillText(`x${this.metrics.zoom.toFixed(2)}`, 1014, 20);
    //Устанавливаем время в мс
    const startTime = new Date().getTime();

    this.elements.forEach(element => {
      // Если примитив попадает в область видимости
      if (element.isIntersection(this.metrics)) {
        //Если примитив ещё не закночил движении до земли
        if (!element.finish) {
          element.animate(this.metrics, startTime);
          if (typeof this.chooseFigure !== 'undefined' && element.clicked) {
            //Обновление параметров(Нужно для формы)
            this.changeThrottle(this.chooseFigure.getParam());
          }
        }
        element.draw(this.ctx, this.metrics);
      }
    });
    this.ctx.restore();
    requestAnimationFrame(this.draw)
  }
}

export default CanvasCore