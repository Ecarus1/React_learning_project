import React, {useRef, useLayoutEffect, useMemo, useCallback} from "react";
import Controls from "@src/components/drawing/controls";
import Canvas from "@src/components/drawing/canvas";
import CanvasCore from "@src/canvas-core";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import FormFigure from "@src/components/drawing/form-figure";
import Spinner from "@src/components/elements/spinner";
import throttle from "lodash.throttle";

function GraphicsOOP() {
  const canvasRef = useRef();
  const store = useStore();
  // Функция необходима для задержки установки нового состояния
  const changeThrottle = useCallback(throttle((info = {}) => store.get('canvas').changeCurrentItem(info?.type !== 'leave' ? info : {}), 70, {leading: true, trailing: true}), []);
  const select = useSelector(state => ({
    items: state.canvas.items,
    zoom: state.canvas.zoom,
    baisX: state.canvas.baisX,
    baisY: state.canvas.baisY,
    currentItem: state.canvas.currentItem
  }))
  // Получаем экзепляр класса для работы с канвасом
  const core = useMemo(() => new CanvasCore(
    select.zoom,
    select.baisX,
    select.baisY,
    changeThrottle,
    (items) => store.get('canvas').saveItems(items),
    (item = {}) => store.get('canvas').changeCurrentItem(item),
    (zoom, baisX, baisY) => store.get('canvas').changeMetrics(zoom, baisX, baisY),
  ), []);
  
  useLayoutEffect(() => {
    // Запускаем ядро для работы с канвасом
    core.mount(canvasRef.current, select.items);
    return () => {
      core.unmount();
    }
  }, []);

  const callbacks = {
    /**
     * Функция дляустановки новых параметров рисунка
     * param - объект с новыми свойствами
     */
    setParamPrimitive: useCallback((param) => {
      core.acceptNewPropertyForFigure(param)
    }, []),

    // Функции для создания примитива
    drawRandomPrimitive: useCallback(() => {
      core.createFigure();
    }, []),

    //Функции для удаления всех примитивов
    clearCanvas: useCallback(() => {
      store.get('canvas').clearCanvas();
      core.clearItems();
    }, []),
  }

  return(
    <>
      <Spinner active={!(Object.keys(select.currentItem).length > 0)}>
        <FormFigure currentItem={select.currentItem} setParamPrimitive={callbacks.setParamPrimitive}/>
      </Spinner>
      <Controls 
        drawRandomPrimitive={callbacks.drawRandomPrimitive}
        clearCanvas={callbacks.clearCanvas}
        />
      <Canvas canvasRef={canvasRef}/>
    </>
  );
}

export default React.memo(GraphicsOOP)