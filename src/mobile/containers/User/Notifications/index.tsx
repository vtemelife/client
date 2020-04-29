import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Nav, Badge, Alert } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { CountersContext } from "generic/containers/ContextProviders/CountersService";
import Header from "mobile/containers/Header";

import { _ } from "trans";
import { CLIENT_URLS } from "mobile/routes/client";

const Notifications: React.SFC<any> = () => {
  const countersData = useContext(CountersContext) || {
    counters: {
      u_unread_news: 0,
      u_friends_requests: 0,
      u_clubs_requests: 0,
      u_groups_requests: 0,
      u_events: 0
    }
  };
  const counters = countersData.counters;
  return (
    <div className="container-notifications">
      <Helmet>
        <title>{_("Notifications")}</title>
        <meta name="description" content={_("Notifications")} />
      </Helmet>
      <Header name={_("Notifications")} />
      {counters.u_unread_news === 0 &&
      counters.u_friends_requests === 0 &&
      counters.u_clubs_requests === 0 &&
      counters.u_groups_requests === 0 &&
      counters.u_events === 0 ? (
        <Alert variant="warning">
          <div>{_("No notifications.")}</div>
        </Alert>
      ) : (
        <div className="block">
          <Nav className="flex-column">
            {counters.u_unread_news > 0 && (
              <LinkContainer to={CLIENT_URLS.USER.NEWS_LIST.toPath()}>
                <Nav.Link className="black-link">
                  <i className="fa fa-newspaper-o" /> {_("News")}{" "}
                  <Badge variant="primary">{counters.u_unread_news}</Badge>
                </Nav.Link>
              </LinkContainer>
            )}
            {counters.u_friends_requests > 0 && (
              <LinkContainer to={CLIENT_URLS.USER.FRIEND_REQUESTS.toPath()}>
                <Nav.Link className="black-link">
                  <i className="fa fa-users" /> {_("Friends")}{" "}
                  <Badge variant="primary">{counters.u_friends_requests}</Badge>
                </Nav.Link>
              </LinkContainer>
            )}
            {counters.u_clubs_requests > 0 && (
              <LinkContainer to={CLIENT_URLS.USER.CLUB_LIST.toPath()}>
                <Nav.Link className="black-link">
                  <i className="fa fa-venus-mars" /> {_("Clubs")}{" "}
                  <Badge variant="primary">{counters.u_clubs_requests}</Badge>
                </Nav.Link>
              </LinkContainer>
            )}
            {counters.u_groups_requests > 0 && (
              <LinkContainer to={CLIENT_URLS.USER.GROUP_LIST.toPath()}>
                <Nav.Link className="black-link">
                  <i className="fa fa-copy" /> {_("Groups")}{" "}
                  <Badge variant="primary">{counters.u_groups_requests}</Badge>
                </Nav.Link>
              </LinkContainer>
            )}
            {counters.u_events > 0 && (
              <LinkContainer to={CLIENT_URLS.USER.PARTY_LIST.toPath()}>
                <Nav.Link className="black-link">
                  <i className="fa fa-calendar" /> {_("Parties")}{" "}
                  <Badge variant="primary">{counters.u_events}</Badge>
                </Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </div>
      )}
    </div>
  );
};

export default Notifications;
