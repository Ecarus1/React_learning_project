import React, {useCallback, useState} from 'react';
import propTypes from 'prop-types';
import {cn as bem} from "@bem-react/classname";
import {Link} from "react-router-dom";
import numberFormat from "@src/utils/number-format";
import './style.css';

function ItemSelection(props) {
  const [active, setActive] = useState(props.active);
  const cn = bem('Item');

  const callbacks = {
    onAdd: useCallback((e) => setActive(props.onAdd(props.item._id)), [props.onAdd, props.item])
  };

  return (
    <div className={cn({active})} onClick={callbacks.onAdd}>
      <div className={cn('title')}>
        {props.link ? <Link to={props.link}>{props.item.title}</Link> : props.item.title}
      </div>
      <div className={cn('right')}>
        <div className={cn('price')}>{numberFormat(props.item.price)} {props.labelCurr}</div>
        {/* <button onClick={callbacks.onAdd}>{props.labelAdd}</button> */}
      </div>
    </div>
  )
}

ItemSelection.propTypes = {
  item: propTypes.object.isRequired,
  onAdd: propTypes.func,
  link: propTypes.string,
  labelCurr: propTypes.string,
  labelAdd: propTypes.string
}

ItemSelection.defaultProps = {
  onAdd: () => {},
  labelCurr: '₽',
  labelAdd: 'Добавить'
}

export default React.memo(ItemSelection);
