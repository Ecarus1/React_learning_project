import React, {useCallback} from "react";
import {useStore as useStoreRedux} from "react-redux";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import BasketTotal from "@src/components/catalog/basket-total";
import LayoutModal from "@src/components/layouts/layout-modal";
import ItemBasket from "@src/components/catalog/item-basket";
import List from "@src/components/elements/list";
import actionsModals from "@src/store-redux/modals/actions";

function Basket() {
  const store = useStore();
  // const storeRedux = useStoreRedux();

  const select = useSelector(state => ({
    items: state.basket.items,
    amount: state.basket.amount,
    sum: state.basket.sum
  }));

  const {t} = useTranslate();

  const callbacks = {
    // Закрытие любой модалки
    closeModal: useCallback(() => {
      store.get('modals').close()
      // storeRedux.dispatch(actionsModals.close());
    }, []),
    // Удаление из корзины
    removeFromBasket: useCallback(_id => store.get('basket').removeFromBasket(_id), []),
    // Открытие модалки каталога с товарами
    // Это ассинхронная функция
    openModalCatalogBasket: useCallback(async () => {
      // Блок try catch исполняеются в зависимости от вызванного метода Promise (resolve reject)
      try {
        // Сначало вызываем модалку и ждём от неё результата
        // Когда вызовется метод resolve
        const result = await store.get('modals').open('catalogBasket');
        // Пробегаемся по массиву с _id товаров
        for(const id of result) {
          // и вызываем метод для добавления товара в корзину и ожидаем её исполнения 
          await store.get('basket').addToBasket(id);
        }
      } catch (error) {
        console.error(error)
      }
    }, [])
  };

  const renders = {
    itemBasket: useCallback(item => (
      <ItemBasket
        item={item}
        link={`/articles/${item._id}`}
        onRemove={callbacks.removeFromBasket}
        onLink={callbacks.closeModal}
        labelUnit={t('basket.unit')}
        labelDelete={t('basket.delete')}
      />
    ), []),
  }

  return (
    <LayoutModal 
      title={t('basket.title')}
      labelClose={t('basket.close')}
      onClose={callbacks.closeModal}
      onOpenCatalog={callbacks.openModalCatalogBasket}>
      <List items={select.items} renderItem={renders.itemBasket}/>
      <BasketTotal sum={select.sum} t={t}/>
    </LayoutModal>
  )
}

export default React.memo(Basket);
