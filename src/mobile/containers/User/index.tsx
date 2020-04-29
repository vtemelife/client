import React from "react";
import { Route, Switch } from "react-router-dom";
import { RouteComponentProps } from "react-router";

import { CLIENT_URLS } from "mobile/routes/client";

import Desktop from "mobile/containers/User/Desktop";
import Menu from "mobile/containers/User/Menu";
import Profile from "mobile/containers/User/Profile";
import NewsList from "mobile/containers/User/NewsList";
import Search from "mobile/containers/User/Search";
import Notifications from "mobile/containers/User/Notifications";
import Settings from "mobile/containers/User/Settings";
import ChatList from "mobile/containers/User/ChatList";
import ChatDetail from "mobile/containers/User/ChatDetail";
import ChatCreate from "mobile/containers/User/ChatCreate";
import ChatUpdate from "mobile/containers/User/ChatUpdate";
import ChatConversationCreate from "mobile/containers/User/ChatConversationCreate";
import Friends from "mobile/containers/User/Friends";
import FriendsMyRequests from "mobile/containers/User/FriendsMyRequests";
import Participants from "mobile/containers/User/Participants";
import BlackList from "mobile/containers/User/BlackList";
import ClubList from "mobile/containers/User/ClubList";
import ClubCreate from "mobile/containers/User/ClubCreate";
import ClubUpdate from "mobile/containers/User/ClubUpdate";
import ClubDetail from "mobile/containers/User/ClubDetail";
import ClubMyRequests from "mobile/containers/User/ClubMyRequests";
import GroupList from "mobile/containers/User/GroupList";
import GroupCreate from "mobile/containers/User/GroupCreate";
import GroupUpdate from "mobile/containers/User/GroupUpdate";
import GroupDetail from "mobile/containers/User/GroupDetail";
import GroupMyRequests from "mobile/containers/User/GroupMyRequests";
import MediaFolderList from "mobile/containers/User/MediaFolderList";
import MediaFolderDetail from "mobile/containers/User/MediaFolderDetail";
import MediaFolderMediaDetail from "mobile/containers/User/MediaFolderMediaDetail";
import MediaFolderCreate from "mobile/containers/User/MediaFolderCreate";
import MediaFolderUpdate from "mobile/containers/User/MediaFolderUpdate";
import MediaCreate from "mobile/containers/User/MediaCreate";
import MediaUpdate from "mobile/containers/User/MediaUpdate";
import PartyList from "mobile/containers/User/PartyList";
import PartyCreate from "mobile/containers/User/PartyCreate";
import PartyUpdate from "mobile/containers/User/PartyUpdate";
import PartyDetail from "mobile/containers/User/PartyDetail";
import GameList from "mobile/containers/User/GameList";
import GameUpdate from "mobile/containers/User/GameUpdate";
import PostCreate from "mobile/containers/User/PostCreate";
import PostUpdate from "mobile/containers/User/PostUpdate";
import SitePostList from "mobile/containers/User/SitePostList";
import SitePostWhisperList from "mobile/containers/User/SitePostWhisperList";
import SiteMediaList from "mobile/containers/User/SiteMediaList";
import SiteMap from "mobile/containers/User/SiteMap";

const User: React.SFC<RouteComponentProps> = () => (
  <Switch>
    <Route
      exact={true}
      path={CLIENT_URLS.USER.MENU.routePath()}
      component={Menu}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.NEWS_LIST.routePath()}
      component={NewsList}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.SEARCH.routePath()}
      component={Search}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.NOTIFICATIONS.routePath()}
      component={Notifications}
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
      path={CLIENT_URLS.USER.CHAT_CREATE.routePath()}
      component={ChatCreate}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.CHAT_UPDATE.routePath()}
      component={ChatUpdate}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.CHAT_CONVERSATION_CREATE.routePath()}
      component={ChatConversationCreate}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.SETTINGS.routePath()}
      component={Settings}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.FRIEND_LIST.routePath()}
      component={Friends}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.FRIEND_REQUESTS.routePath()}
      component={FriendsMyRequests}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.PARTICIPANT_LIST.routePath()}
      component={Participants}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.BLACKLIST_LIST.routePath()}
      component={BlackList}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.CLUB_LIST.routePath()}
      component={ClubList}
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
      path={CLIENT_URLS.USER.CLUB_DETAIL.routePath()}
      component={ClubDetail}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.CLUB_REQUESTS.routePath()}
      component={ClubMyRequests}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.GROUP_LIST.routePath()}
      component={GroupList}
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
      path={CLIENT_URLS.USER.GROUP_DETAIL.routePath()}
      component={GroupDetail}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.GROUP_REQUESTS.routePath()}
      component={GroupMyRequests}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.MEDIA_FOLDER_LIST.routePath()}
      component={MediaFolderList}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.MEDIA_FOLDER_DETAIL.routePath()}
      component={MediaFolderDetail}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.MEDIA_FOLDER_DETAIL_MEDIA_DETAIL.routePath()}
      component={MediaFolderMediaDetail}
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
      path={CLIENT_URLS.USER.PARTY_LIST.routePath()}
      component={PartyList}
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
      path={CLIENT_URLS.USER.PARTY_DETAIL.routePath()}
      component={PartyDetail}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.GAME_LIST.routePath()}
      component={GameList}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.USER.GAME_UPDATE.routePath()}
      component={GameUpdate}
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
      path={CLIENT_URLS.POSTS.routePath()}
      component={SitePostList}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.WHISPER.routePath()}
      component={SitePostWhisperList}
    />
    <Route
      exact={true}
      path={CLIENT_URLS.MEDIA.routePath()}
      component={SiteMediaList}
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
    <Route path={CLIENT_URLS.USER.INDEX.routePath()} component={Desktop} />
  </Switch>
);

export default User;
