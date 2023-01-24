import React, {useState, useCallback} from "react";
import {cn as bem} from "@bem-react/classname";
import propTypes from "prop-types";

import "./style.css";

function AddMessageForm({submitMessage}) {
  const cn = bem('MessageForm');
  const [message, setMessage] = useState('');

  // Функция отправки с небольшой валидацией
  const submit = useCallback(() => {
    let text = message.trim();
    if(text.length >= 1) {
      submitMessage(text);
      setMessage('');
    } else {
      alert('Не правильный формат сообщения')
    }
  }, [message]);

  /**
   * Если пользователь нажал на Enter - вызываем функцию 
   * @param e - объект события 
   */
  const selectorControl = (e) => {
    if(e.key === 'Enter') {
      submit();
      e.preventDefault();
    }
  }

  return(
    <div className={cn()}>
      <textarea className={cn('textarea')} value={message} onChange={e => setMessage(e.target.value)} onKeyDown={selectorControl}></textarea>
      <button className={cn('btn')} onClick={() => submit()}>Отправить</button>
    </div>
  );
}

AddMessageForm.propTypes = {
  submitMessage: propTypes.func.isRequired
}
export default React.memo(AddMessageForm)