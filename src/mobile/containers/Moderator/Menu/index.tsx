import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Nav, Badge } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { CountersContext } from "generic/containers/ContextProviders/CountersService";

import { _ } from "trans";
import { CLIENT_URLS } from "mobile/routes/client";
import { REQUEST_WAITING, TYPE_CHAT_WITH_MODERATORS } from "generic/constants";
import Header from "mobile/containers/Header";

const Menu: React.SFC<any> = () => {
  const countersData = useContext(CountersContext) || {
    counters: {}
  };
  const counters = countersData.counters || {};

  return (
    <div className="container-menu">
      <Helmet>
        <title>{_("Moderator menu")}</title>
        <meta name="description" content={_("Moderator menu")} />
      </Helmet>
      <Header name={_("Moderator menu")} />
      <div className="block">
        <Nav className="flex-column">
          <LinkContainer
            to={CLIENT_URLS.MODERATOR.CHAT_LIST.toPath({
              getParams: { chat_type: TYPE_CHAT_WITH_MODERATORS }
            })}
          >
            <Nav.Link className="black-link">
              <i className="fa fa-comments" /> {_("Chats")}{" "}
              {counters.m_unread_chats > 0 ? (
                <Badge variant="primary">{counters.m_unread_chats}</Badge>
              ) : null}
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to={CLIENT_URLS.MODERATOR.USER_LIST.toPath()}>
            <Nav.Link className="black-link">
              <i className="fa fa-users" /> {_("Users")}{" "}
              {counters.m_users > 0 ? (
                <Badge variant="primary">{counters.m_users}</Badge>
              ) : null}
            </Nav.Link>
          </LinkContainer>
          <LinkContainer
            to={CLIENT_URLS.MODERATOR.CLUB_LIST.toPath({
              getParams: { status: REQUEST_WAITING }
            })}
          >
            <Nav.Link className="black-link">
              <i className="fa fa-venus-mars" /> {_("Clubs")}{" "}
              {counters.m_clubs_waiting_approve > 0 ? (
                <Badge variant="primary">
                  {counters.m_clubs_waiting_approve}
                </Badge>
              ) : null}
            </Nav.Link>
          </LinkContainer>
          <LinkContainer
            to={CLIENT_URLS.MODERATOR.PARTY_LIST.toPath({
              getParams: { status: REQUEST_WAITING }
            })}
          >
            <Nav.Link className="black-link">
              <i className="fa fa-calendar" /> {_("Parties")}{" "}
              {counters.m_parties_waiting_approve > 0 ? (
                <Badge variant="primary">
                  {counters.m_parties_waiting_approve}
                </Badge>
              ) : null}
            </Nav.Link>
          </LinkContainer>
          <LinkContainer
            to={CLIENT_URLS.MODERATOR.POST_LIST.toPath({
              getParams: { status: REQUEST_WAITING }
            })}
          >
            <Nav.Link className="black-link">
              <i className="fa fa-copy" /> {_("Posts")}{" "}
              {counters.m_posts_waiting_approve > 0 ? (
                <Badge variant="primary">
                  {counters.m_posts_waiting_approve}
                </Badge>
              ) : null}
            </Nav.Link>
          </LinkContainer>
          <LinkContainer
            to={CLIENT_URLS.MODERATOR.MEDIA_LIST.toPath({
              getParams: { status: REQUEST_WAITING }
            })}
          >
            <Nav.Link className="black-link">
              <i className="fa fa-photo" /> {_("Media")}{" "}
              {counters.m_media_waiting_approve > 0 ? (
                <Badge variant="primary">
                  {counters.m_media_waiting_approve}
                </Badge>
              ) : null}
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to={CLIENT_URLS.MODERATOR.NEWS_LIST.toPath()}>
            <Nav.Link className="black-link">
              <i className="fa fa-newspaper-o" /> {_("News")}{" "}
              {counters.m_unpiblished_news > 0 ? (
                <Badge variant="primary">{counters.m_unpiblished_news}</Badge>
              ) : null}
            </Nav.Link>
          </LinkContainer>
        </Nav>
      </div>
    </div>
  );
};

export default Menu;
