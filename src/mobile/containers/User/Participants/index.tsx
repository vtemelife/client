import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  InputGroup,
  Form,
  Modal,
  ListGroup,
  Alert,
  Button
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGet } from "restful-react";
import { useLocation } from "react-router";
import queryString from "query-string";

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

const Participants: React.SFC<IProps> = () => {
  const location = useLocation();
  const { objectId, contentType, moderators } = queryString.parse(
    location.search
  );
  const [showMenu, toggleShowMenu] = useState(false);

  const [search, changeSearch] = useState("");
  const [offset, changeOffset] = useState(0);

  const [menuPage, changeMenuPage] = useState(MENU_PAGE_ALL);

  const getParams = {
    search,
    is_online: menuPage === MENU_PAGE_ONLINE ? true : undefined,
    object_id: objectId,
    content_type: contentType,
    moderators
  };
  const { data: participantsData, loading } = useGet({
    path: SERVER_URLS.PARTICIPANTS_LIST.toPath({
      getParams: { ...getParams, offset }
    })
  });
  const participantsItems = (participantsData || {}).results || [];
  const participantsCount = (participantsData || {}).count || 0;

  const participantsTitle = moderators ? _("Moderators") : _("Participants");
  let title =
    contentType === "users:user" ? _("User friends") : participantsTitle;
  switch (menuPage) {
    case MENU_PAGE_ONLINE:
      title =
        contentType === "users:user"
          ? _("User friends (online)")
          : `${participantsTitle} (online)`;
      break;
    case MENU_PAGE_ALL:
    default:
      break;
  }
  return (
    <div className="container-participants">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <Header
        name={`${title} ${
          participantsCount > 0 ? `(${participantsCount})` : ""
        }`}
        fixed={true}
      >
        <div onClick={() => toggleShowMenu(true)}>
          <i className="fa fa-bars" />
        </div>
      </Header>
      <div className="participants-search">
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
      <div className="participants-list">
        {!loading && participantsItems.length === 0 && (
          <Alert variant="warning">
            <div>{_("No participants.")}</div>
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
          count={participantsCount}
          objs={participantsItems}
          loading={loading}
          getParamsHash={JSON.stringify(getParams)}
        >
          {(item: any) => (
            <div className="participants-item" key={item.slug}>
              <div className="participants-avatar">
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
              <div className="participants-body">
                <div className="participants-title">
                  <Link
                    to={CLIENT_URLS.USER.PROFILE.toPath({
                      urlParams: {
                        userSlug: item.slug
                      }
                    })}
                  >
                    <div className="participants-title-name">
                      {item.online ? <i className="fa fa-circle" /> : null}{" "}
                      {item.name}
                    </div>
                  </Link>
                  <div className="participants-title-time">
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
              <i className="fa fa-users" />{" "}
              {contentType === "users:user"
                ? _("User friends")
                : participantsTitle}
            </ListGroup.Item>
            <ListGroup.Item
              onClick={() => {
                changeOffset(0);
                changeMenuPage(MENU_PAGE_ONLINE);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-circle" />{" "}
              {contentType === "users:user"
                ? _("User friends (online)")
                : `${participantsTitle} (online)`}
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Participants;
