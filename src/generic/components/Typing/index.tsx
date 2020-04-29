import React, { useContext, useState } from "react";
import { useRouteMatch } from "react-router";

import { _ } from "trans";

import {
  SERVICE_CHAT,
  MSG_TYPE_TYPING
} from "generic/containers/ContextProviders/WebSocketService/constants";
import { WebSocketContext } from "generic/containers/ContextProviders/WebSocketService";
import { AuthUserContext } from "generic/containers/ContextProviders/HeaderUserService";
import useSubscribeWebSocket from "mobile/hooks/SubscribeWebSocket";

const Typing: React.SFC<any> = () => {
  const [typingUser, changeTypingUser] = useState({} as any);

  const match = useRouteMatch();
  const urlParams = match.params as any;

  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {};

  const webSocket = useContext(WebSocketContext) || {
    sendMessage: () => {
      return;
    }
  };
  useSubscribeWebSocket(
    webSocket,
    (webSocketData: any) => {
      if (
        webSocketData.service !== SERVICE_CHAT ||
        webSocketData.message_type !== MSG_TYPE_TYPING ||
        webSocketData.recipients.indexOf(user.pk) === -1 ||
        webSocketData.chat !== urlParams.chatPk
      ) {
        return false;
      }
      return true;
    },
    (webSocketData: any) => {
      const webSocketTypingUser = webSocketData.data
        ? webSocketData.data.user
        : undefined;
      if (
        webSocketTypingUser &&
        webSocketTypingUser.name &&
        webSocketTypingUser.pk !== user.pk
      ) {
        changeTypingUser(webSocketTypingUser);
        setTimeout(() => {
          changeTypingUser({});
        }, 500);
      }
    }
  );

  if (typingUser.pk) {
    return (
      <span>
        {typingUser.name} {_("is typing ...")}
      </span>
    );
  }

  return null;
};

export default Typing;
