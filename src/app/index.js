import React from 'react';
import {Routes, Route} from "react-router-dom";
import useInit from "@src/hooks/use-init";
import useStore from "@src/hooks/use-store";
import Protected from "@src/containers/protected";
import Main from "./main";
import Article from "./article";
import Login from "./login";
import Profile from "./profile";
import ChatPage from './chat-page';
import CanvasPage from './canvas-page';

import ManagerModels from '@src/containers/manager-models';

/**
 * Приложение
 * @return {React.ReactElement} Виртуальные элементы React
 */
function App() {

  const store = useStore();

  useInit(async ()=>{
    await store.get('session').remind();
  })

  return (
    <>
      <Routes>
        <Route path={''} element={<Main/>}/>
        <Route path={"/articles/:id"} element={<Article/>}/>
        <Route path={"/login"} element={<Login/>}/>
        <Route path={"/profile"} element={<Protected redirect={'/login'}><Profile/></Protected>}/>
        <Route path={"/chat"} element={<Protected redirect={'/login'}><ChatPage/></Protected>}/>
        <Route path={"/canvas"} element={<CanvasPage/>}/>
      </Routes>
      <ManagerModels/>
    </>
  );
}

export default React.memo(App);
