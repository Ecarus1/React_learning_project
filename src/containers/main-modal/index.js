import React, {useCallback} from "react";
import useStore from "@src/hooks/use-store";
import useInit from "@src/hooks/use-init";
import CatalogFilter from "@src/containers/catalog-filter";
import CatalogList from "@src/containers/catalog-list";
import ToolsContainer from "@src/containers/tools";
import useClone from "@src/hooks/use-clone";

import LayoutModal from "@src/components/layouts/layout-modal";

function MainModal() {
  const store = useStore();

  // const newNameModules = useClone(['catalog', 'categories'], 'A');
  const newNameCatalog = useClone('catalog', 'A');
  const newNameCategories = useClone('categories', 'A');

  useInit(async () => {
    await Promise.all([
      //Здесь как раз и применяем наш новый склонированный store (catalog + A)
      store.get(newNameCatalog).initParams({}, true),
      store.get(newNameCategories).load()
    ]);
  }, []);

  //callback для закрытия модалки
  const callbacks = {
    closeModal: useCallback(() => {
      store.get('modals').close();
    }, [])
  }

  return (
    <LayoutModal
      title={"Каталог в модалке"} 
      labelClose={"Закрыть"}
      onClose={callbacks.closeModal}>
      {/* <ToolsContainer clone={true}/> */}
      <CatalogFilter catalogName={newNameCatalog} categoriesName={newNameCategories} clone={true}/>
      <CatalogList clone={true} catalogName={newNameCatalog}/>
    </LayoutModal>
  )
}

export default React.memo(MainModal);