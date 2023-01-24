import React from "react";
import { useState } from "react";
import {cn as bem} from "@bem-react/classname";
import propTypes from "prop-types";

import Arrow from "@src/assets/arrow";

import "./style.css";
import { useEffect, useRef } from "react";

function CustomSelect({onChange, value, options}) {
  const cn = bem('CustomSelect')
  const [display, setDisplay] = useState(false);  //Состояние показа списка
  const [valueCountry, setValueCountry] = useState(''); //Данные с поискового поля
  //Находим из массива объектов объект по value, который выбран пользователем
  const [dataFocus, setDataFocus] = useState(options.find(item => item.value === value) || {title: "Отсутствует в списке"});
  const num = useRef(0);  //Аккумулирующее поле для подчёта, какое поле выбрано, когда список свёрнут
  const dropDown = useRef();  //Ссылка на выпадающий список
  const inputRef = useRef();  //Ссылка на поле input
  const boxRef = useRef();
  let focusId = 0;  //Аккумулирующее поле, для подсчёта фокуса в списке

  //Эффект, когда изменился value (Пользователь нажал на кнопку сбросить и даннные обновились)
  useEffect(() => {
    setDataFocus(options.find(item => item.value === value) || {title: "Отсутствует в списке"})
  }, [value, options])

  useEffect(() => {
    if(display === true && options.length > 0) {
      inputRef.current.focus();
    }
  }, [display])

  useEffect(() => {
    document.addEventListener("mousedown", toggleOutside);
    
    return () => document.removeEventListener("mousedown", toggleOutside);
  }, [])

  //Список действий над блоком с классом CustomSelect_selected
  const selectorControl = (e) => {
    switch (e.key) {
      case "Enter":
        setDisplay(true);
        break;

      case "Escape":
        setDisplay(false);
        break;

      case "Tab":
        setDisplay(false);
        break;

      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        calcFocusIdArrowUp("state");
        onChange(options[num.current].value);
        setDataFocus(options[num.current]);
        break;

      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        calcFocusIdArrowDown("state");
        onChange(options[num.current].value);
        setDataFocus(options[num.current]);
        break;
    }
  }

  //Проверяем на вхождение введённых данных в поле input (Если есть совпадение - возвращаем true)
  //Переводим всё в нижний регистр для удобной валидации
  const searchOption = (str) => {
    if(str.toLowerCase().match(`${valueCountry.toLowerCase()}`)) {
      return true
    }
  }

  //Метод для проверки на кликнутую область
  const toggleOutside = (e) => {
    if(!boxRef.current.contains(e.target)) {
      setDisplay(false);
      setValueCountry('');
    }
  }

  //Метод события клика на опцию
  //item хранит в себе весь объект
  const handleOptionClick = (item) => {
    //item.value - ключ 
    onChange(item.value);
    setDisplay(false);
    setDataFocus(item);
  };

  //Спикос действий над элементами выпадающего списка (Не input)
  const controlEvent = (e, i) => {
    //При каждом вызове определяем, какой элемент зафокушен
    focusId = Array.prototype.indexOf.call(dropDown.current.childNodes, document.activeElement)
    switch (e.key) {
      case "Enter":
        //Отправляем в метод handleOptionClick выбранный объект по ID
        handleOptionClick(options[dropDown.current.childNodes[focusId].id]);
        setValueCountry('');
        break;

      case "Escape":
        handleOptionClick(options[dropDown.current.childNodes[focusId].id]);
        setValueCountry('');
        break;

      case "ArrowUp":
        e.preventDefault();
        calcFocusIdArrowUp();
        dropDown.current.childNodes[focusId].focus();
        //Меняем состояние поля каждый раз при новом фокусе
        setDataFocus(options[dropDown.current.childNodes[focusId].id]);
        break;

      case "ArrowDown":
        e.preventDefault();
        calcFocusIdArrowDown();
        dropDown.current.childNodes[focusId].focus();
        setDataFocus(options[dropDown.current.childNodes[focusId].id]);
        break;
    }
  }

  //Метод для подсчёта id (Если в help что то есть, то исполняем второе условие, при свёрнутом списке)
  const calcFocusIdArrowUp = (help = null) => {
    if(!help && focusId > 0) {
      focusId--;
      return;
    }
    if(help && num.current > 0) {
      num.current -= 1;
    }
  }
  //Метод для подсчёта id 
  const calcFocusIdArrowDown = (help = null) => {
    if(!help && focusId < dropDown.current.childNodes.length - 1) {
      focusId++;
      return;
    }
    if(help && num.current < options.length - 1) {
      num.current += 1;
    }
  }

  return(
    <div className={cn()} ref={boxRef}>
      <div className={cn('selected')} tabIndex="0" onClick={() => setDisplay(!display)} onKeyDown={selectorControl}>
        {dataFocus.code && <div className={cn('code')}>{dataFocus.code}</div>}
        <span className={cn('text')}>{dataFocus.title}</span>
        <div className={cn('arrow')}><Arrow/></div>
      </div>

      <div className={cn('box', {active: display})}>
        <input className={cn('input')} type="text" placeholder="Поиск" ref={inputRef} value={valueCountry} onChange={e => setValueCountry(e.target.value)}/>
        <ul className={cn('list')} ref={dropDown}>
          {
            options.map((item, i) => {
              if(searchOption(item.title)) {
                return (
                  <li 
                    className={cn('option', {active: item.value === value})} 
                    tabIndex="0" 
                    onKeyDown={(e) => controlEvent(e, i)} 
                    key={i}
                    id={i} 
                    onClick={() => handleOptionClick(item)}>
                    {item.code && <div className={cn('code-option')}>{item.code}</div>}
                    <span className={cn('text')}>{item.title}</span>
                  </li>
                )
              }
            }
            )
          }
        </ul>
      </div>
    </div>
  )
}

CustomSelect.propTypes = {
  //Это функция, которая может принимать только одно значение (Ключ)
  onChange: propTypes.func.isRequired,
  //Ключ
  value: propTypes.any,
  //Список всех опций
  options: propTypes.array
}

export default React.memo(CustomSelect)