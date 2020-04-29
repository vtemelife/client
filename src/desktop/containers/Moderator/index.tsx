import React from 'react';
import compose from 'lodash/flowRight';
import { Row, Container, Col, Nav, Badge, NavDropdown } from 'react-bootstrap';
import { Route, Switch, Redirect } from 'react-router-dom';
import { RouteComponentProps as IPropsWrapper } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

import { CLIENT_URLS } from 'desktop/routes/client';

import ChatList from './ChatList';
import UserList from './UserList';
import ClubList from './ClubList';
import PartyList from './PartyList';
import PostList from './PostList';
import MediaList from './MediaList';
import NewsList from './NewsList';
import NewsCreate from './NewsCreate';
import NewsUpdate from './NewsUpdate';
import NewsDetail from './NewsDetail';
import { REQUEST_WAITING, TYPE_CHAT_WITH_MODERATORS } from 'generic/constants';

import Loading from 'generic/components/Loading';
import { _ } from 'trans';
import { withAuthUser, withCounters } from 'generic/containers/Decorators';

interface IProps extends IPropsWrapper {
  authUser: any;
  counters: any;
}

class Moderator extends React.PureComponent<IProps> {
  public render() {
    if (!this.props.authUser.user) {
      return <Loading />;
    }
    const user = this.props.authUser.user;
    const counters = this.props.counters.counters;
    return (
      <Container className="moderator-container">
        <Row>
          <Col lg={2}>
            <Nav className="moderator-sidebar flex-column">
              <LinkContainer
                to={CLIENT_URLS.USER.PROFILE.buildPath({
                  userSlug: user.slug,
                })}
              >
                <Nav.Link>
                  <i className="fa fa-user-circle" /> {_('My profile')}
                </Nav.Link>
              </LinkContainer>
              <NavDropdown.Divider />
              <LinkContainer
                to={CLIENT_URLS.MODERATOR.CHAT_LIST.buildPath({
                  queryParams: { chat_type: TYPE_CHAT_WITH_MODERATORS },
                })}
              >
                <Nav.Link>
                  <i className="fa fa-comments" /> {_('Chats')}{' '}
                  {counters.m_unread_chats > 0 ? (
                    <Badge variant="primary">{counters.m_unread_chats}</Badge>
                  ) : null}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to={CLIENT_URLS.MODERATOR.USER_LIST.buildPath()}>
                <Nav.Link>
                  <i className="fa fa-users" /> {_('Users')}{' '}
                  {counters.m_users > 0 ? (
                    <Badge variant="primary">{counters.m_users}</Badge>
                  ) : null}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={CLIENT_URLS.MODERATOR.CLUB_LIST.buildPath({
                  queryParams: { status: REQUEST_WAITING },
                })}
              >
                <Nav.Link>
                  <i className="fa fa-venus-mars" /> {_('Clubs')}{' '}
                  {counters.m_clubs_waiting_approve > 0 ? (
                    <Badge variant="primary">
                      {counters.m_clubs_waiting_approve}
                    </Badge>
                  ) : null}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={CLIENT_URLS.MODERATOR.PARTY_LIST.buildPath({
                  queryParams: { status: REQUEST_WAITING },
                })}
              >
                <Nav.Link>
                  <i className="fa fa-calendar" /> {_('Parties')}{' '}
                  {counters.m_parties_waiting_approve > 0 ? (
                    <Badge variant="primary">
                      {counters.m_parties_waiting_approve}
                    </Badge>
                  ) : null}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={CLIENT_URLS.MODERATOR.POST_LIST.buildPath({
                  queryParams: { status: REQUEST_WAITING },
                })}
              >
                <Nav.Link>
                  <i className="fa fa-copy" /> {_('Posts')}{' '}
                  {counters.m_posts_waiting_approve > 0 ? (
                    <Badge variant="primary">
                      {counters.m_posts_waiting_approve}
                    </Badge>
                  ) : null}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={CLIENT_URLS.MODERATOR.MEDIA_LIST.buildPath({
                  queryParams: { status: REQUEST_WAITING },
                })}
              >
                <Nav.Link>
                  <i className="fa fa-photo" /> {_('Media')}{' '}
                  {counters.m_media_waiting_approve > 0 ? (
                    <Badge variant="primary">
                      {counters.m_media_waiting_approve}
                    </Badge>
                  ) : null}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to={CLIENT_URLS.MODERATOR.NEWS_LIST.buildPath()}>
                <Nav.Link>
                  <i className="fa fa-newspaper-o" /> {_('news')}{' '}
                  {counters.m_unpiblished_news > 0 ? (
                    <Badge variant="primary">
                      {counters.m_unpiblished_news}
                    </Badge>
                  ) : null}
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Col>
          <Switch>
            <Route
              exact={true}
              path={CLIENT_URLS.MODERATOR.INDEX.route}
              render={() => {
                return (
                  <Redirect
                    to={CLIENT_URLS.MODERATOR.CHAT_LIST.buildPath({
                      queryParams: { status: REQUEST_WAITING },
                    })}
                  />
                );
              }}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.MODERATOR.CHAT_LIST.route}
              component={ChatList}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.MODERATOR.USER_LIST.route}
              component={UserList}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.MODERATOR.CLUB_LIST.route}
              component={ClubList}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.MODERATOR.PARTY_LIST.route}
              component={PartyList}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.MODERATOR.POST_LIST.route}
              component={PostList}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.MODERATOR.MEDIA_LIST.route}
              component={MediaList}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.MODERATOR.NEWS_LIST.route}
              component={NewsList}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.MODERATOR.NEWS_CREATE.route}
              component={NewsCreate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.MODERATOR.NEWS_UPDATE.route}
              component={NewsUpdate}
            />
            <Route
              exact={true}
              path={CLIENT_URLS.MODERATOR.NEWS_DETAIL.route}
              component={NewsDetail}
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

export default compose(withAuth, withCountersData)(Moderator);
