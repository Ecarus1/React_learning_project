import React, {useCallback, useMemo} from "react";
import {useStore as useStoreRedux, useSelector as useSelectorRedux} from 'react-redux';
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import Menu from "@src/components/navigation/menu";
import BasketSimple from "@src/components/catalog/basket-simple";
import LayoutFlex from "@src/components/layouts/layout-flex";
import actionsModals from '@src/store-redux/modals/actions';

function ToolsContainer({clone}) {

  const store = useStore();
  // const storeRedux = useStoreRedux();

  const select = useSelector(state => ({
    amount: state.basket.amount,
    sum: state.basket.sum,
    lang: state.locale.lang
  }));

  const {t} = useTranslate();

  const callbacks = {
    // Открытие корзины
    openModalBasket: useCallback(() => {
      store.get('modals').open('basket');
      // storeRedux.dispatch(actionsModals.open('basket'));
    }, []),
  };

  const options = {
    menu: useMemo(() => ([
      {key: 1, title: t('menu.main'), link: '/'},
      {key: 2, title: 'Чат', link: '/chat'},
      {key: 3, title: 'Графика', link: '/canvas'},
    ]), [t]),
  }

  return (
    <LayoutFlex flex="between" indent="big">
      {clone ? <div></div> : <Menu items={options.menu}/>}
      <BasketSimple onOpen={callbacks.openModalBasket} amount={select.amount} sum={select.sum}
                    t={t}/>
    </LayoutFlex>
  );
}

export default React.memo(ToolsContainer);
