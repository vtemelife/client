import React from "react";
import { useLocation } from "react-router";
import { Route, Switch, Link } from "react-router-dom";
import { Tab, Row, Col, Nav } from "react-bootstrap";

import { CLIENT_URLS } from "desktop/routes/client";

import { _ } from "trans";
import Profile from "./Profile";
import Password from "./Password";
import RemoveProfile from "./RemoveProfile";

const Settings = () => {
  const location = useLocation();
  return (
    <Col lg={10}>
      <Tab.Container id="settings-nav" defaultActiveKey="profile">
        <Row>
          <Col lg={9}>
            <Switch>
              <Route
                exact={true}
                path={CLIENT_URLS.USER.SETTINGS_PROFILE.routePath()}
                component={Profile}
              />
              <Route
                exact={true}
                path={CLIENT_URLS.USER.SETTINGS_PASSWORD.routePath()}
                component={Password}
              />
              <Route
                exact={true}
                path={CLIENT_URLS.USER.SETTINGS_REMOVE.routePath()}
                component={RemoveProfile}
              />
            </Switch>
          </Col>
          <Col lg={3}>
            <br />
            <Nav className="flex-column settings-menu">
              <Nav.Item>
                <Nav.Link
                  active={
                    CLIENT_URLS.USER.SETTINGS_PROFILE.toPath() ===
                    location.pathname
                  }
                  as={Link}
                  to={CLIENT_URLS.USER.SETTINGS_PROFILE.toPath()}
                >
                  {_("Profile")}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  active={
                    CLIENT_URLS.USER.SETTINGS_PASSWORD.toPath() ===
                    location.pathname
                  }
                  as={Link}
                  to={CLIENT_URLS.USER.SETTINGS_PASSWORD.toPath()}
                >
                  {_("Password")}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  active={
                    CLIENT_URLS.USER.SETTINGS_REMOVE.toPath() ===
                    location.pathname
                  }
                  as={Link}
                  to={CLIENT_URLS.USER.SETTINGS_REMOVE.toPath()}
                >
                  {_("Remove profile")}
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
      </Tab.Container>
    </Col>
  );
};

export default Settings;
