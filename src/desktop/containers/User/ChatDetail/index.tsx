import React, { useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { Button, Col, Row, Card, InputGroup, Form, Nav } from 'react-bootstrap';
import { useGet, useMutate } from 'restful-react';
import { debounce } from 'throttle-debounce';

import Loading from 'generic/components/Loading';
import FormMsgArea from 'generic/components/Form/FormMsgArea';
import { LinkContainer } from 'react-router-bootstrap';
import { AuthUserContext } from 'generic/containers/ContextProviders/HeaderUserService';
import { WebSocketContext } from 'generic/containers/ContextProviders/WebSocketService';

import { _ } from 'trans';
import { CLIENT_URLS } from 'mobile/routes/client';
import { SERVER_URLS } from 'routes/server';
import { handleErrors } from 'utils';
import {
  SERVICE_CHAT,
  MSG_TYPE_TYPING,
  MSG_TYPE_NEW_MESSAGE,
  SERVICE_NOTIFICATION,
  MSG_TYPE_UPDATE_COUNTERS,
} from 'generic/containers/ContextProviders/WebSocketService/constants';
import useSubscribeWebSocket from 'mobile/hooks/SubscribeWebSocket';

import DeleteItem from 'mobile/components/DeleteItem';
import { ROLE_MODERATOR, TYPE_CHAT } from 'generic/constants';

import Participants from 'desktop/components/Participants';
import Typing from 'generic/components/Typing';
import PaginateList from 'generic/components/PaginateList';
import { scrollToBottom } from 'generic/components/PaginateList/utils';

import BanUsers from './BanUsers';
import Message from './Message';

const ChatDetail: React.SFC<any> = () => {
  const history = useHistory();

  const [formData, changeFormData] = useState({
    message: '',
    attachments: [],
  } as any);
  const [formErrors, changeFormErrors] = useState({} as any);

  const [search, changeSearch] = useState('');
  const [offset, changeOffset] = useState(0);
  const { chatPk } = useParams();

  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {};

  const [newMessages, changeNewMessages] = useState([] as any);
  const webSocket = useContext(WebSocketContext) || {
    sendMessage: () => {
      return;
    },
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
    },
  );

  const { data: chatData, loading: chatLoading } = useGet({
    path: SERVER_URLS.CHAT_DETAIL.buildPath({
      chatPk,
    }),
  });
  const queryParams = {
    chat: chatPk,
    search,
  };
  const { data: messagesData, loading: messagesLoading } = useGet({
    path: SERVER_URLS.MESSAGE_LIST.buildPath({
      queryParams: { ...queryParams, offset },
    }),
  });
  const { mutate: sendMessage, loading: sendMessageLoading } = useMutate({
    verb: 'POST',
    path: SERVER_URLS.MESSAGE_CREATE.buildPath({
      chatPk,
    }),
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
    <Col lg={10} className="chat-detail-container">
      <Helmet>
        <title>{chat.name || _('Chat')}</title>
        <meta name="description" content={chat.name || _('Chat')} />
      </Helmet>
      <Row className="flex-column-reverse flex-lg-row">
        <Col lg={9}>
          <Card>
            <Card.Header>
              <Row>
                <Col lg={7}>
                  <Card.Title className="object-title">
                    {chat.name || _('Chat')}
                  </Card.Title>
                </Col>
                <Col lg={5}>
                  <Card.Title className="object-search">
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text id="search">
                          <i className="fa fa-search" />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <Form.Control
                        type="text-break"
                        placeholder={_('Input smth and click Enter')}
                        aria-describedby="search"
                        required={true}
                        onKeyPress={(e: any) => {
                          if (e.key === 'Enter') {
                            changeSearch(e.target.value);
                          }
                        }}
                      />
                    </InputGroup>
                  </Card.Title>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="object-list">
              <Row>
                {(chatLoading || sendMessageLoading) && <Loading />}
                <PaginateList
                  offset={offset}
                  changeOffset={changeOffset}
                  count={messagesCount}
                  reverse={true}
                  objs={messagesServer}
                  loading={messagesLoading}
                  queryParamsHash={JSON.stringify(queryParams)}
                >
                  {(item: any) => <Message key={item.pk} item={item} />}
                </PaginateList>
                {newMessages.map((item: any) => (
                  <Message key={item.pk} item={item} />
                ))}
              </Row>
              <div className="object-list-element-typyng">
                <Typing />
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="comments-form-message">
                <Row className="comments-form-attachments">
                  {formData.attachments.map(
                    (attachment: any, index: number) => (
                      <Col
                        lg={6}
                        md={6}
                        sm={6}
                        key={index}
                        className="comments-form-attachment"
                      >
                        <Card>
                          <Card.Img
                            variant="top"
                            src={attachment.thumbnail_500x500}
                          />
                          <Card.Footer>
                            <Button
                              variant="danger"
                              size="sm"
                              className="float-right"
                              onClick={() =>
                                changeFormData({
                                  ...formData,
                                  attachments: formData.attachments.filter(
                                    (a: any) => a.pk !== attachment.pk,
                                  ),
                                })
                              }
                            >
                              <i className="fa fa-trash" />
                            </Button>
                          </Card.Footer>
                        </Card>
                      </Col>
                    ),
                  )}
                </Row>
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
                          user,
                        },
                      });
                    })();
                    changeFormData({
                      ...formData,
                      message: target.value,
                    });
                  }}
                  errors={formErrors.message}
                  onChangeAttachments={(attachments: any) => {
                    changeFormData({
                      ...formData,
                      attachments,
                    });
                  }}
                  onSend={() => {
                    sendMessage({
                      chat: chatPk,
                      message: formData.message.replace(
                        /(?:\r\n|\r|\n)/g,
                        '<br />',
                      ),
                      attachments: formData.attachments.map((a: any) => a.pk),
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
                          data: message,
                        });
                        webSocket.sendMessage({
                          service: SERVICE_NOTIFICATION,
                          message_type: MSG_TYPE_UPDATE_COUNTERS,
                          sender: user.pk,
                          recipients: chat.users
                            .map((u: any) => u.pk)
                            .filter((pk: string) => pk !== user.pk),
                          data: {},
                        });
                        changeNewMessages([...newMessages, ...[message]]);
                        changeFormData({
                          message: '',
                          attachments: [],
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
            </Card.Footer>
          </Card>
        </Col>
        <Col lg={3} className="right-filters">
          <Card>
            <Card.Body>
              <Card.Title>
                <i className="fa fa-cogs" /> {_('Actions')}
              </Card.Title>
              <Nav className="flex-column">
                {chat.chat_type === TYPE_CHAT && isModerator(chat) && (
                  <>
                    <LinkContainer
                      to={CLIENT_URLS.USER.CHAT_UPDATE.buildPath({
                        chatPk,
                      })}
                    >
                      <Nav.Link>
                        <i className="fa fa-pencil" /> {_('Update')}
                      </Nav.Link>
                    </LinkContainer>
                    <DeleteItem
                      description={_(
                        'Are you sure you want to delete the chat?',
                      )}
                      onSuccess={() => {
                        history.push(CLIENT_URLS.USER.CHAT_LIST.buildPath());
                      }}
                      path={SERVER_URLS.CHAT_DELETE.buildPath({
                        chatPk,
                      })}
                    >
                      <Nav.Link className="text-error">
                        <i className="fa fa-trash" /> {_('Delete')}
                      </Nav.Link>
                    </DeleteItem>
                  </>
                )}
                <DeleteItem
                  description={_('Are you sure you want to leave the chat?')}
                  onSuccess={() => {
                    history.push(CLIENT_URLS.USER.CHAT_LIST.buildPath());
                  }}
                  path={SERVER_URLS.CHAT_LEAVE.buildPath({
                    chatPk,
                  })}
                >
                  <Nav.Link className="text-error">
                    <i className="fa fa-sign-out" /> {_('Leave the chat')}
                  </Nav.Link>
                </DeleteItem>
              </Nav>
            </Card.Body>
          </Card>
          {chat.chat_type === TYPE_CHAT && isModerator(chat) && (
            <BanUsers chat={chat} />
          )}
          <Participants participants={chat.users} />
        </Col>
      </Row>
    </Col>
  );
};

export default ChatDetail;
