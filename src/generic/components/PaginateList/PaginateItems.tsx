import React, { useEffect } from "react";
import { debounce } from "throttle-debounce";

import RenderPaginateItems from "./RenderPaginateItems";
import { DEFAULT_LIMIT, DEBOUNCE_TIMEOUT } from "./constants";
import { scrollToBottom } from "./utils";

interface IProps {
  objs: any;

  items: any;
  changeItems: any;

  offset: number;
  changeOffset: any;
  count: number;
  reverse?: boolean;
  loading?: boolean;

  ownRender?: boolean;
  children: any;

  isItemsReset: boolean;
}

const PaginateItems: React.SFC<IProps> = ({
  objs,
  items,
  changeItems,
  offset,
  changeOffset,
  count,
  reverse,
  loading,
  ownRender,
  children,
  isItemsReset
}) => {
  useEffect(() => {
    const objsPks = objs.map((item: any) => item.pk);
    if (isItemsReset) {
      if (reverse) {
        setTimeout(scrollToBottom, 100);
      }
      changeItems(objs);
      return;
    }
    // accumulate items logic
    if (reverse) {
      const objsInItemsPks = items
        .slice(0, objs.length)
        .map((item: any) => item.pk);
      if (JSON.stringify(objsInItemsPks) !== JSON.stringify(objsPks)) {
        changeItems([...objs, ...items]);
        setTimeout(
          () =>
            window.scrollTo({
              top:
                (offset / DEFAULT_LIMIT) *
                document.documentElement.clientHeight,
              left: 0
            }),
          100
        );
      } else {
        const objsInItems = items.slice(0, objs.length);
        if (JSON.stringify(objsInItems) !== JSON.stringify(objs)) {
          changeItems([...objs, ...items.slice(objs.length, items.length)]);
        }
      }
    } else {
      const objsInItemsPks = items
        .slice(items.length - objs.length, items.length)
        .map((item: any) => item.pk);
      if (JSON.stringify(objsInItemsPks) !== JSON.stringify(objsPks)) {
        changeItems([...items, ...objs]);
      } else {
        const objsInItems = items.slice(
          items.length - objs.length,
          items.length
        );
        if (JSON.stringify(objsInItems) !== JSON.stringify(objs)) {
          changeItems([...items.slice(0, items.length - objs.length), ...objs]);
        }
      }
    }
  }, [objs, items, changeItems, reverse, offset, isItemsReset]);

  useEffect(() => {
    // scroll logic and change offset
    const onScroll = () => {
      const isTop = window.scrollY <= 0;
      const isBottom =
        window.scrollY >=
        document.documentElement.scrollHeight -
          document.documentElement.clientHeight;
      if (reverse) {
        if (isTop && offset + DEFAULT_LIMIT < count) {
          debounce(DEBOUNCE_TIMEOUT, () => {
            changeOffset(offset + DEFAULT_LIMIT);
          })();
        }
      } else {
        if (isBottom && offset + DEFAULT_LIMIT < count) {
          debounce(DEBOUNCE_TIMEOUT, () => {
            changeOffset(offset + DEFAULT_LIMIT);
          })();
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset, changeOffset, count, reverse]);

  return (
    <RenderPaginateItems
      items={items}
      ownRender={ownRender}
      reverse={reverse}
      loading={loading}
      children={children}
    />
  );
};

export default PaginateItems;
