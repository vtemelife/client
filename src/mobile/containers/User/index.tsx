import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

import { CLIENT_URLS } from 'mobile/routes/client';

import Desktop from 'mobile/containers/User/Desktop';
import Menu from 'mobile/containers/User/Menu';
import Profile from 'mobile/containers/User/Profile';
import NewsList from 'mobile/containers/User/NewsList';
import Search from 'mobile/containers/User/Search';
import Notifications from 'mobile/containers/User/Notifications';
import Settings from 'mobile/containers/User/Settings';
import ChatList from 'mobile/containers/User/ChatList';
import ChatDetail from 'mobile/containers/User/ChatDetail';
import ChatCreate from 'mobile/containers/User/ChatCreate';
import ChatUpdate from 'mobile/containers/User/ChatUpdate';
import ChatConversationCreate from 'mobile/containers/User/ChatConversationCreate';
import Friends from 'mobile/containers/User/Friends';
import FriendsMyRequests from 'mobile/containers/User/FriendsMyRequests';
import Participants from 'mobile/containers/User/Participants';
import BlackList from 'mobile/containers/User/BlackList';
import ClubList from 'mobile/containers/User/ClubList';
import ClubCreate from 'mobile/containers/User/ClubCreate';
import ClubUpdate from 'mobile/containers/User/ClubUpdate';
import ClubDetail from 'mobile/containers/User/ClubDetail';
import ClubMyRequests from 'mobile/containers/User/ClubMyRequests';
import GroupList from 'mobile/containers/User/GroupList';
import GroupCreate from 'mobile/containers/User/GroupCreate';
import GroupUpdate from 'mobile/containers/User/GroupUpdate';
import GroupDetail from 'mobile/containers/User/GroupDetail';
import GroupMyRequests from 'mobile/containers/User/GroupMyRequests';
import MediaFolderList from 'mobile/containers/User/MediaFolderList';
import MediaFolderDetail from 'mobile/containers/User/MediaFolderDetail';
import MediaFolderMediaDetail from 'mobile/containers/User/MediaFolderMediaDetail';
import MediaFolderCreate from 'mobile/containers/User/MediaFolderCreate';
import MediaFolderUpdate from 'mobile/containers/User/MediaFolderUpdate';
import MediaCreate from 'mobile/containers/User/MediaCreate';
import MediaUpdate from 'mobile/containers/User/MediaUpdate';
import PartyList from 'mobile/containers/User/PartyList';
import PartyCreate from 'mobile/containers/User/PartyCreate';
import PartyUpdate from 'mobile/containers/User/PartyUpdate';
import PartyDetail from 'mobile/containers/User/PartyDetail';
import GameList from 'mobile/containers/User/GameList';
import GameUpdate from 'mobile/containers/User/GameUpdate';
import PostCreate from 'mobile/containers/User/PostCreate';
import PostUpdate from 'mobile/containers/User/PostUpdate';
import SitePostList from 'mobile/containers/User/SitePostList';
import SitePostWhisperList from 'mobile/containers/User/SitePostWhisperList';
import SiteMediaList from 'mobile/containers/User/SiteMediaList';
import SiteMap from 'mobile/containers/User/SiteMap';

const User: React.SFC<RouteComponentProps> = () => (
  <Switch>
    <Route exact={true} path={CLIENT_URLS.USER.MENU.route} component={Menu} />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.NEWS_LIST.route}
      component={NewsList}
    />
    <Route exact={true} path={CLIENT_URLS.SEARCH.route} component={Search} />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.NOTIFICATIONS.route}
      component={Notifications}
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
      path={CLIENT_URLS.USER.CHAT_CREATE.route}
      component={ChatCreate}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.CHAT_UPDATE.route}
      component={ChatUpdate}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.CHAT_CONVERSATION_CREATE.route}
      component={ChatConversationCreate}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.SETTINGS.route}
      component={Settings}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.FRIEND_LIST.route}
      component={Friends}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.FRIEND_REQUESTS.route}
      component={FriendsMyRequests}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.PARTICIPANT_LIST.route}
      component={Participants}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.BLACKLIST_LIST.route}
      component={BlackList}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.CLUB_LIST.route}
      component={ClubList}
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
      path={CLIENT_URLS.USER.CLUB_DETAIL.route}
      component={ClubDetail}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.CLUB_REQUESTS.route}
      component={ClubMyRequests}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.GROUP_LIST.route}
      component={GroupList}
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
      path={CLIENT_URLS.USER.GROUP_DETAIL.route}
      component={GroupDetail}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.GROUP_REQUESTS.route}
      component={GroupMyRequests}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.MEDIA_FOLDER_LIST.route}
      component={MediaFolderList}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.MEDIA_FOLDER_DETAIL.route}
      component={MediaFolderDetail}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.MEDIA_FOLDER_DETAIL_MEDIA_DETAIL.route}
      component={MediaFolderMediaDetail}
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
      path={CLIENT_URLS.USER.PARTY_LIST.route}
      component={PartyList}
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
      path={CLIENT_URLS.USER.PARTY_DETAIL.route}
      component={PartyDetail}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.GAME_LIST.route}
      component={GameList}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.GAME_UPDATE.route}
      component={GameUpdate}
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
      path={CLIENT_URLS.POSTS.route}
      component={SitePostList}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.WHISPER.route}
      component={SitePostWhisperList}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.MEDIA.route}
      component={SiteMediaList}
    />
    <Route exact={true} path={CLIENT_URLS.MAP.route} component={SiteMap} />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.PROFILE.route}
      component={Profile}
    />
    <Route path={CLIENT_URLS.USER.INDEX.route} component={Desktop} />
  </Switch>
);

export default User;
