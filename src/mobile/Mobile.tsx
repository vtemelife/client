import React, { useEffect } from 'react';

import 'mobile/layout/index.scss';

import { Route, Switch, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { YMaps } from 'react-yandex-maps';

import IsAuthenticated from 'generic/containers/Decorators/IsAuthenticated';

import Footer from 'mobile/containers/Footer';
import Auth from 'mobile/containers/Auth';
import User from 'mobile/containers/User';
import Moderator from 'mobile/containers/Moderator';
import SitePolicy from 'generic/containers/SitePolicy';
import { getLocale } from 'utils';

import { CLIENT_URLS } from 'mobile/routes/client';

const Mobile = () => {
  useEffect(() => {
    const w = window as any;
    w.onscroll = () => {
      if (w.ReactNativeWebView) {
        // TODO: fix modals scrolls
        w.ReactNativeWebView.postMessage(
          JSON.stringify({
            eventType: 'refreshPage',
            data: {
              refreshPage: document.documentElement.scrollTop === 0,
            },
          }),
        );
      }
    };
  }, []);
  const locale = getLocale();
  const lang = locale === 'en' ? 'en_US' : 'ru_RU';
  return (
    <YMaps query={{ lang }}>
      <Helmet titleTemplate="%s - vteme" defaultTitle="vteme">
        <body className="body-mobile" />
      </Helmet>
      <Switch>
        <Route
          exact={true}
          path={CLIENT_URLS.INDEX.route}
          render={() => (
            <Redirect to={CLIENT_URLS.USER.NEWS_LIST.buildPath()} />
          )}
        />
        <Route path={CLIENT_URLS.AUTH.INDEX.route} component={Auth} />
        <Route
          exact={true}
          path={CLIENT_URLS.SITE_POLICY.route}
          component={SitePolicy}
        />
        <Route
          path={CLIENT_URLS.MODERATOR.INDEX.route}
          render={(props) => (
            <IsAuthenticated
              redirectPathname={CLIENT_URLS.AUTH.SIGN_IN.buildPath()}
              {...props}
            >
              <Moderator {...props} />
            </IsAuthenticated>
          )}
        />
        <Route
          path={CLIENT_URLS.USER.INDEX.route}
          render={(props) => (
            <IsAuthenticated
              redirectPathname={CLIENT_URLS.AUTH.SIGN_IN.buildPath()}
              {...props}
            >
              <User {...props} />
            </IsAuthenticated>
          )}
        />
      </Switch>
      <Footer />
    </YMaps>
  );
};

export default Mobile;
