import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

import NewsDetail from 'desktop/containers/User/NewsDetail';
import ChatWithModeratorsCreate from 'desktop/containers/User/ChatWithModeratorsCreate';
import GroupDetailRequests from 'desktop/containers/User/GroupDetail/GroupDetailRequests';
import ClubDetailRequests from 'desktop/containers/User/ClubDetail/ClubDetailRequests';
import GameDetail from 'desktop/containers/User/GameDetail';
import GamePlay from 'desktop/containers/User/GamePlay';
import PostDetail from 'desktop/containers/PostDetail';

import { CLIENT_URLS } from 'mobile/routes/client';
import Header from 'mobile/containers/Header';

const Desktop: React.SFC<RouteComponentProps> = () => (
  <>
    <Header />
    <Switch>
      <Route
        exact={true}
        path={CLIENT_URLS.USER.NEWS_DETAIL.route}
        component={NewsDetail}
      />
      <Route
        exact={true}
        path={CLIENT_URLS.USER.CHAT_WITH_MODERATORS_CREATE.route}
        component={ChatWithModeratorsCreate}
      />
      <Route
        exact={true}
        path={CLIENT_URLS.USER.GROUP_DETAIL_REQUESTS.route}
        component={GroupDetailRequests}
      />
      <Route
        exact={true}
        path={CLIENT_URLS.USER.CLUB_DETAIL_REQUESTS.route}
        component={ClubDetailRequests}
      />
      <Route
        exact={true}
        path={CLIENT_URLS.USER.GAME_DETAIL.route}
        component={GameDetail}
      />
      <Route path={CLIENT_URLS.USER.GAME_PLAY.route} component={GamePlay} />
      <Route
        exact={true}
        path={CLIENT_URLS.POSTS_DETAIL.route}
        component={PostDetail}
      />
    </Switch>
  </>
);

export default Desktop;
