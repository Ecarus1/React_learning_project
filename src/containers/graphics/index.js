import React, { useRef, useLayoutEffect } from "react";
import Canvas from "@src/components/drawing/canvas";
import Controls from "@src/components/drawing/controls";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import { useCallback } from "react";
import layoutPrimitive from "./layout-primitive";
import animationPrimitive from "./animation-primitive";

function Graphics() {
  const store = useStore();
  const canvasRef = useRef(null);
  const mouseClickLogic = useRef(false);
  const lastPosition = useRef({x: 0, y: 0})
  const arrVisible = useRef([]);

  const select = useSelector(state => ({
    items: state.canvas.items,
    zoom: state.canvas.zoom,
    baisX: state.canvas.baisX,
    baisY: state.canvas.baisY
  }))

  useLayoutEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    //Запихиваем в массив только те элементы, которые попадаю в области видимисти конваса с учётом всех значений
    arrVisible.current = select.items.filter(item => {
      if (
        (item.coords.coordX * select.zoom + select.baisX) <= 1124 &&
        (item.coords.coordX * select.zoom + select.baisX) >= -100 &&
        (item.coords.coordY * select.zoom + select.baisY) <= 800 &&
        (item.coords.coordY * select.zoom + select.baisY) >= -100
      ) {
        return item
      }
    })

    //Вызываем функцию старта анимации, где уже и будет происходить отрисовка
    animationPrimitive(
      ctx, 
      canvasRef.current.width,
      canvasRef.current.height,
      arrVisible.current,
      // select.items,
      select.baisX,
      select.baisY,
      select.zoom
    );
  }, [select.items, select.baisX, select.baisY, select.zoom]);

  // Эффект с обработчиками событий
  useLayoutEffect(() => {
    //Прокрутка колёсиком мышки по канвасу
    canvasRef.current.addEventListener('wheel', callbacks.scrollingCanvas);
    //Нажатие левой кнопки мыши
    canvasRef.current.addEventListener('mousedown', callbacks.clickCanvasRetention);
    //Отпускание левой кнопки мышы
    canvasRef.current.addEventListener('mouseup', callbacks.clickCanvasLetting);
    //Действие обработчика отслеживания положения мыши распространяем по всему окну
    window.addEventListener('mousemove', callbacks.moveWindowForCanvas);
    return () => {
      canvasRef.current.removeEventListener('wheel', callbacks.scrollingCanvas);
      canvasRef.current.removeEventListener('mousedown', callbacks.clickCanvasRetention);
      canvasRef.current.removeEventListener('mouseup', callbacks.clickCanvasLetting);
      window.removeEventListener('mousemove', callbacks.moveWindowForCanvas);
    }
  }, [select.zoom, select.baisX, select.baisY]);

  const callbacks = {
    // Функции для создания примитива
    drawRandomPrimitive: useCallback(() => {
      store.get('canvas').createFigure();
    }, []),

    //Функции для удаления всех примитивов
    clearCanvas: useCallback(() => {
      store.get('canvas').clearCanvas();
    }, []),

    scrollingCanvas: (e) => {
      // e.shiftKey возвращает boolean значение, где true - пользователь нажал на Shift, а false - не нажал
      if(!e.shiftKey) {
        store.get('canvas').changeBaisY(e.deltaY > 0 ? 10 : -10);
      } else if(e.shiftKey) {
        let baisX = select.baisX;
        let baisY = select.baisY;
        let deltaZoom = e.deltaY > 0 ? -0.1 : 0.1;
        let posCursorX = e.clientX - canvasRef.current.offsetParent.offsetLeft;
        let posCursorY = e.clientY - canvasRef.current.offsetParent.offsetTop;
        let wx = (posCursorX - select.baisX) / (canvasRef.current.width * select.zoom);
        let wy = (posCursorY - select.baisY) / (canvasRef.current.height * select.zoom);

        baisX -= wx * canvasRef.current.width * deltaZoom;
        baisY -= wy * canvasRef.current.height * deltaZoom;
        store.get('canvas').changeZoom(deltaZoom, baisX, baisY);
      }
    },

    //Функция срабатывет, когда пользователь нажал на канвас
    clickCanvasRetention: (e) => {
      //Ставим статус того, что пользователь удерживает кнопку 
      mouseClickLogic.current = true;
      // Вычисляем последние координаты положения мыши в окне
      lastPosition.current = {
        x: e.clientX,
        y: e.clientY
      }
    },
    
    //Функция срабатывает, когда пользователь отпустил левую кнопку мышы
    clickCanvasLetting: (e) => {
      mouseClickLogic.current = false;
    },

    //Функция срабатывает при перемещении мышки
    moveWindowForCanvas: (e) => {
    //в функции clickCanvasRetention мы писали, что пользователь нажал на кнопку
    //Изменённое значение используем в условии
      if(mouseClickLogic.current) {
        //Вычисляем на сколько сместились по осям X и Y относитедьно новому положению
        let tempX = e.clientX - lastPosition.current.x;
        let tempY = e.clientY - lastPosition.current.y;
        //Вызываем метод store и отправляем данные о вычислении
        store.get('canvas').changeAllBais(tempX, tempY)
        //устанавливаем новое началоное положение мышки, что бы избежать ускорения при перемещении
        lastPosition.current = {
          x: e.clientX,
          y: e.clientY
        }
      }
    }
  }

  return (
    <>
      <Controls drawRandomPrimitive={callbacks.drawRandomPrimitive} clearCanvas={callbacks.clearCanvas}/>
      <Canvas canvasRef={canvasRef} zoom={select.zoom}/>
    </>
  );
}

export default React.memo(Graphics);