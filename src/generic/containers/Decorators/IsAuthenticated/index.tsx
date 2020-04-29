import React from "react";
import Get from "restful-react";
import { Redirect } from "react-router-dom";
import { RouteComponentProps } from "react-router";

import { SERVER_URLS } from "routes/server";

interface IPropsWrapper extends RouteComponentProps {
  children: any;
  redirectPathname: string;
}

interface IProps extends IPropsWrapper {
  retrieveResponse: any;
  loading: boolean;
  error: any;
}

class IsAuthenticated extends React.PureComponent<IProps> {
  public render() {
    if (this.props.loading) {
      return null;
    }
    if (this.props.error) {
      return (
        <Redirect
          to={{
            pathname: this.props.redirectPathname,
            state: { next: this.props.location.pathname }
          }}
        />
      );
    }
    return React.Children.only(this.props.children);
  }
}

const IsAuthenticatedWrapper: React.FC<IPropsWrapper> = props => (
  <Get path={SERVER_URLS.SIGN_IN_VERIFY.buildPath()}>
    {(retrieveResponse, { loading, error }) => (
      <IsAuthenticated
        {...props}
        retrieveResponse={retrieveResponse}
        loading={loading}
        error={error}
      />
    )}
  </Get>
);

export default IsAuthenticatedWrapper;
