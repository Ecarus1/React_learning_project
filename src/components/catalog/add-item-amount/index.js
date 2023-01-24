import React from "react";
import {cn as bem} from "@bem-react/classname"
import PropTypes from 'prop-types';

import "./style.css";

function AddItemAmount({readiness, setReadiness, countItem, setCountItem}) {
  const cn = bem('AddItemAmount');

  // Функция валидатор
  const changeCountItem = (value) => {
    if(value) {
      let newStr = value.replace("^[1-9]+(?:\d{0,2})?$", "")
      setCountItem(Number(newStr));
      setReadiness(null)
    }
  }

  return(
    <div className={cn()}>
      <input 
        type="number" 
        className={cn('input')} 
        min="1" 
        value={countItem} 
        onChange={(e) => changeCountItem(e.target.value)}/>
        
      <div className={cn('box')}>
        <button 
          className={cn('btn', {ok: readiness})} 
          onClick={() => setReadiness(true)} 
          disabled={countItem <= 0 && true}>
            Ок
        </button>

        <button 
          className={cn('btn', {cancel: !readiness && readiness !== null})} 
          onClick={() => setReadiness(false)}
          disabled={countItem <= 0 && true}>
            Отмена
        </button>
      </div>
      <p>{readiness ? `Вы выбрали данный товар в колличестве ${countItem} шт` : "Нажмите 'Ок', если вы определились с колличеством"}</p>
    </div>
  );
}

AddItemAmount.propTypes = {
  readiness: PropTypes.bool,
  setReadiness: PropTypes.func,
  countItem: PropTypes.number,
  setCountItem: PropTypes.func
}

export default React.memo(AddItemAmount)