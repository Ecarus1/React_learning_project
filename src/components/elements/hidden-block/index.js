import React from "react";

function HiddenBlock({loader}) {
  const style = {
    "height": "130px",
    "width": "100%",
    "marginTop": "60px"
  }

  return(
    <div style={style} ref={loader}></div>
  );
}

export default React.memo(HiddenBlock);
