import React from "react";

import "desktop/layout/index.scss";

import { Route, Switch } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { YMaps } from "react-yandex-maps";

import IsAuthenticated from "generic/containers/Decorators/IsAuthenticated";

import Header from "desktop/containers/Header";
import SignIn from "desktop/containers/SignIn";
import SignUp from "desktop/containers/SignUp";
import SignUpFinish from "desktop/containers/SignUpFinish";
import ResetPassword from "desktop/containers/ResetPassword";
import ResetPasswordFinish from "desktop/containers/ResetPasswordFinish";
import User from "desktop/containers/User";
import Moderator from "desktop/containers/Moderator";
import SitePolicy from "generic/containers/SitePolicy";

import { CLIENT_URLS } from "desktop/routes/client";
import { getLocale } from "utils";

class Desktop extends React.Component {
  public render() {
    const locale = getLocale();
    const lang = locale === "en" ? "en_US" : "ru_RU";
    return (
      <YMaps query={{ lang }}>
        <Helmet titleTemplate="%s - vteme" defaultTitle="vteme">
          <meta name="description" content="vteme" />
          <body className="body-desktop" />
        </Helmet>
        <Header />
        <Switch>
          <Route
            exact={true}
            path={CLIENT_URLS.AUTH.SIGN_IN.routePath()}
            component={SignIn}
          />
          <Route
            exact={true}
            path={CLIENT_URLS.AUTH.SIGN_UP.routePath()}
            component={SignUp}
          />
          <Route
            exact={true}
            path={CLIENT_URLS.AUTH.SIGN_UP_FINISH.routePath()}
            component={SignUpFinish}
          />
          <Route
            exact={true}
            path={CLIENT_URLS.AUTH.RESET_PASSWORD.routePath()}
            component={ResetPassword}
          />
          <Route
            exact={true}
            path={CLIENT_URLS.AUTH.RESET_PASSWORD_FINISH.routePath()}
            component={ResetPasswordFinish}
          />
          <Route
            exact={true}
            path={CLIENT_URLS.SITE_POLICY.routePath()}
            component={SitePolicy}
          />
          <Route
            path={CLIENT_URLS.MODERATOR.INDEX.routePath()}
            render={props => (
              <IsAuthenticated
                redirectPathname={CLIENT_URLS.AUTH.SIGN_IN.buildPath()}
                {...props}
              >
                <Moderator {...props} />
              </IsAuthenticated>
            )}
          />
          <Route
            path={CLIENT_URLS.USER.INDEX.routePath()}
            render={props => (
              <IsAuthenticated
                redirectPathname={CLIENT_URLS.AUTH.SIGN_IN.buildPath()}
                {...props}
              >
                <User {...props} />
              </IsAuthenticated>
            )}
          />
        </Switch>
      </YMaps>
    );
  }
}

export default Desktop;
