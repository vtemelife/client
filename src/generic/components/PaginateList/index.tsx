import React, { useState, useEffect } from "react";

import RenderPaginateItems from "./RenderPaginateItems";
import PaginateItems from "./PaginateItems";

interface IProps {
  objs: any;

  offset: number;
  changeOffset: any;
  count: number;
  reverse?: boolean;
  loading?: boolean;

  ownRender?: boolean;
  children: any;

  getParamsHash: string;
}

const PaginateList: React.SFC<IProps> = ({
  objs,
  ownRender,
  offset,
  reverse,
  loading,
  children,
  getParamsHash,
  ...props
}) => {
  const [items, changeItems] = useState([]);
  const [prevHash, changePrevHash] = useState("");

  useEffect(() => {
    if (
      objs.length &&
      prevHash !== getParamsHash &&
      JSON.stringify(items.map((i: any) => i.pk)) !==
        JSON.stringify(objs.map((i: any) => i.pk))
    ) {
      changePrevHash(getParamsHash);
    }
  }, [getParamsHash, prevHash, changePrevHash, objs, items]);

  if (offset > objs.count) {
    // case of start pagination but objs are empty - nothing to do
    // case of end pagination - we don't paginate just render
    return (
      <RenderPaginateItems
        items={items}
        ownRender={ownRender}
        reverse={reverse}
        loading={loading}
        children={children}
      />
    );
  }

  return (
    <PaginateItems
      objs={objs}
      items={items}
      changeItems={changeItems}
      ownRender={ownRender}
      offset={offset}
      reverse={reverse}
      loading={loading}
      children={children}
      isItemsReset={prevHash !== getParamsHash}
      {...props}
    />
  );
};

export default PaginateList;
