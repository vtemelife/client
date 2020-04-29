import React, { useState, useContext } from "react";
import { useParams, useHistory } from "react-router";
import { Helmet } from "react-helmet-async";
import { Modal, Button, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGet, useMutate } from "restful-react";
import { debounce } from "throttle-debounce";

import Loading from "generic/components/Loading";
import Image from "generic/components/Image";
import FormMsgArea from "generic/components/Form/FormMsgArea";
import PaginateList from "generic/components/PaginateList";
import { scrollToBottom } from "generic/components/PaginateList/utils";
import Header from "mobile/containers/Header";
import { AuthUserContext } from "generic/containers/ContextProviders/HeaderUserService";
import { WebSocketContext } from "generic/containers/ContextProviders/WebSocketService";

import { _ } from "trans";
import { CLIENT_URLS } from "mobile/routes/client";
import { SERVER_URLS } from "routes/server";
import { handleErrors } from "utils";
import {
  SERVICE_CHAT,
  MSG_TYPE_TYPING,
  MSG_TYPE_NEW_MESSAGE,
  SERVICE_NOTIFICATION,
  MSG_TYPE_UPDATE_COUNTERS
} from "generic/containers/ContextProviders/WebSocketService/constants";
import useSubscribeWebSocket from "mobile/hooks/SubscribeWebSocket";
import Typing from "../../../../generic/components/Typing";
import DeleteItem from "mobile/components/DeleteItem";
import { ROLE_MODERATOR, TYPE_CHAT } from "generic/constants";

import Message from "./Message";

const ChatDetail: React.SFC<any> = () => {
  const history = useHistory();

  const [formData, changeFormData] = useState({
    message: "",
    attachments: []
  } as any);
  const [formErrors, changeFormErrors] = useState({} as any);

  const [showMenu, toggleShowMenu] = useState(false);
  const [offset, changeOffset] = useState(0);
  const { chatPk } = useParams();

  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {};

  const [newMessages, changeNewMessages] = useState([] as any);
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
        webSocketData.message_type !== MSG_TYPE_NEW_MESSAGE ||
        webSocketData.recipients.indexOf(user.pk) === -1 ||
        webSocketData.chat !== chatPk
      ) {
        return false;
      }
      return true;
    },
    (webSocketData: any) => {
      const message = webSocketData.data;
      changeNewMessages([...newMessages, ...[message]]);
      scrollToBottom();
    }
  );

  const { data: chatData, loading: chatLoading } = useGet({
    path: SERVER_URLS.CHAT_DETAIL.toPath({
      urlParams: {
        chatPk
      }
    })
  });
  const getParams = {
    chat: chatPk
  };
  const { data: messagesData, loading: messagesLoading } = useGet({
    path: SERVER_URLS.MESSAGE_LIST.toPath({
      getParams: { ...getParams, offset }
    })
  });
  const { mutate: sendMessage, loading: sendMessageLoading } = useMutate({
    verb: "POST",
    path: SERVER_URLS.MESSAGE_CREATE.toPath({
      urlParams: {
        chatPk
      }
    })
  });

  const chat = chatData || { moderators: [], users: [] };
  const messagesServer = (messagesData || {}).results || [];
  const messagesCount = (messagesData || {}).count || 0;

  const isModerator = (item: any) => {
    return (
      item.moderators.map((m: any) => m.pk).indexOf(user.pk) !== -1 ||
      user.role === ROLE_MODERATOR
    );
  };
  return (
    <div className="container-chat-detail">
      <Helmet>
        <title>{_("Chat")}</title>
        <meta name="description" content={_("Chat")} />
        <body className="body-mobile body-chat" />
      </Helmet>
      <Header name={chat.name || "Chat"} fixed={true}>
        <div onClick={() => toggleShowMenu(true)}>
          <i className="fa fa-bars" />
        </div>
      </Header>
      <div className="chat-messages">
        {(chatLoading || sendMessageLoading) && <Loading />}
        <PaginateList
          offset={offset}
          changeOffset={changeOffset}
          count={messagesCount}
          reverse={true}
          objs={messagesServer}
          loading={messagesLoading}
          getParamsHash={JSON.stringify(getParams)}
        >
          {(item: any) => <Message key={item.pk} item={item} />}
        </PaginateList>
        {newMessages.map((item: any) => (
          <Message key={item.pk} item={item} />
        ))}
      </div>
      <div className="chat-send-message">
        <div className="chat-typing">
          <Typing />
        </div>
        <div className="chat-attachments">
          {formData.attachments.map((attachment: any, index: number) => (
            <div className="chat-attachments-item" key={index}>
              <Image
                key={index}
                width={100}
                height={100}
                src={attachment.thumbnail_100x100}
              />
              <Button
                variant="danger"
                size="sm"
                className="float-right"
                onClick={() =>
                  changeFormData({
                    ...formData,
                    attachments: formData.attachments.filter(
                      (a: any) => a.pk !== attachment.pk
                    )
                  })
                }
              >
                <i className="fa fa-trash" />
              </Button>
            </div>
          ))}
        </div>

        <FormMsgArea
          name="message"
          required={true}
          value={formData.message}
          onChange={(target: any) => {
            debounce(500, () => {
              webSocket.sendMessage({
                service: SERVICE_CHAT,
                message_type: MSG_TYPE_TYPING,
                sender: user.pk,
                recipients: chat.users
                  .map((u: any) => u.pk)
                  .filter((pk: string) => pk !== user.pk),
                chat: chat.pk,
                data: {
                  user
                }
              });
            })();
            changeFormData({
              ...formData,
              message: target.value
            });
          }}
          errors={formErrors.message}
          onChangeAttachments={(attachments: any) => {
            changeFormData({
              ...formData,
              attachments
            });
          }}
          onSend={() => {
            sendMessage({
              chat: chatPk,
              message: formData.message.replace(/(?:\r\n|\r|\n)/g, "<br />"),
              attachments: formData.attachments.map((a: any) => a.pk)
            })
              .then((data: any) => {
                const message = data;
                webSocket.sendMessage({
                  service: SERVICE_CHAT,
                  message_type: MSG_TYPE_NEW_MESSAGE,
                  sender: user.pk,
                  recipients: chat.users
                    .map((u: any) => u.pk)
                    .filter((pk: string) => pk !== user.pk),
                  chat: chat.pk,
                  data: message
                });
                webSocket.sendMessage({
                  service: SERVICE_NOTIFICATION,
                  message_type: MSG_TYPE_UPDATE_COUNTERS,
                  sender: user.pk,
                  recipients: chat.users
                    .map((u: any) => u.pk)
                    .filter((pk: string) => pk !== user.pk),
                  data: {}
                });
                changeNewMessages([...newMessages, ...[message]]);
                changeFormData({
                  message: "",
                  attachments: []
                } as any);
                changeFormErrors({});
                scrollToBottom();
              })
              .catch((errors: any) => {
                handleErrors(errors, changeFormErrors);
              });
          }}
        />
      </div>
      <Modal size="lg" show={showMenu} onHide={() => toggleShowMenu(false)}>
        <Modal.Header closeButton={true}>
          <Modal.Title>
            <i className="fa fa-bars" /> {_("Menu")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup variant="flush" className="chat-detail-menu">
            <ListGroup.Item>
              <DeleteItem
                description={_("Are you sure you want to leave the chat?")}
                onSuccess={() => {
                  history.push(CLIENT_URLS.USER.CHAT_LIST.toPath());
                }}
                path={SERVER_URLS.CHAT_LEAVE.toPath({
                  urlParams: {
                    chatPk
                  }
                })}
              >
                <i className="fa fa-sign-out fa-lg" />
                <span className="menu-item">{_("Leave the chat")}</span>
              </DeleteItem>
            </ListGroup.Item>
            {chat.chat_type === TYPE_CHAT && isModerator(chat) && (
              <>
                <ListGroup.Item>
                  <Link
                    to={CLIENT_URLS.USER.CHAT_UPDATE.toPath({
                      urlParams: {
                        chatPk
                      }
                    })}
                  >
                    <i className="fa fa-pencil fa-lg" />
                    <span className="menu-item">{_("Update the chat")}</span>
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item>
                  <DeleteItem
                    description={_("Are you sure you want to delete the chat?")}
                    onSuccess={() => {
                      history.push(CLIENT_URLS.USER.CHAT_LIST.toPath());
                    }}
                    path={SERVER_URLS.CHAT_DELETE.toPath({
                      urlParams: {
                        chatPk
                      }
                    })}
                  >
                    <i className="fa fa-trash fa-lg" />
                    <span className="menu-item">{_("Delete the chat")}</span>
                  </DeleteItem>
                </ListGroup.Item>
              </>
            )}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => toggleShowMenu(false)} variant="secondary">
            {_("Close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ChatDetail;
