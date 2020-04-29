import React, { useContext } from "react";
import { Alert, Button } from "react-bootstrap";
import hoistNonReactStatics from "hoist-non-react-statics";

import { _ } from "trans";
import { ROLE_GUEST } from "generic/constants";
import { AuthUserContext } from "generic/containers/ContextProviders/HeaderUserService";
import { LinkContainer } from "react-router-bootstrap";
import { CLIENT_URLS } from "desktop/routes/client";

export const GuestAlert: React.SFC<any> = ({ children }) => {
  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {};
  if (user.role === ROLE_GUEST) {
    return (
      <Alert variant="danger">
        <div>
          {_(
            "You have 'Guest' role on the site. You can not see list of groups, clubs, parties."
          )}
          <hr />
          {_(
            "Complete your profile and get 'Member' role. Provide the avatar and 'About me' information."
          )}
        </div>
        <hr />
        <div className="d-flex justify-content-between">
          <LinkContainer to={CLIENT_URLS.USER.SETTINGS.buildPath()}>
            <Button size="sm">
              <i className="fa fa-cogs" /> {_("Change profile")}
            </Button>
          </LinkContainer>
          <LinkContainer
            to={CLIENT_URLS.USER.CHAT_WITH_MODERATORS_CREATE.buildPath()}
          >
            <Button size="sm" variant="danger">
              <i className="fa fa-comment" /> {_("Write to support")}
            </Button>
          </LinkContainer>
        </div>
      </Alert>
    );
  }

  return children;
};

export const withGuestAlert = (WrappedComponent: any) => {
  class WithRestWrapper extends React.Component<any, any> {
    public render() {
      return (
        <GuestAlert>
          <WrappedComponent {...this.props} />
        </GuestAlert>
      );
    }
  }
  return hoistNonReactStatics(WithRestWrapper, WrappedComponent);
};
