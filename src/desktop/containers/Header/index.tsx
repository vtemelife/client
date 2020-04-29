import React from "react";
import compose from "lodash/flowRight";
import { withRouter } from "react-router-dom";
import queryString from "query-string";

import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Mutate } from "restful-react";
import { LinkContainer } from "react-router-bootstrap";
import { RouteComponentProps } from "react-router";

import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";

import logoPNG from "generic/layout/images/logo.png";
import { ROLE_MODERATOR, REQUEST_WAITING } from "generic/constants";
import { _ } from "trans";
import {
  withAuthUser,
  withGlobalStates,
  withCounters
} from "generic/containers/Decorators";

interface IProps extends RouteComponentProps {
  counters: any;
  states: any;
  authUser: any;
}

interface IState {
  search: string;
  isShowMenuBar: boolean;
}

class Header extends React.PureComponent<IProps, IState> {
  public state = {
    search: "",
    isShowMenuBar: false
  };

  public render() {
    const getParams = queryString.parse(this.props.location.search);
    const locale = getParams.locale || localStorage.getItem("locale") || "ru";
    const code2 = locale === "en" ? "gb" : locale;
    const user = this.props.authUser.user;
    const counters = this.props.counters.counters;
    if (user.pk) {
      return (
        <>
          <Navbar className="header-container" fixed="top">
            <LinkContainer to={CLIENT_URLS.USER.INDEX.buildPath()}>
              <Navbar.Brand className="mr-auto">
                <img alt="" src={logoPNG} width="30" height="30" /> {_("VTeme")}
              </Navbar.Brand>
            </LinkContainer>
            <Nav className="mr-auto">
              <LinkContainer to={CLIENT_URLS.WHISPER.toPath()}>
                <Nav.Link>
                  <i className="fa fa-eye-slash" /> {_("Whisper")}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to={CLIENT_URLS.POSTS.toPath()}>
                <Nav.Link>
                  <i className="fa fa-book" /> {_("Articles")}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={CLIENT_URLS.SEARCH.toPath({
                  getParams: {
                    city__region: user.city.region.pk
                  }
                })}
              >
                <Nav.Link>
                  <i className="fa fa-search" /> {_("Search friends")}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to={CLIENT_URLS.MEDIA.toPath()}>
                <Nav.Link>
                  <i className="fa fa-image" /> {_("Media")}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to={CLIENT_URLS.MAP.buildPath()}>
                <Nav.Link>
                  <i className="fa fa-map" /> {_("Map")}
                </Nav.Link>
              </LinkContainer>
              {user.role === ROLE_MODERATOR ? (
                <NavDropdown
                  title={`${_("Moderation")} (${counters.m_notifications})`}
                  id="moderation-menu"
                >
                  <LinkContainer
                    to={CLIENT_URLS.MODERATOR.CHAT_LIST.buildPath()}
                  >
                    <NavDropdown.Item>
                      <i className="fa fa-comments" /> {_("Chats")} (
                      {counters.m_unread_chats})
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer
                    to={CLIENT_URLS.MODERATOR.USER_LIST.buildPath(undefined, {
                      getParams: { status: REQUEST_WAITING }
                    })}
                  >
                    <NavDropdown.Item>
                      <i className="fa fa-users" /> {_("Users")} (
                      {counters.m_users})
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer
                    to={CLIENT_URLS.MODERATOR.CLUB_LIST.buildPath(undefined, {
                      getParams: { status: REQUEST_WAITING }
                    })}
                  >
                    <NavDropdown.Item>
                      <i className="fa fa-venus-mars" /> {_("Clubs")} (
                      {counters.m_clubs_waiting_approve})
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer
                    to={CLIENT_URLS.MODERATOR.PARTY_LIST.buildPath(undefined, {
                      getParams: { status: REQUEST_WAITING }
                    })}
                  >
                    <NavDropdown.Item>
                      <i className="fa fa-calendar" /> {_("Parties")} (
                      {counters.m_parties_waiting_approve})
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer
                    to={CLIENT_URLS.MODERATOR.POST_LIST.buildPath(undefined, {
                      getParams: { status: REQUEST_WAITING }
                    })}
                  >
                    <NavDropdown.Item>
                      <i className="fa fa-copy" /> {_("Articles")} (
                      {counters.m_posts_waiting_approve})
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer
                    to={CLIENT_URLS.MODERATOR.MEDIA_LIST.buildPath(undefined, {
                      getParams: { status: REQUEST_WAITING }
                    })}
                  >
                    <NavDropdown.Item>
                      <i className="fa fa-photo" /> {_("Media")} (
                      {counters.m_media_waiting_approve})
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer
                    to={CLIENT_URLS.MODERATOR.NEWS_LIST.buildPath()}
                  >
                    <NavDropdown.Item>
                      <i className="fa fa-newspaper-o" /> {_("News")}(
                      {counters.m_unpiblished_news})
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              ) : null}
            </Nav>
            <Nav>
              <NavDropdown
                title={
                  (<span className={`flag-icon flag-icon-${code2}`} />) as any
                }
                className="left-dropdown dropdown-icon dropdown-without-arrow dropdown-locale"
                id="locale"
              >
                <NavDropdown.Item onClick={() => this.reloadLocale("ru")}>
                  <span className="flag-icon flag-icon-ru" />
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => this.reloadLocale("en")}>
                  <span className="flag-icon flag-icon-gb" />
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                title={
                  (
                    <span
                      className={
                        counters.u_notifications > 0 ? "text-error" : ""
                      }
                    >
                      <i className="fa fa-bell" />
                      {counters.u_notifications}
                    </span>
                  ) as any
                }
                className="left-dropdown dropdown-icon dropdown-without-arrow"
                id="bell-notification"
              >
                {counters.u_notifications === 0 ? (
                  <NavDropdown.Item>{_("No notifications")}</NavDropdown.Item>
                ) : null}
                {counters.u_unread_news > 0 ? (
                  <LinkContainer to={CLIENT_URLS.USER.NEWS_LIST.buildPath()}>
                    <NavDropdown.Item>
                      <i className="fa fa-newspaper-o" />
                      {_("News")} ({counters.u_unread_news})
                    </NavDropdown.Item>
                  </LinkContainer>
                ) : null}
                {counters.u_unread_chats > 0 ? (
                  <LinkContainer to={CLIENT_URLS.USER.CHAT_LIST.buildPath()}>
                    <NavDropdown.Item>
                      <i className="fa fa-users" />
                      {_("Chats")} ({counters.u_unread_chats})
                    </NavDropdown.Item>
                  </LinkContainer>
                ) : null}
                {counters.u_friends_requests > 0 ? (
                  <LinkContainer to={CLIENT_URLS.USER.FRIEND_LIST.buildPath()}>
                    <NavDropdown.Item>
                      <i className="fa fa-users" />
                      {_("Friends")} ({counters.u_friends_requests})
                    </NavDropdown.Item>
                  </LinkContainer>
                ) : null}
                {counters.u_clubs_requests > 0 ? (
                  <LinkContainer
                    to={CLIENT_URLS.USER.CLUB_LIST.buildPath(undefined, {
                      getParams: { is_participant: true }
                    })}
                  >
                    <NavDropdown.Item>
                      <i className="fa fa-venus-mars" />
                      {_("Clubs")} ({counters.u_clubs_requests})
                    </NavDropdown.Item>
                  </LinkContainer>
                ) : null}
                {counters.u_groups_requests > 0 ? (
                  <LinkContainer
                    to={CLIENT_URLS.USER.GROUP_LIST.buildPath(undefined, {
                      getParams: { is_participant: true }
                    })}
                  >
                    <NavDropdown.Item>
                      <i className="fa fa-users" />
                      {_("Groups")} ({counters.u_groups_requests})
                    </NavDropdown.Item>
                  </LinkContainer>
                ) : null}
                {counters.u_events > 0 ? (
                  <LinkContainer
                    to={CLIENT_URLS.USER.PARTY_LIST.buildPath(undefined, {
                      getParams: {
                        is_participant: true
                      }
                    })}
                  >
                    <NavDropdown.Item>
                      <i className="fa fa-calendar" />
                      {_("Parties")} ({counters.u_events})
                    </NavDropdown.Item>
                  </LinkContainer>
                ) : null}
              </NavDropdown>
              <NavDropdown
                title={user.name}
                id="user-menu"
                className="left-dropdown"
              >
                <LinkContainer to={CLIENT_URLS.USER.SETTINGS.buildPath()}>
                  <NavDropdown.Item>
                    <i className="fa fa-cogs" /> {_("Settings")}
                  </NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <Mutate verb="POST" path={SERVER_URLS.SIGN_OUT.buildPath()}>
                  {signOut => (
                    <NavDropdown.Item
                      onClick={() => {
                        signOut({}).then((result: any) => {
                          this.props.history.push({
                            pathname: CLIENT_URLS.AUTH.SIGN_IN.buildPath()
                          });
                          this.props.authUser.refetch();
                        });
                      }}
                    >
                      <i className="fa fa-sign-out" /> {_("Sign out")}
                    </NavDropdown.Item>
                  )}
                </Mutate>
              </NavDropdown>
            </Nav>
          </Navbar>
        </>
      );
    } else {
      return (
        <Navbar className="header-container" fixed="top">
          <LinkContainer to={CLIENT_URLS.USER.INDEX.buildPath()}>
            <Navbar.Brand className="mr-auto">
              <img
                alt=""
                src={logoPNG}
                width="30"
                height="30"
                className="d-inline-block"
              />
              {_("VTeme")}
            </Navbar.Brand>
          </LinkContainer>
          <Nav>
            <NavDropdown
              title={
                (<span className={`flag-icon flag-icon-${code2}`} />) as any
              }
              className="left-dropdown dropdown-icon dropdown-without-arrow dropdown-locale"
              id="locale"
            >
              <NavDropdown.Item onClick={() => this.reloadLocale("ru")}>
                <span className="flag-icon flag-icon-ru" />
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => this.reloadLocale("en")}>
                <span className="flag-icon flag-icon-gb" />
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar>
      );
    }
  }

  private reloadLocale = (locale: string) => {
    const getParams = queryString.parse(this.props.location.search);
    window.location = (this.props.location.pathname +
      `?${queryString.stringify({
        ...getParams,
        locale
      })}`) as any;
  };
}

const withAuth = withAuthUser({
  propName: "authUser"
});

const withStates = withGlobalStates({
  propName: "states"
});

const withCountersData = withCounters({
  propName: "counters"
});

export default compose(
  withRouter,
  withAuth,
  withStates,
  withCountersData
)(Header);
