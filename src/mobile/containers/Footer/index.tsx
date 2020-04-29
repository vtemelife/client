import React, { useContext } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { Navbar } from "react-bootstrap";

import { CountersContext } from "generic/containers/ContextProviders/CountersService";
import { AuthUserContext } from "generic/containers/ContextProviders/HeaderUserService";
import { CLIENT_URLS } from "mobile/routes/client";

const Footer: React.SFC<any> = () => {
  const location = useLocation();
  const countersData = useContext(CountersContext) || {
    counters: {}
  };
  const counters = countersData.counters || {
    u_clubs_requests: 0,
    u_friends_requests: 0,
    u_groups_requests: 0,
    u_events: 0,
    u_unread_news: 0,
    u_unread_chats: 0,
    u_notifications: 0
  };
  const userAuth = useContext(AuthUserContext);

  if (
    !userAuth.headerUser ||
    location.pathname.indexOf("/chat/detail/") !== -1 ||
    location.pathname.indexOf("/chat/conversation/create/") !== -1
  ) {
    return null;
  }

  counters.u_menu =
    counters.u_clubs_requests +
    counters.u_friends_requests +
    counters.u_groups_requests +
    counters.u_events;
  return (
    <div className="container-footer">
      <Navbar fixed="bottom" className="d-flex justify-content-center">
        <div className="flex-fill footer-item">
          <Link to={CLIENT_URLS.USER.NEWS_LIST.toPath()}>
            <i className="fa fa-newspaper-o fa-lg" />{" "}
            {counters.u_unread_news > 0 && counters.u_unread_news}
          </Link>
        </div>
        <div className="flex-fill footer-item">
          <Link to={CLIENT_URLS.SEARCH.toPath()}>
            <i className="fa fa-search fa-lg" />
          </Link>
        </div>
        <div className="flex-fill footer-item">
          <Link to={CLIENT_URLS.USER.CHAT_LIST.toPath()}>
            <i className="fa fa-comments fa-lg" />{" "}
            {counters.u_unread_chats > 0 && counters.u_unread_chats}
          </Link>
        </div>
        <div className="flex-fill footer-item">
          <Link to={CLIENT_URLS.USER.NOTIFICATIONS.toPath()}>
            <i className="fa fa-bell fa-lg" />{" "}
            {counters.u_notifications > 0 && counters.u_notifications}
          </Link>
        </div>
        <div className="flex-fill footer-item">
          <Link to={CLIENT_URLS.USER.MENU.toPath()}>
            <i className="fa fa-bars fa-lg" />{" "}
            {counters.u_menu > 0 && counters.u_menu}
          </Link>
        </div>
      </Navbar>
    </div>
  );
};

export default Footer;
