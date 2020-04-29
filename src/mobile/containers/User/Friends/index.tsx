import React, { useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import {
  InputGroup,
  Form,
  Modal,
  ListGroup,
  Alert,
  Button,
  Badge
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGet } from "restful-react";

import { CountersContext } from "generic/containers/ContextProviders/CountersService";
import Image from "generic/components/Image";
import userSVG from "generic/layout/images/user.svg";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "mobile/routes/client";
import Header from "mobile/containers/Header";
import PaginateList from "generic/components/PaginateList";

import { _ } from "trans";
import { LinkContainer } from "react-router-bootstrap";

interface IProps {
  authUser: any;
  countersData: any;
}

const MENU_PAGE_ALL = "all";
const MENU_PAGE_ONLINE = "online";

const Friends: React.SFC<IProps> = () => {
  const [showMenu, toggleShowMenu] = useState(false);

  const [search, changeSearch] = useState("");
  const [offset, changeOffset] = useState(0);

  const [menuPage, changeMenuPage] = useState(MENU_PAGE_ALL);

  const countersData = useContext(CountersContext) || {
    counters: {}
  };
  const counters = countersData.counters || { u_friends_requests: 0 };

  const getParams = {
    search,
    is_online: menuPage === MENU_PAGE_ONLINE ? true : undefined
  };
  const { data: friendsData, loading } = useGet({
    path: SERVER_URLS.FRIENDS_LIST.toPath({
      getParams: { ...getParams, offset }
    })
  });
  const friendsItems = (friendsData || {}).results || [];
  const friendsCount = (friendsData || {}).count || 0;

  let title = _("Friends");
  switch (menuPage) {
    case MENU_PAGE_ONLINE:
      title = _("Online friends");
      break;
    case MENU_PAGE_ALL:
    default:
      break;
  }
  return (
    <div className="container-friends">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <Header
        name={`${title} ${friendsCount > 0 ? `(${friendsCount})` : ""}`}
        fixed={true}
      >
        <div onClick={() => toggleShowMenu(true)}>
          <i className="fa fa-bars" />{" "}
          {counters.u_friends_requests > 0 ? counters.u_friends_requests : null}
        </div>
      </Header>
      <div className="friends-search">
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id="search">
              <i className="fa fa-search" />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            type="text-break"
            placeholder={_("Start input here")}
            aria-describedby="search"
            value={search}
            onChange={(event: any) => changeSearch(event.target.value)}
          />
        </InputGroup>
      </div>
      <div className="friends-list">
        {!loading && friendsItems.length === 0 && (
          <Alert variant="warning">
            <div>{_("No friends.")}</div>
            <hr />
            <div className="d-flex">
              <LinkContainer to={CLIENT_URLS.SEARCH.toPath()}>
                <Button size="sm" variant="warning">
                  <i className="fa fa-plus" /> {_("Search a friend")}
                </Button>
              </LinkContainer>
            </div>
          </Alert>
        )}
        <PaginateList
          offset={offset}
          changeOffset={changeOffset}
          count={friendsCount}
          objs={friendsItems}
          loading={loading}
          getParamsHash={JSON.stringify(getParams)}
        >
          {(item: any) => (
            <div className="friends-item" key={item.slug}>
              <div className="friends-avatar">
                <Link
                  to={CLIENT_URLS.USER.PROFILE.toPath({
                    urlParams: {
                      userSlug: item.slug
                    }
                  })}
                >
                  <Image
                    width={50}
                    height={50}
                    src={
                      item.avatar && item.avatar.thumbnail_100x100
                        ? item.avatar.thumbnail_100x100
                        : userSVG
                    }
                    roundedCircle={true}
                  />
                </Link>
              </div>
              <div className="friends-body">
                <div className="friends-title">
                  <Link
                    to={CLIENT_URLS.USER.PROFILE.toPath({
                      urlParams: {
                        userSlug: item.slug
                      }
                    })}
                  >
                    <div className="friends-title-name">
                      {item.online ? <i className="fa fa-circle" /> : null}{" "}
                      {item.name}
                    </div>
                  </Link>
                  <div className="friends-title-time">
                    <Link
                      to={
                        item.chat
                          ? CLIENT_URLS.USER.CHAT_DETAIL.toPath({
                              urlParams: {
                                chatPk: item.chat
                              }
                            })
                          : CLIENT_URLS.USER.CHAT_CONVERSATION_CREATE.toPath({
                              urlParams: {
                                recipientSlug: item.slug
                              }
                            })
                      }
                    >
                      <i className="fa fa-comment fa-lg" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </PaginateList>
      </div>
      <Modal size="lg" show={showMenu} onHide={() => toggleShowMenu(false)}>
        <Modal.Header closeButton={true}>
          <Modal.Title>
            <i className="fa fa-bars" /> {_("Menu")}
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
              <i className="fa fa-users" /> {_("Friends")}
            </ListGroup.Item>
            <ListGroup.Item
              onClick={() => {
                changeOffset(0);
                changeMenuPage(MENU_PAGE_ONLINE);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-circle" /> {_("Online friends")}
            </ListGroup.Item>
            <ListGroup.Item>
              <Link to={CLIENT_URLS.USER.FRIEND_REQUESTS.toPath()}>
                <i className="fa fa-list-ol" /> {_("My friend requests")}{" "}
                {counters.u_friends_requests > 0 && (
                  <Badge variant="primary">{counters.u_friends_requests}</Badge>
                )}
              </Link>
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Friends;
