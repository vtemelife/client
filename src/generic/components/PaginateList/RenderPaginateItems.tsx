import React from "react";

import Loading from "generic/components/Loading";

interface IProps {
  items: any;
  ownRender?: boolean;
  reverse?: boolean;
  loading?: boolean;
  children: any;
}

const RenderPaginateItems: React.SFC<IProps> = ({
  items,
  ownRender,
  reverse,
  loading,
  children
}) => {
  if (ownRender) {
    return (
      <>
        {reverse && loading && <Loading />}
        {children(items)}
        {!reverse && loading && <Loading />}
      </>
    );
  }
  return (
    <>
      {reverse && loading && <Loading />}
      {items.map((item: any, index: number) => children(item, index))}
      {!reverse && loading && <Loading />}
    </>
  );
};

export default RenderPaginateItems;
