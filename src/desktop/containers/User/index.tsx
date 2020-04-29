import React from 'react';
import compose from 'lodash/flowRight';
import { Row, Col, Container, Nav, Badge, Card } from 'react-bootstrap';
import { Route, Switch, Redirect } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { RouteComponentProps as IPropsWrapper } from 'react-router';

import { CLIENT_URLS } from 'desktop/routes/client';

import Profile from './Profile';
import PostCreate from './PostCreate';
import PostUpdate from './PostUpdate';
import NewsList from './NewsList';
import NewsDetail from './NewsDetail';
import FriendList from './FriendList';
import FriendRequests from './FriendRequests';
import BlackList from './BlackList';
import ChatList from './ChatList';
import ChatDetail from './ChatDetail';
import ChatConversationCreate from './ChatConversationCreate';
import ChatCreate from './ChatCreate';
import ChatWithModeratorsCreate from './ChatWithModeratorsCreate';
import ChatUpdate from './ChatUpdate';
import GroupList from './GroupList';
import GroupDetail from './GroupDetail';
import GroupDetailRequests from './GroupDetail/GroupDetailRequests';
import GroupCreate from './GroupCreate';
import GroupUpdate from './GroupUpdate';
import GroupRequests from './GroupRequests';
import ClubList from './ClubList';
import ClubDetail from './ClubDetail';
import ClubDetailRequests from './ClubDetail/ClubDetailRequests';
import ClubCreate from './ClubCreate';
import ClubUpdate from './ClubUpdate';
import ClubRequests from './ClubRequests';
import PartyList from './PartyList';
import PartyDetail from './PartyDetail';
import PartyCreate from './PartyCreate';
import PartyUpdate from './PartyUpdate';
import MediaFolderList from './MediaFolderList';
import MediaFolderDetail from './MediaFolderDetail';
import MediaFolderMediaDetail from './MediaFolderMediaDetail';
import MediaCreate from './MediaFolderDetail/MediaCreate';
import MediaUpdate from './MediaFolderDetail/MediaUpdate';
import MediaFolderCreate from './MediaFolderCreate';
import MediaFolderUpdate from './MediaFolderUpdate';
import GameList from './GameList';
import GameDetail from './GameDetail';
import GameUpdate from './GameUpdate';
import GamePlay from './GamePlay';
import Settings from './Settings';

import Posts from '../Posts';
import PostsWhisper from '../PostsWhisper';
import PostDetail from '../PostDetail';
import Search from '../Search';
import Media from '../Media';
import SiteMap from '../SiteMap';

import Loading from 'generic/components/Loading';
import { _ } from 'trans';
import { withAuthUser, withCounters } from 'generic/containers/Decorators';

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
                  userSlug: user.slug,
                })}
              >
                <Nav.Link>
                  <i className="fa fa-user-circle" /> {_('My Profile')}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to={CLIENT_URLS.USER.NEWS_LIST.buildPath()}>
                <Nav.Link>
                  <i className="fa fa-newspaper-o" /> {_('News')}{' '}
                  {counters.u_unread_news > 0 ? (
                    <Badge variant="primary">{counters.u_unread_news}</Badge>
                  ) : null}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to={CLIENT_URLS.USER.CHAT_LIST.buildPath()}>
                <Nav.Link>
                  <i className="fa fa-comments" /> {_('Chats')}{' '}
                  {counters.u_unread_chats > 0 ? (
                    <Badge variant="primary">{counters.u_unread_chats}</Badge>
                  ) : null}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to={CLIENT_URLS.USER.FRIEND_LIST.buildPath()}>
                <Nav.Link>
                  <i className="fa fa-users" /> {_('Friends')}{' '}
                  {counters.u_friends_requests > 0 ? (
                    <Badge variant="primary">
                      {counters.u_friends_requests}
                    </Badge>
                  ) : null}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={CLIENT_URLS.USER.CLUB_LIST.buildPath({
                  queryParams: { is_participant: true },
                })}
              >
                <Nav.Link>
                  <i className="fa fa-venus-mars" /> {_('Clubs')}{' '}
                  {counters.u_clubs_requests > 0 ? (
                    <Badge variant="primary">{counters.u_clubs_requests}</Badge>
                  ) : null}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={CLIENT_URLS.USER.GROUP_LIST.buildPath({
                  queryParams: { is_participant: true },
                })}
              >
                <Nav.Link>
                  <i className="fa fa-users" /> {_('Groups')}{' '}
                  {counters.u_groups_requests > 0 ? (
                    <Badge variant="primary">
                      {counters.u_groups_requests}
                    </Badge>
                  ) : null}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={CLIENT_URLS.USER.PARTY_LIST.buildPath({
                  queryParams: {
                    is_participant: false,
                    is_past: false,
                    city__region: user.city.region.pk,
                  },
                })}
              >
                <Nav.Link>
                  <i className="fa fa-calendar" /> {_('Parties')}{' '}
                  {counters.u_events > 0 ? (
                    <Badge variant="primary">{counters.u_events}</Badge>
                  ) : null}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={CLIENT_URLS.USER.MEDIA_FOLDER_LIST.buildPath()}
              >
                <Nav.Link>
                  <i className="fa fa-copy" /> {_('Media')}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to={CLIENT_URLS.USER.GAME_LIST.buildPath()}>
                <Nav.Link>
                  <i className="fa fa-gamepad" /> {_('Games')}
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
                      <i className="fa fa-comments" /> {_('Support')}
                    </Nav.Link>
                  </LinkContainer>
                </Nav>
              </Card.Body>
            </Card>
          </Col>
          <Switch>
            <Route
              exact={true}
              path={CLIENT_URLS.USER.INDEX.route}
              render={() => {
                return (
                  <Redirect
                    to={CLIENT_URLS.USER.PROFILE.buildPath({
                      userSlug: user.slug,
                    })}
                  />
                );
              }}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.POST_CREATE.route}
              component={PostCreate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.POST_UPDATE.route}
              component={PostUpdate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.NEWS_LIST.route}
              component={NewsList}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.NEWS_DETAIL.route}
              component={NewsDetail}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.FRIEND_LIST.route}
              component={FriendList}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.FRIEND_REQUESTS.route}
              component={FriendRequests}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.BLACKLIST_LIST.route}
              component={BlackList}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.CHAT_LIST.route}
              component={ChatList}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.CHAT_DETAIL.route}
              component={ChatDetail}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.CHAT_CONVERSATION_CREATE.route}
              component={ChatConversationCreate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.CHAT_CREATE.route}
              component={ChatCreate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.CHAT_WITH_MODERATORS_CREATE.route}
              component={ChatWithModeratorsCreate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.CHAT_UPDATE.route}
              component={ChatUpdate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.GROUP_LIST.route}
              component={GroupList}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.GROUP_DETAIL.route}
              component={GroupDetail}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.GROUP_DETAIL_REQUESTS.route}
              component={GroupDetailRequests}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.GROUP_CREATE.route}
              component={GroupCreate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.GROUP_UPDATE.route}
              component={GroupUpdate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.GROUP_REQUESTS.route}
              component={GroupRequests}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.CLUB_LIST.route}
              component={ClubList}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.CLUB_DETAIL.route}
              component={ClubDetail}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.CLUB_DETAIL_REQUESTS.route}
              component={ClubDetailRequests}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.CLUB_CREATE.route}
              component={ClubCreate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.CLUB_UPDATE.route}
              component={ClubUpdate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.CLUB_REQUESTS.route}
              component={ClubRequests}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.PARTY_LIST.route}
              component={PartyList}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.PARTY_DETAIL.route}
              component={PartyDetail}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.PARTY_CREATE.route}
              component={PartyCreate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.PARTY_UPDATE.route}
              component={PartyUpdate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.MEDIA_FOLDER_LIST.route}
              component={MediaFolderList}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.MEDIA_FOLDER_DETAIL_MEDIA_DETAIL.route}
              component={MediaFolderMediaDetail}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.MEDIA_FOLDER_DETAIL.route}
              component={MediaFolderDetail}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.MEDIA_FOLDER_DETAIL_MEDIA_CREATE.route}
              component={MediaCreate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.MEDIA_FOLDER_DETAIL_MEDIA_UPDATE.route}
              component={MediaUpdate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.MEDIA_FOLDER_CREATE.route}
              component={MediaFolderCreate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.MEDIA_FOLDER_UPDATE.route}
              component={MediaFolderUpdate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.GAME_LIST.route}
              component={GameList}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.GAME_DETAIL.route}
              component={GameDetail}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.GAME_UPDATE.route}
              component={GameUpdate}
            />
            <Route
              path={CLIENT_URLS.USER.GAME_PLAY.route}
              component={GamePlay}
            />
            <Route
              path={CLIENT_URLS.USER.SETTINGS.route}
              component={Settings}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.POSTS.route}
              component={Posts}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.WHISPER.route}
              component={PostsWhisper}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.POSTS_DETAIL.route}
              component={PostDetail}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.SEARCH.route}
              component={Search}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.MEDIA.route}
              component={Media}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.MAP.route}
              component={SiteMap}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.USER.PROFILE.route}
              component={Profile}
            />
          </Switch>
        </Row>
      </Container>
    );
  }
}

const withAuth = withAuthUser({
  propName: 'authUser',
});

const withCountersData = withCounters({
  propName: 'counters',
});

export default compose(withAuth, withCountersData)(User);
