import React, {useState, useEffect, useCallback} from "react";
import {SketchPicker} from "react-color";
import {cn as bem} from "@bem-react/classname";
import propTypes from "prop-types";

import "./style.css";

function FormFigure({currentItem, setParamPrimitive}) {
  const [item, setItem] = useState({
    coordX: currentItem.coordX,
    coordY: currentItem.coordY,
    color: currentItem.color,
    size: currentItem.size
  });
  const cn = bem('FormFigure');

  useEffect(() => {
    setItem({
      coordX: currentItem.coordX,
      coordY: currentItem.coordY,
      color: currentItem.color,
      size: currentItem.size
    });
  }, [currentItem])

  const callbacks = {
    onChangeCoordX: useCallback((value) => {
      setItem({
        ...item,
        coordX: value
      });
    }, [item]),

    onChangeCoordY: useCallback((value) => {
      setItem({
        ...item,
        coordY: value
      });
    }, [item]),

    onChangeSize: useCallback((value) => {
      setItem({
        ...item,
        size: value
      });
    }, [item]),

    validator: useCallback(() => {
      if(item.size >= 20 && item.size <= 100) {
        setParamPrimitive(item)
      } else {
        alert('Диапазон размера фигуры 20-100');
      }
    }, [item]),

    onChangeColor: useCallback((value) => {
      setItem({
        ...item,
        color: value.hex
      });
    }, [item])
  }

  return(
    <div className={cn()}>
      <div>
        <div className={cn('box')}>
          <span>X</span> <input className={cn('input')} type="number" value={item.coordX} onChange={(e) => callbacks.onChangeCoordX(Number(e.target.value))}/>
        </div>
        <div className={cn('box')}>
          <span>Y</span> <input className={cn('input')} type="number" value={item.coordY} onChange={(e) => callbacks.onChangeCoordY(Number(e.target.value))}/>
        </div>
        <div className={cn('box')}>
          <span>S</span> <input className={cn('input')} type="number" min="20" max="100" value={item.size} onChange={(e) => callbacks.onChangeSize(Number(e.target.value))}/>
        </div>
        <div className={cn('box')}>
          <button onClick={() => callbacks.validator()} disabled={!currentItem.finish || currentItem.fell}>Отправить</button>
        </div>
      </div>
      <SketchPicker color={item.color} onChangeComplete={callbacks.onChangeColor}/>
    </div>
  );
}

FormFigure.propTypes = {
  currentItem: propTypes.object,
  setParamPrimitive: propTypes.func,
}

FormFigure.defaultProps = {
  currentItem: {},
  setParamPrimitive: () => {},
}

export default React.memo(FormFigure);