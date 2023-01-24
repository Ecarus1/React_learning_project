import React from "react";
import {cn as bem} from "@bem-react/classname";
import propTypes from "prop-types";

import "./style.css";

function Messages({messages, renderMessage, chatBoxRef}) {
  const cn = bem('Messages')
  return(
    <div className={cn()} ref={chatBoxRef}>
      {messages.map(item => renderMessage(item))}
    </div>
  );
}

Messages.propTypes = {
  messages: propTypes.array,
  renderMessage: propTypes.func,
}

export default React.memo(Messages);

