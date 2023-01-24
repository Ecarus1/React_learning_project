import React, {useCallback, useEffect, useRef} from "react";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import List from "@src/components/elements/list";
import Pagination from "@src/components/navigation/pagination";
import Spinner from "@src/components/elements/spinner";
import Item from "@src/components/catalog/item";
import ItemSelection from "@src/components/catalog/item-selection";
import HiddenBlock from "@src/components/elements/hidden-block";

function CatalogList({clone = false, catalogName = 'catalog', itemSelection}) {

  const store = useStore();

  const select = useSelector(state => ({
    items: state[catalogName].items,
    page: state[catalogName].params.page,
    limit: state[catalogName].params.limit,
    count: state[catalogName].count,
    waiting: state[catalogName].waiting,
  }));

  const loader = useRef();
  //Общее число страниц (Нужно для проверки на подгрузку следующих товаров)
  const countPages = Math.ceil(select.count / select.limit);
  const {t} = useTranslate();


  const callbacks = {
    onPaginate: useCallback(page => {
      window.scroll(0, 0);
      store.get(catalogName).setParams({page}, false, clone);
    }, []),

    openModalAddItemBasket: useCallback(async (_id) => {
        try {
          const result = await store.get('modals').open('addItem');
          console.log(result);
          store.get('basket').addToBasket(_id, result)
          // store.get('modals').close();
        } catch (error) {
          console.log(error)
          // store.get('modals').close();
        }
    }, []),
    // Добавление к списку следубщих товаров
    newItemLoading: useCallback((page) => store.get('catalog').setParams({page}, false, false, true), []),
    // Смотритель
    handleObserver: useCallback((entries) => {
      const target = entries[0];
      // Если элемент виден и нет загрузки и общее число страниц больше значения текущей
      if(target.isIntersecting && !select.waiting && countPages > select.page){
        // Выполняе callback на получение следующих n товаров (Со следующего page)
        callbacks.newItemLoading(select.page + 1);
      }
    }, [select.items]),
    // Очищаем список товаров (Данный callback нужен для возможности использования переходов на предыдущую страницы)
    resetProduct: useCallback(() => {
      window.scroll(0, 0);
      store.get('catalog').resetProduct();
    })
  };

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "60px",
      threshold: 1
    };
    const observer = new IntersectionObserver(callbacks.handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
        observer.disconnect();
      }
    }
  }, [select.items]);

  useEffect(() => {
    window.addEventListener("popstate", callbacks.resetProduct);
    return () => window.removeEventListener("popstate", callbacks.resetProduct);
  }, [])

  const renders = {
    item: useCallback(item => (
      <Item 
        item={item} 
        onAdd={callbacks.openModalAddItemBasket} 
        link={clone ? null : `/articles/${item._id}`} 
        labelAdd={t('article.add')}/>
    ), [t])
  }

  return (
    <Spinner active={select.waiting}>
      <Pagination count={select.count} page={select.page} limit={select.limit} onChange={callbacks.onPaginate}/>
      <List items={select.items} renderItem={itemSelection || renders.item}/>
      {clone ? null : <HiddenBlock loader={loader}/>}
    </Spinner>
  );
}

export default React.memo(CatalogList);
