import React from 'react';
import { useLocation } from 'react-router';
import { Route, Switch, Link } from 'react-router-dom';
import { Tab, Row, Col, Nav } from 'react-bootstrap';

import { CLIENT_URLS } from 'desktop/routes/client';

import { _ } from 'trans';
import Profile from './Profile';
import Password from './Password';
import RemoveProfile from './RemoveProfile';

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
                path={CLIENT_URLS.USER.SETTINGS_PROFILE.route}
                component={Profile}
              />
              <Route
                exact={true}
                path={CLIENT_URLS.USER.SETTINGS_PASSWORD.route}
                component={Password}
              />
              <Route
                exact={true}
                path={CLIENT_URLS.USER.SETTINGS_REMOVE.route}
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
                    CLIENT_URLS.USER.SETTINGS_PROFILE.buildPath() ===
                    location.pathname
                  }
                  as={Link}
                  to={CLIENT_URLS.USER.SETTINGS_PROFILE.buildPath()}
                >
                  {_('Profile')}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  active={
                    CLIENT_URLS.USER.SETTINGS_PASSWORD.buildPath() ===
                    location.pathname
                  }
                  as={Link}
                  to={CLIENT_URLS.USER.SETTINGS_PASSWORD.buildPath()}
                >
                  {_('Password')}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  active={
                    CLIENT_URLS.USER.SETTINGS_REMOVE.buildPath() ===
                    location.pathname
                  }
                  as={Link}
                  to={CLIENT_URLS.USER.SETTINGS_REMOVE.buildPath()}
                >
                  {_('Remove profile')}
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
