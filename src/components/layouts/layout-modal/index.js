import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {cn as bem} from "@bem-react/classname";
import './style.less';

function LayoutModal(props) {
  const cn = bem('LayoutModal');

  const frame = useRef();

  useEffect(() => {
    let top = 10;
    if (window.innerWidth > frame.current.clientHeight) {
      top = Math.max(top, (window.innerHeight - frame.current.clientHeight) / 2 - top);
    }
    frame.current.style.marginTop = `${top}px`;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    }
  });

  return (
    <div className={cn()}>
      <div className={cn('frame')} ref={frame}>
        <div className={cn('head')}>
          <h1 className={cn('title')}>
            {props.title}
          </h1>
          <div className={cn('box')}>
            {props.onOpenCatalog ? <button className={cn('close')} onClick={props.onOpenCatalog}>Открыть список</button> : null}
            <button className={cn('close')} onClick={props.onClose}>{props.labelClose}</button>
          </div>
        </div>
        <div className={cn('content')}>
          {props.children}
        </div>
      </div>
    </div>
  );
}

LayoutModal.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.node,
  labelClose: PropTypes.string,
  onOpenCatalog: PropTypes.func
};

LayoutModal.defaultProps = {
  title: 'Модалка',
  labelClose: 'Закрыть',
  onClose: () => {},
  onOpenCatalog: null
};

export default React.memo(LayoutModal);
