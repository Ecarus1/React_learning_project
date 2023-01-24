import React from "react";
import Layout from "@src/components/layouts/layout";
import TopContainer from "@src/containers/top";
import HeadContainer from "@src/containers/head";
import ToolsContainer from "@src/containers/tools";
import Graphics from "@src/containers/graphics";
import GraphicsOOP from "@src/containers/graphics-oop";

function CanvasPage(){

  return (
    <Layout>
      <TopContainer/>
      <HeadContainer title={'Графика'}/>
      <ToolsContainer/>
      {/* <Graphics/> */}
      <GraphicsOOP/>
    </Layout>
  )
}

export default React.memo(CanvasPage);
