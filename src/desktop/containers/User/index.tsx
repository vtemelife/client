import React from "react";
import compose from "lodash/flowRight";
import { Row, Col, Container, Nav, Badge, Card } from "react-bootstrap";
import { Route, Switch, Redirect } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { RouteComponentProps as IPropsWrapper } from "react-router";

import { CLIENT_URLS } from "desktop/routes/client";

import Profile from "./Profile";
import PostCreate from "./PostCreate";
import PostUpdate from "./PostUpdate";
import NewsList from "./NewsList";
import NewsDetail from "./NewsDetail";
import FriendList from "./FriendList";
import FriendRequests from "./FriendRequests";
import BlackList from "./BlackList";
import ChatList from "./ChatList";
import ChatDetail from "./ChatDetail";
import ChatConversationCreate from "./ChatConversationCreate";
import ChatCreate from "./ChatCreate";
import ChatWithModeratorsCreate from "./ChatWithModeratorsCreate";
import ChatUpdate from "./ChatUpdate";
import GroupList from "./GroupList";
import GroupDetail from "./GroupDetail";
import GroupDetailRequests from "./GroupDetail/GroupDetailRequests";
import GroupCreate from "./GroupCreate";
import GroupUpdate from "./GroupUpdate";
import GroupRequests from "./GroupRequests";
import ClubList from "./ClubList";
import ClubDetail from "./ClubDetail";
import ClubDetailRequests from "./ClubDetail/ClubDetailRequests";
import ClubCreate from "./ClubCreate";
import ClubUpdate from "./ClubUpdate";
import ClubRequests from "./ClubRequests";
import PartyList from "./PartyList";
import PartyDetail from "./PartyDetail";
import PartyCreate from "./PartyCreate";
import PartyUpdate from "./PartyUpdate";
import MediaFolderList from "./MediaFolderList";
import MediaFolderDetail from "./MediaFolderDetail";
import MediaFolderMediaDetail from "./MediaFolderMediaDetail";
import MediaCreate from "./MediaFolderDetail/MediaCreate";
import MediaUpdate from "./MediaFolderDetail/MediaUpdate";
import MediaFolderCreate from "./MediaFolderCreate";
import MediaFolderUpdate from "./MediaFolderUpdate";
import GameList from "./GameList";
import GameDetail from "./GameDetail";
import GameUpdate from "./GameUpdate";
import GamePlay from "./GamePlay";
import Settings from "./Settings";

import Posts from "../Posts";
import PostsWhisper from "../PostsWhisper";
import PostDetail from "../PostDetail";
import Search from "../Search";
import Media from "../Media";
import SiteMap from "../SiteMap";

import Loading from "generic/components/Loading";
import { _ } from "trans";
import { withAuthUser, withCounters } from "generic/containers/Decorators";

interface IProps extends IPropsWrapper {
  authUser: any;
  counters: any;
}

class User extends React.Component<IProps> {
  public UNSAFE_componentWillMount() {
    this.props.authUser.refetch();
  }

  public render() {
    if (!this.props.authUser.user.slug) {
      return <Loading />;
    }
    const user = this.props.authUser.user;
    const counters = this.props.counters.counters;
    return (
      <Container className="user-container">
        <Row>
          <Col lg={2}>
            <Nav className="sidebar flex-column">
              <LinkContainer
                to={CLIENT_URLS.USER.PROFILE.buildPath({
                  userSlug: user.slug
                })}
              >
                <Nav.Link>
                  <i className="fa fa-user-circle" /> {_("My Profile")}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to={CLIENT_URLS.USER.NEWS_LIST.buildPath()}>
                <Nav.Link>
                  <i className="fa fa-newspaper-o" /> {_("News")}{" "}
                  {counters.u_unread_news > 0 ? (
                    <Badge variant="primary">{counters.u_unread_news}</Badge>
                  ) : null}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to={CLIENT_URLS.USER.CHAT_LIST.buildPath()}>
                <Nav.Link>
                  <i className="fa fa-comments" /> {_("Chats")}{" "}
                  {counters.u_unread_chats > 0 ? (
                    <Badge variant="primary">{counters.u_unread_chats}</Badge>
                  ) : null}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to={CLIENT_URLS.USER.FRIEND_LIST.buildPath()}>
                <Nav.Link>
                  <i className="fa fa-users" /> {_("Friends")}{" "}
                  {counters.u_friends_requests > 0 ? (
                    <Badge variant="primary">
                      {counters.u_friends_requests}
                    </Badge>
                  ) : null}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={CLIENT_URLS.USER.CLUB_LIST.buildPath(undefined, {
                  getParams: { is_participant: true }
                })}
              >
                <Nav.Link>
                  <i className="fa fa-venus-mars" /> {_("Clubs")}{" "}
                  {counters.u_clubs_requests > 0 ? (
                    <Badge variant="primary">{counters.u_clubs_requests}</Badge>
                  ) : null}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={CLIENT_URLS.USER.GROUP_LIST.buildPath(undefined, {
                  getParams: { is_participant: true }
                })}
              >
                <Nav.Link>
                  <i className="fa fa-users" /> {_("Groups")}{" "}
                  {counters.u_groups_requests > 0 ? (
                    <Badge variant="primary">
                      {counters.u_groups_requests}
                    </Badge>
                  ) : null}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={CLIENT_URLS.USER.PARTY_LIST.buildPath(undefined, {
                  getParams: {
                    is_participant: false,
                    is_past: false,
                    city__region: user.city.region.pk
                  }
                })}
              >
                <Nav.Link>
                  <i className="fa fa-calendar" /> {_("Parties")}{" "}
                  {counters.u_events > 0 ? (
                    <Badge variant="primary">{counters.u_events}</Badge>
                  ) : null}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={CLIENT_URLS.USER.MEDIA_FOLDER_LIST.buildPath()}
              >
                <Nav.Link>
                  <i className="fa fa-copy" /> {_("Media")}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to={CLIENT_URLS.USER.GAME_LIST.buildPath()}>
                <Nav.Link>
                  <i className="fa fa-gamepad" /> {_("Games")}
                </Nav.Link>
              </LinkContainer>
            </Nav>
            <Card className="under-sidebar">
              <Card.Body>
                <Nav>
                  <LinkContainer
                    to={CLIENT_URLS.USER.CHAT_WITH_MODERATORS_CREATE.buildPath()}
                  >
                    <Nav.Link>
                      <i className="fa fa-comments" /> {_("Support")}
                    </Nav.Link>
                  </LinkContainer>
                </Nav>
              </Card.Body>
            </Card>
          </Col>
          <Switch>
            <Route
              exact={true}
              path={CLIENT_URLS.USER.INDEX.routePath()}
              render={() => {
                return (
                  <Redirect
                    to={CLIENT_URLS.USER.PROFILE.buildPath({
                      userSlug: user.slug
                    })}
                  />
                );
              }}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.POST_CREATE.routePath()}
              component={PostCreate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.POST_UPDATE.routePath()}
              component={PostUpdate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.NEWS_LIST.routePath()}
              component={NewsList}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.NEWS_DETAIL.routePath()}
              component={NewsDetail}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.FRIEND_LIST.routePath()}
              component={FriendList}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.FRIEND_REQUESTS.routePath()}
              component={FriendRequests}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.BLACKLIST_LIST.routePath()}
              component={BlackList}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.CHAT_LIST.routePath()}
              component={ChatList}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.CHAT_DETAIL.routePath()}
              component={ChatDetail}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.CHAT_CONVERSATION_CREATE.routePath()}
              component={ChatConversationCreate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.CHAT_CREATE.routePath()}
              component={ChatCreate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.CHAT_WITH_MODERATORS_CREATE.routePath()}
              component={ChatWithModeratorsCreate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.CHAT_UPDATE.routePath()}
              component={ChatUpdate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.GROUP_LIST.routePath()}
              component={GroupList}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.GROUP_DETAIL.routePath()}
              component={GroupDetail}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.GROUP_DETAIL_REQUESTS.routePath()}
              component={GroupDetailRequests}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.GROUP_CREATE.routePath()}
              component={GroupCreate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.GROUP_UPDATE.routePath()}
              component={GroupUpdate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.GROUP_REQUESTS.routePath()}
              component={GroupRequests}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.CLUB_LIST.routePath()}
              component={ClubList}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.CLUB_DETAIL.routePath()}
              component={ClubDetail}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.CLUB_DETAIL_REQUESTS.routePath()}
              component={ClubDetailRequests}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.CLUB_CREATE.routePath()}
              component={ClubCreate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.CLUB_UPDATE.routePath()}
              component={ClubUpdate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.CLUB_REQUESTS.routePath()}
              component={ClubRequests}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.PARTY_LIST.routePath()}
              component={PartyList}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.PARTY_DETAIL.routePath()}
              component={PartyDetail}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.PARTY_CREATE.routePath()}
              component={PartyCreate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.PARTY_UPDATE.routePath()}
              component={PartyUpdate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.MEDIA_FOLDER_LIST.routePath()}
              component={MediaFolderList}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.MEDIA_FOLDER_DETAIL_MEDIA_DETAIL.routePath()}
              component={MediaFolderMediaDetail}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.MEDIA_FOLDER_DETAIL.routePath()}
              component={MediaFolderDetail}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.MEDIA_FOLDER_DETAIL_MEDIA_CREATE.routePath()}
              component={MediaCreate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.MEDIA_FOLDER_DETAIL_MEDIA_UPDATE.routePath()}
              component={MediaUpdate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.MEDIA_FOLDER_CREATE.routePath()}
              component={MediaFolderCreate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.MEDIA_FOLDER_UPDATE.routePath()}
              component={MediaFolderUpdate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.GAME_LIST.routePath()}
              component={GameList}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.GAME_DETAIL.routePath()}
              component={GameDetail}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.GAME_UPDATE.routePath()}
              component={GameUpdate}
            />
            <Route
              path={CLIENT_URLS.USER.GAME_PLAY.routePath()}
              component={GamePlay}
            />
            <Route
              path={CLIENT_URLS.USER.SETTINGS.routePath()}
              component={Settings}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.POSTS.routePath()}
              component={Posts}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.WHISPER.routePath()}
              component={PostsWhisper}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.POSTS_DETAIL.routePath()}
              component={PostDetail}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.SEARCH.routePath()}
              component={Search}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.MEDIA.routePath()}
              component={Media}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.MAP.routePath()}
              component={SiteMap}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.PROFILE.routePath()}
              component={Profile}
            />
          </Switch>
        </Row>
      </Container>
    );
  }
}

const withAuth = withAuthUser({
  propName: "authUser"
});

const withCountersData = withCounters({
  propName: "counters"
});

export default compose(withAuth, withCountersData)(User);
