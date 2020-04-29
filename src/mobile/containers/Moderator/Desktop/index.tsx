import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ChatList from 'desktop/containers/Moderator/ChatList';
import UserList from 'desktop/containers/Moderator/UserList';
import ClubList from 'desktop/containers/Moderator/ClubList';
import PartyList from 'desktop/containers/Moderator/PartyList';
import PostList from 'desktop/containers/Moderator/PostList';
import MediaList from 'desktop/containers/Moderator/MediaList';
import NewsList from 'desktop/containers/Moderator/NewsList';
import NewsCreate from 'desktop/containers/Moderator/NewsCreate';
import NewsUpdate from 'desktop/containers/Moderator/NewsUpdate';
import NewsDetail from 'desktop/containers/Moderator/NewsDetail';

import { CLIENT_URLS } from 'mobile/routes/client';
import Header from 'mobile/containers/Header';

const Desktop: React.SFC<any> = () => (
  <>
    <Header />
    <Switch>
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
  </>
);

export default Desktop;
