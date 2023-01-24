import React, {useCallback} from "react";
import {useStore as useStoreRedux, useSelector as useSelectorRedux, shallowEqual} from "react-redux";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import {useParams} from "react-router-dom";
import useInit from "@src/hooks/use-init";
import useTranslate from "@src/hooks/use-translate";
import ArticleCard from "@src/components/catalog/article-card";
import Spinner from "@src/components/elements/spinner";
import Layout from "@src/components/layouts/layout";
import TopContainer from "@src/containers/top";
import HeadContainer from "@src/containers/head";
import ToolsContainer from "@src/containers/tools";
import actionsArticle from '@src/store-redux/article/actions';
import Chat from "@src/containers/chat";

function ChatPage(){

  return (
    <Layout>
      <TopContainer/>
      <HeadContainer title={'Чат'}/>
      <ToolsContainer/>
      <Chat/>
    </Layout>
  )
}

export default React.memo(ChatPage);
