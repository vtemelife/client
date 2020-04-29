import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { CLIENT_URLS } from 'mobile/routes/client';
import Menu from 'mobile/containers/Moderator/Menu';
import Desktop from 'mobile/containers/Moderator/Desktop';

const Moderator: React.SFC<any> = () => (
  <Switch>
    <Route
      exact={true}
      path={CLIENT_URLS.MODERATOR.MENU.route}
      component={Menu}
    />
    <Route path={CLIENT_URLS.MODERATOR.INDEX.route} component={Desktop} />
  </Switch>
);

export default Moderator;
