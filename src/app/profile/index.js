import React from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useInit from "@src/hooks/use-init";
import Spinner from "@src/components/elements/spinner";
import Layout from "@src/components/layouts/layout";
import TopContainer from "@src/containers/top";
import HeadContainer from "@src/containers/head";
import ToolsContainer from "@src/containers/tools";
import ProfileCard from "@src/components/profile/profile-card";

function Profile(){
  const store = useStore();

  const select = useSelector(state => ({
    profile: state.profile.data,
    waiting: state.profile.waiting,
    exists: state.session.exists
  }));

  useInit(async () => {
    await store.get('profile').load();
  }, []);

  return (
    <Layout>
      <TopContainer/>
      <HeadContainer/>
      <ToolsContainer/>
      <Spinner active={select.waiting}>
        <ProfileCard data={select.profile}/>
      </Spinner>
    </Layout>
  )
}

export default React.memo(Profile);
