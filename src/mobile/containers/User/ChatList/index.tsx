import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  InputGroup,
  Form,
  Badge,
  Modal,
  ListGroup,
  Alert,
  Button,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGet } from 'restful-react';
import Moment from 'react-moment';

import Image from 'generic/components/Image';
import usersSVG from 'generic/layout/images/users.svg';
import Header from 'mobile/containers/Header';

import { _ } from 'trans';
import { CLIENT_URLS } from 'mobile/routes/client';
import { SERVER_URLS } from 'routes/server';
import { getLocale } from 'utils';
import PaginateList from 'generic/components/PaginateList';
import { LinkContainer } from 'react-router-bootstrap';

const MENU_PAGE_ALL = 'all';
const MENU_PAGE_UNREAD = 'unread';
const MENU_PAGE_DIALOGS = 'dialogs';

const ChatList: React.SFC<any> = () => {
  const [showMenu, toggleShowMenu] = useState(false);
  const [menuPage, changeMenuPage] = useState(MENU_PAGE_ALL);
  const [search, changeSearch] = useState('');
  const [offset, changeOffset] = useState(0);
  const queryParams = {
    search,
    is_unread: menuPage === MENU_PAGE_UNREAD ? true : undefined,
    chat_type: menuPage === MENU_PAGE_DIALOGS ? 'conversation' : undefined,
  };
  const { data: chatsData, loading } = useGet({
    path: SERVER_URLS.CHAT_LIST.buildPath({
      queryParams: { ...queryParams, offset },
    }),
  });
  const chats = (chatsData || {}).results || [];
  const chatsCount = (chatsData || {}).count || 0;
  let title = _('Chats');
  switch (menuPage) {
    case MENU_PAGE_UNREAD:
      title = _('Unread chats');
      break;
    case MENU_PAGE_DIALOGS:
      title = _('Only dialogs');
      break;
    case MENU_PAGE_ALL:
    default:
      break;
  }
  return (
    <div className="container-chat-list">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <Header name={title} fixed={true}>
        <div onClick={() => toggleShowMenu(true)}>
          <i className="fa fa-bars" />
        </div>
        <div>
          <Link to={CLIENT_URLS.USER.CHAT_CREATE.buildPath()}>
            <i className="fa fa-plus" />
          </Link>
        </div>
      </Header>
      <div className="chat-search">
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id="search">
              <i className="fa fa-search" />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            type="text-break"
            placeholder={_('Start input here')}
            aria-describedby="search"
            value={search}
            onChange={(event: any) => changeSearch(event.target.value)}
          />
        </InputGroup>
      </div>
      <div className="chat-list">
        {!loading && chats.length === 0 && (
          <Alert variant="warning">
            <div>{_('No chats.')}</div>
            <hr />
            <div className="d-flex">
              <LinkContainer to={CLIENT_URLS.USER.CHAT_CREATE.buildPath()}>
                <Button size="sm" variant="warning">
                  <i className="fa fa-plus" /> {_('Create a chat')}
                </Button>
              </LinkContainer>
            </div>
          </Alert>
        )}
        <PaginateList
          offset={offset}
          changeOffset={changeOffset}
          count={chatsCount}
          objs={chats}
          loading={loading}
          queryParamsHash={JSON.stringify(queryParams)}
        >
          {(chat: any) => (
            <Link
              to={CLIENT_URLS.USER.CHAT_DETAIL.buildPath({
                chatPk: chat.pk,
              })}
              key={chat.pk}
            >
              <div className="chat-item">
                <div className="chat-avatar">
                  <Image
                    width={50}
                    height={50}
                    src={
                      chat.avatar && chat.avatar.thumbnail_100x100
                        ? chat.avatar.thumbnail_100x100
                        : usersSVG
                    }
                    roundedCircle={true}
                  />
                </div>
                <div className="chat-body">
                  <div className="chat-title">
                    <div className="chat-title-name">{chat.name}</div>
                    <div className="chat-title-time">
                      <Moment locale={getLocale()} fromNow={true}>
                        {chat.updated_date}
                      </Moment>
                    </div>
                  </div>
                  <div className="chat-text">
                    {chat.last_message && chat.last_message.pk && (
                      <div className="chat-title-last-msg">
                        {chat.last_message.creator.name}:{' '}
                        {chat.last_message.message}
                      </div>
                    )}
                    <div className="chat-title-unread">
                      {chat.unread_messages_count > 0 && (
                        <Badge variant="primary">
                          {chat.unread_messages_count}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </PaginateList>
      </div>
      <Modal size="lg" show={showMenu} onHide={() => toggleShowMenu(false)}>
        <Modal.Header closeButton={true}>
          <Modal.Title>
            <i className="fa fa-bars" /> {_('Menu')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup variant="flush">
            <ListGroup.Item
              onClick={() => {
                changeOffset(0);
                changeMenuPage(MENU_PAGE_ALL);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-users" /> {_('Chats')}
            </ListGroup.Item>
            <ListGroup.Item
              onClick={() => {
                changeOffset(0);
                changeMenuPage(MENU_PAGE_UNREAD);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-eye-slash" /> {_('Unread chats')}
            </ListGroup.Item>
            <ListGroup.Item
              onClick={() => {
                changeOffset(0);
                changeMenuPage(MENU_PAGE_DIALOGS);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-comments" /> {_('Only dialogs')}
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ChatList;
