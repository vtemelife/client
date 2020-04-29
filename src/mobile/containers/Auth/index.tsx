import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useLocation } from 'react-router';

import SignIn from 'desktop/containers/SignIn';
import SignUp from 'desktop/containers/SignUp';
import SignUpFinish from 'desktop/containers/SignUpFinish';
import ResetPassword from 'desktop/containers/ResetPassword';
import ResetPasswordFinish from 'desktop/containers/ResetPasswordFinish';

import Header from 'mobile/containers/Header';

import { CLIENT_URLS } from 'mobile/routes/client';
import { getLocale, changeLocale } from 'utils';
import { OverlayTrigger, Popover, ListGroup } from 'react-bootstrap';

const Auth: React.SFC<any> = () => {
  const location = useLocation();
  const locale = getLocale();
  const code2 = locale === 'en' ? 'gb' : locale;
  return (
    <>
      <Header fixed={true}>
        <div>
          <OverlayTrigger
            trigger="click"
            rootClose={true}
            placement="left"
            overlay={
              <Popover id="popover-basic">
                <Popover.Content>
                  <ListGroup variant="flush">
                    <ListGroup.Item
                      onClick={() => changeLocale('ru', location.pathname)}
                    >
                      <span className="flag-icon flag-icon-ru" />
                    </ListGroup.Item>
                    <ListGroup.Item
                      onClick={() => changeLocale('en', location.pathname)}
                    >
                      <span className="flag-icon flag-icon-gb" />
                    </ListGroup.Item>
                  </ListGroup>
                </Popover.Content>
              </Popover>
            }
          >
            <span className={`flag-icon flag-icon-${code2}`} />
          </OverlayTrigger>
        </div>
      </Header>
      <Switch>
        <Route
          exact={true}
          path={CLIENT_URLS.AUTH.SIGN_IN.route}
          component={SignIn}
        />
        <Route
          exact={true}
          path={CLIENT_URLS.AUTH.SIGN_UP.route}
          component={SignUp}
        />
        <Route
          exact={true}
          path={CLIENT_URLS.AUTH.SIGN_UP_FINISH.route}
          component={SignUpFinish}
        />
        <Route
          exact={true}
          path={CLIENT_URLS.AUTH.RESET_PASSWORD.route}
          component={ResetPassword}
        />
        <Route
          exact={true}
          path={CLIENT_URLS.AUTH.RESET_PASSWORD_FINISH.route}
          component={ResetPasswordFinish}
        />
      </Switch>
    </>
  );
};

export default Auth;
