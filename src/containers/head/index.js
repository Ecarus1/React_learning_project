import React from "react";
import propTypes from "prop-types";
import useTranslate from "@src/hooks/use-translate";
import LayoutHead from "@src/components/layouts/layout-head";
import LocaleSelect from "@src/containers/locale-select";

function HeadContainer(props) {

  const {t} = useTranslate();

  return (
    <LayoutHead title={t(props.title)}>
      <LocaleSelect/>
    </LayoutHead>
  );
}

HeadContainer.propTypes = {
  title: propTypes.string,
}

HeadContainer.defaultProps = {
  title: 'title'
}

export default React.memo(HeadContainer);
