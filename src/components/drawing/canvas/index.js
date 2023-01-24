import React from "react";
import {cn as bem} from "@bem-react/classname";
import propTypes from "prop-types";

import './style.css';

function Canvas({canvasRef}) {
  const cn = bem('Canvas');
  return(
    <div className={cn()}>
      <canvas width="1024px" height="700px" className={cn('some')} ref={canvasRef}></canvas>
    </div>
  );
}
Canvas.propTypes = {
  canvasRef: propTypes.oneOfType([
    propTypes.func, 
    propTypes.shape({ current: propTypes.any })
])
}

export default React.memo(Canvas);