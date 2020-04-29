import React from "react";
import { Redirect } from "react-router";
import { CLIENT_URLS } from "desktop/routes/client";
import Alert from "react-bootstrap/Alert";
import { Col, Button, ButtonGroup } from "react-bootstrap";
import { ROLE_GUEST } from "generic/constants";
import { LinkContainer } from "react-router-bootstrap";
import { HeaderUserConsumer } from "generic/containers/ContextProviders/HeaderUserService";
import { _ } from "trans";

interface IPropsWrapper {
  error: any;
  size?: number;
}

interface IProps extends IPropsWrapper {
  headerUser: any;
  refetchHeaderUser: any;
}

class ResponseErrors extends React.PureComponent<IProps> {
  public render() {
    if (this.props.error.status === 401) {
      return (
        <Redirect
          to={{
            pathname: CLIENT_URLS.AUTH.SIGN_IN.buildPath()
          }}
        />
      );
    } else if (this.props.error.status === 403) {
      return (
        <Col lg={this.props.size || 10}>
          <br />
          <Alert variant="danger">У вас нет доступа к разделу.</Alert>
          {this.props.headerUser.role === ROLE_GUEST ? (
            <Alert dismissible={true} variant="danger">
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
              <div className="d-flex">
                <ButtonGroup vertical={true}>
                  <LinkContainer to={CLIENT_URLS.USER.SETTINGS.buildPath()}>
                    <Button size="sm">
                      <i className="fa fa-cogs" /> {_("Change profile")}
                    </Button>
                  </LinkContainer>
                  <LinkContainer
                    to={CLIENT_URLS.USER.CHAT_WITH_MODERATORS_CREATE.buildPath()}
                  >
                    <Button size="sm" variant="danger">
                      <i className="fa fa-comment" /> {_("Chat with support")}
                    </Button>
                  </LinkContainer>
                </ButtonGroup>
              </div>
            </Alert>
          ) : null}
        </Col>
      );
    } else {
      return "-";
    }
  }
}

const ResponseErrorsWrapper: React.FC<IPropsWrapper> = props => (
  <HeaderUserConsumer>
    {contextHeaderUser =>
      contextHeaderUser && (
        <ResponseErrors
          {...props}
          headerUser={contextHeaderUser.headerUser}
          refetchHeaderUser={contextHeaderUser.refetchHeaderUser}
        />
      )
    }
  </HeaderUserConsumer>
);

export default ResponseErrorsWrapper;
