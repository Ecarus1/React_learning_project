import React from "react";
import {cn as bem} from "@bem-react/classname";
import moment from "moment";
import "moment/locale/ru";
import propTypes from "prop-types";

import "./style.css"

function Message({item, userId}) {
  const cn = bem('Message');

  return(
    <div className={cn({rigth: item.author._id === userId})}>
      <div className={cn('box')}>
        <span className={cn('name')}>{item.author.profile.name}</span>
        {/* <span>{item.dateCreate}</span> */}
        <span className={cn('time')}>{moment(item.dateCreate, moment.ISO_8601).locale('ru').format("DD MMMM YYYY [в] HH:mm")}</span>
      </div>

      <p className={cn('text')}>{item.text}</p>
      <span className={cn('status')}>{item.submiting ? 'Доставляется' : 'Отправлено'}</span>
    </div>
  );
}

Message.propTypes = {
  item: propTypes.object.isRequired,
  userId: propTypes.string.isRequired
}

export default React.memo(Message);