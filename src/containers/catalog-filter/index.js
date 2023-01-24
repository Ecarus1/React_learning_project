import React, {useCallback, useMemo} from "react";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import Select from "@src/components/elements/select";
import Input from "@src/components/elements/input";
import LayoutFlex from "@src/components/layouts/layout-flex";
import listToTree from "@src/utils/list-to-tree";
import treeToList from "@src/utils/tree-to-list";
import CustomSelect from "@src/components/elements/custom-select";
import { useState } from "react";

function CatalogFilter({catalogName = 'catalog', categoriesName = 'categories', clone = false}) {
  
  const [country, setCountry] = useState('AU');

  const store = useStore();

  const select = useSelector(state => ({
    sort: state[catalogName].params.sort,
    query: state[catalogName].params.query,
    category: state[catalogName].params.category,
    categories: state[categoriesName].items,
  }));

  const {t} = useTranslate();

  const callbacks = {
    // Сортировка
    onSort: useCallback(sort => store.get(catalogName).setParams({sort}, false, clone, false), []),
    // Поиск
    onSearch: useCallback(query => store.get(catalogName).setParams({query, page: 1}, false, clone, false), []),
    // Сброс
    onReset: useCallback(() => store.get(catalogName).resetParams({}, clone), []),
    // Фильтр по категории
    onCategory: useCallback(category => store.get(catalogName).setParams({category}, false, clone, false), []),

    onCountry: useCallback(countryy => {
      setCountry(countryy)
    }, [])
  };

  // Опции для полей
  const options = {
    sort: useMemo(() => ([
      {value: 'order', title: 'По порядку'},
      {value: 'title.ru', title: 'По именованию'},
      {value: '-price', title: 'Сначала дорогие'},
      {value: 'edition', title: 'Древние'},
    ]), []),

    categories: useMemo(() => [
      {value: '', title: 'Все'},
      ...treeToList(
        listToTree(select.categories),
        (item, level) => ({value: item._id, title: '- '.repeat(level) + item.title})
      )
    ], [select.categories]),

    country: useMemo(() => ([
      {code: "GG", value: 'AU', title: "Australia" },
      {code: "dd", value: 'BR', title: "Brazil" },
      {code: "ww", value: 'CH', title: "China" },
      {code: "GG", value: 'DE', title: "Denmark" },
      {value: 'EG', title: "Egypt" },
      {code: "GG", value: 'FI', title: "Finland" },
      {code: "GG", value: 'GH', title: "GhanaQQQQQQQQQQQQQQQQQQQQQQQ" },
      {code: "GG", value: 'HU', title: "Hungary" },
      {code: "GG", value: 'IN', title: "India" },
      {code: "GG", value: 'JA', title: "Japan" }
    ]), []),
  }

  return (
    <LayoutFlex flex="start" indent="big">
      <CustomSelect onChange={callbacks.onCategory} value={select.category} options={options.categories}/>
      <CustomSelect onChange={callbacks.onSort} value={select.sort} options={options.sort}/>
      <Input onChange={callbacks.onSearch} value={select.query} placeholder={'Поиск'} theme="big"/>
      <button onClick={callbacks.onReset}>{t('filter.reset')}</button>
      {/* <CustomSelect onChange={callbacks.onCountry} value={country} options={options.country}/> */}
    </LayoutFlex>
  );
}

export default React.memo(CatalogFilter);
