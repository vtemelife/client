import { useState, useEffect, useRef } from "react";

const useSubscribeWebSocket = (
  webSocket: any,
  checkDataFn: any,
  callbackFn?: any
) => {
  const subscriptions = useRef([] as any);
  const [data, changeData] = useState({} as any);

  useEffect(() => {
    if (!webSocket) {
      return;
    }

    const subscribeMessage = (socketData: any) => {
      const webSocketData = socketData.data;
      if (!checkDataFn(webSocketData)) {
        return;
      }
      changeData(webSocketData);
      if (callbackFn) {
        callbackFn(webSocketData);
      }
    };

    const { unsubscribe: unsubscribeMessage } = webSocket.subscribeMessage(
      subscribeMessage
    );
    subscriptions.current = [unsubscribeMessage] as never;

    return () => {
      subscriptions.current.forEach((unsubscribe: any) => {
        unsubscribe();
      });
    };
  }, [webSocket, checkDataFn, callbackFn]);
  return { data };
};

export default useSubscribeWebSocket;
