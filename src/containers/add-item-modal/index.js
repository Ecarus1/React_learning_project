import React, { useCallback, useState } from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";

import LayoutModal from "@src/components/layouts/layout-modal";
import AddItemAmount from "@src/components/catalog/add-item-amount";

function AddItemModal() {
  const store = useStore();
  //Состояние готовности 
  const [readiness, setReadiness] = useState(null);
  //Состояние кол-ва товаров
  const [countItem, setCountItem] = useState(1);

  //Получаем объект последней модалки
  const parametr = useSelector(state => state.modals.nameModals.at(-1));

  const callbacks = {
    // Закрытие модалки
    closeModal: useCallback(() => {
      if(readiness) {
        store.get('modals').close(countItem);
      } else {
        store.get('modals').close();
      }
    }, [readiness, parametr])
  }

  return(
    <LayoutModal 
      title={"Колличество товара"} 
      labelClose={"Закрыть"}
      onClose={callbacks.closeModal}>
      <AddItemAmount
        readiness={readiness}
        setReadiness={setReadiness}
        countItem={countItem}
        setCountItem={setCountItem}
      />
    </LayoutModal>
  );
}

export default React.memo(AddItemModal)