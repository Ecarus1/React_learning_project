import React, {useCallback} from "react";
import useStore from "@src/hooks/use-store";
import useInit from "@src/hooks/use-init";
import CatalogFilter from "@src/containers/catalog-filter";
import CatalogList from "@src/containers/catalog-list";
import useClone from "@src/hooks/use-clone";
import useTranslate from "@src/hooks/use-translate";
import ItemSelection from "@src/components/catalog/item-selection";

import LayoutModal from "@src/components/layouts/layout-modal";

function CatalogListModal() {
  const store = useStore();

  const {t} = useTranslate();

  const newNameCatalog = useClone('catalog', 'A');
  const newNameCategories = useClone('categories', 'A');

  let selectedItems = [];

  useInit(async () => {
    await Promise.all([
      store.get(newNameCatalog).initParams({}, true),
      store.get(newNameCategories).load()
    ]);
  }, []);

  const callbacks = {
    //Закрытие модалки
    closeModal: useCallback(() => {
      if(selectedItems.length > 0) {
        store.get('modals').close(selectedItems);
      } else {
        store.get('modals').close();
      }
      
    }, []),

    onItemSelect: useCallback((_id) => {
      //если в массиве нету такого элемента
      if(!selectedItems.includes(_id)){
        //то пушим его
        selectedItems.push(_id)
        return true
      } else {
        //в противном случае возвращаем новый массив без конкретного товара
        selectedItems = selectedItems.filter(item => item !== _id)
        return false
      }
    }, [])
  }

  const renders = {
    itemSelection: useCallback(item => {
      return(
        <ItemSelection 
        selectedItems={selectedItems} 
        item={item} 
        active={selectedItems.includes(item._id)} 
        onAdd={callbacks.onItemSelect} 
        labelAdd={t('article.add')}/>
      )
    }, [t]),
  }

  return (
    <LayoutModal
      title={"Каталог в модалке"} 
      labelClose={"Закрыть"}
      onClose={callbacks.closeModal}>
      {/* <ToolsContainer/> */}
      <CatalogFilter 
        catalogName={newNameCatalog} 
        categoriesName={newNameCategories} 
        clone={true}/>
      <CatalogList 
        clone={true} 
        catalogName={newNameCatalog} 
        onItemSelect={callbacks.onItemSelect}
        itemSelection={renders.itemSelection}
        />
    </LayoutModal>
  )
}

export default React.memo(CatalogListModal);