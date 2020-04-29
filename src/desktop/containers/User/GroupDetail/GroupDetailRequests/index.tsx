import React from "react";
import { Card, Nav } from "react-bootstrap";
import { RouteComponentProps } from "react-router";
import { LinkContainer } from "react-router-bootstrap";

import { CLIENT_URLS } from "desktop/routes/client";

import FormSelect from "generic/components/Form/FormSelect";
import { getDisplayValue } from "utils";
import { REQUESTS } from "generic/constants";
import BlockRequests from "desktop/components/BlockRequests";
import { _ } from "trans";

interface IProps extends RouteComponentProps {
  match: any;
}

class GroupDetailRequests extends React.PureComponent<IProps> {
  public renderTitle = (getParams: any) => {
    return "Заявки в группу";
  };

  public renderFilters = (getParams: any, onChangeGetParams: any) => {
    return (
      <>
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="fa fa-bars" /> {_("Menu")}
            </Card.Title>
            <Nav className="flex-column">
              <LinkContainer
                to={CLIENT_URLS.USER.GROUP_DETAIL.buildPath({
                  groupSlug: this.props.match.params.groupSlug
                })}
              >
                <Nav.Link>
                  <i className="fa fa-arrow-left" /> {_("Go back")}
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

export default GroupDetailRequests;
