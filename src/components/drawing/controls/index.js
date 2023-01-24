import React from "react";
import {cn as bem} from "@bem-react/classname";
import propTypes from "prop-types";

import "./style.css";

function Controls({drawRandomPrimitive, clearCanvas}) {
  const cn = bem('CanvasControls');
  return(
    <div className={cn()}>
      <button className={cn('btn')} onClick={() => drawRandomPrimitive()}>Нарисовать</button>
      <button className={cn('btn')} onClick={() => clearCanvas()}>Очистить</button>
    </div>
  );
}

Controls.propTypes = {
  drawRandomPrimitive: propTypes.func.isRequired,
  clearCanvas: propTypes.func.isRequired
}

Controls.defaultProps = {
  drawRandomPrimitive: () => {},
  clearCanvas: () => {}
}

export default React.memo(Controls);