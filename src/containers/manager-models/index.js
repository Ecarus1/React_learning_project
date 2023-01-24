import React from "react";
import useSelector from "@src/hooks/use-selector";
import * as modals from "./exports"; 

/**
 * Данный контейнер представляет из себя структуру, которая рендерит модалки, в соответсвии с добавленными тегами в state.madals
 * Каждая модалка создаётся в папке App
 */

function ManagerModels() {
  const nameModals = useSelector(state => state.modals.nameModals);
  return(
    <>
      {nameModals.map((item, i) => {
        const Component = modals[item.name];
        return <Component key={i}/>
      })}
    </>
  );
}

export default React.memo(ManagerModels)