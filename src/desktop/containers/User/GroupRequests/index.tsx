import React from "react";
import compose from "lodash/flowRight";
import { Card, Nav } from "react-bootstrap";
import { RouteComponentProps } from "react-router";
import { LinkContainer } from "react-router-bootstrap";

import { CLIENT_URLS } from "desktop/routes/client";

import FormSelect from "generic/components/Form/FormSelect";
import { getDisplayValue } from "utils";
import { REQUESTS, REQUEST_WAITING } from "generic/constants";
import BlockRequests from "desktop/components/BlockRequests";
import { _ } from "trans";
import { withAuthUser } from "generic/containers/Decorators";

interface IProps extends RouteComponentProps {
  match: any;
  authUser: any;
}

class GroupRequests extends React.PureComponent<IProps> {
  public renderTitle = (getParams: any) => {
    return _("My requests");
  };

  public renderFilters = (getParams: any, onChangeGetParams: any) => {
    const user = this.props.authUser.user;
    return (
      <>
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="fa fa-bars" /> {_("Menu")}
            </Card.Title>
            <Nav className="flex-column">
              <LinkContainer
                to={CLIENT_URLS.USER.GROUP_LIST.buildPath(undefined, {
                  getParams: { is_participant: true }
                })}
              >
                <Nav.Link>
                  <i className="fa fa-users" /> {_("Groups")}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={CLIENT_URLS.USER.GROUP_LIST.buildPath(undefined, {
                  getParams: { is_participant: false }
                })}
              >
                <Nav.Link>
                  <i className="fa fa-search" /> {_("Search")}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={CLIENT_URLS.USER.GROUP_REQUESTS.buildPath(undefined, {
                  getParams: { status: REQUEST_WAITING, user: user.pk }
                })}
              >
                <Nav.Link>
                  <i className="fa fa-list-ol" /> {_("Requests")}
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="fa fa-filter" /> {_("Filters")}
            </Card.Title>
            <FormSelect
              label={_("Request status")}
              name="status"
              isClearable={true}
              options={REQUESTS}
              value={
                getParams.status
                  ? {
                      value: getParams.status,
                      display: getDisplayValue(getParams.status, REQUESTS)
                    }
                  : null
              }
              onChange={(target: any) =>
                onChangeGetParams({
                  status: target.value ? target.value.value : undefined
                })
              }
            />
          </Card.Body>
        </Card>
      </>
    );
  };

  public render() {
    return (
      <BlockRequests
        contentType="groups:group"
        renderTitle={this.renderTitle}
        renderFilters={this.renderFilters}
        size={10}
      />
    );
  }
}

const withAuth = withAuthUser({
  propName: "authUser"
});

export default compose(withAuth)(GroupRequests);
