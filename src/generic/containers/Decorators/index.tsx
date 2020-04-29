import Get, { Mutate } from "restful-react";

import { HeaderUserConsumer } from "generic/containers/ContextProviders/HeaderUserService";
import { WebSocketConsumer } from "generic/containers/ContextProviders/WebSocketService";
import { StatesConsumer } from "generic/containers/ContextProviders/StatesService";
import { CountersConsumer } from "generic/containers/ContextProviders/CountersService";
import { withProps } from "./WithProps";

export const withAuthUser = withProps(HeaderUserConsumer, (props: any) => {
  return {
    user: props[0].headerUser || {
      black_list: [],
      city: {
        country: {},
        region: {}
      }
    },
    refetch: props[0].refetchHeaderUser
  };
});

export const withWebSocket = withProps(WebSocketConsumer, (props: any) => {
  return {
    subscribeOpen: props[0].subscribeOpen,
    subscribeMessage: props[0].subscribeMessage,
    subscribeClose: props[0].subscribeClose,
    sendMessage: props[0].sendMessage,
    isConnected: props[0].isConnected
  };
});

export const withGlobalStates = withProps(StatesConsumer, (props: any) => {
  return {
    isDisplayImages: props[0].isDisplayImages,
    toggleDisplayImages: props[0].toggleDisplayImages,

    isShowSideBar: props[0].isShowSideBar,
    showSideBar: props[0].showSideBar,
    hideSideBar: props[0].hideSideBar
  };
});

export const withCounters = withProps(CountersConsumer, (props: any) => {
  return {
    counters: props[0].counters,
    refetch: props[0].refetchCounters
  };
});

export const withRestGet = withProps(Get, (props: any) => {
  return {
    response: props[0],
    loading: props[1].loading,
    error: props[1].error,
    refetch: props[2].refetch,
    responseServer: props[3].response,
    absolutePath: props[3].absolutePath
  };
});

export const withRestMutate = withProps(Mutate, (props: any) => {
  return {
    mutate: props[0],
    loading: props[1].loading,
    error: props[1].error,
    absolutePath: props[2].absolutePath
  };
});
