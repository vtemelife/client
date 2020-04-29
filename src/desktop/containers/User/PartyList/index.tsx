import React from "react";
import compose from "lodash/flowRight";
import { Card, Nav, Alert, ButtonGroup, Button } from "react-bootstrap";
import { RouteComponentProps } from "react-router";

import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import FormAsyncSelect from "generic/components/Form/FormAsyncSelect";
import { _ } from "trans";
import { withAuthUser } from "generic/containers/Decorators";
import FormSelect from "generic/components/Form/FormSelect";
import { COMMUNITY_THEMES } from "generic/constants";
import { getDisplayValue } from "utils";
import { LinkContainer } from "react-router-bootstrap";

import BlockParties from "desktop/components/BlockParties";

interface IProps extends RouteComponentProps {
  match: any;
  authUser: any;
}

class PartyList extends React.PureComponent<IProps> {
  public renderTitle = (getParams: any) => {
    if (getParams.is_participant === "true") {
      return _("My parties");
    }
    if (getParams.is_past === "true") {
      return _("Past parties");
    }
    return _("Search a party");
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
                to={CLIENT_URLS.USER.PARTY_LIST.buildPath(undefined, {
                  getParams: {
                    is_participant: false,
                    is_past: false,
                    city__region: user.city.region.pk
                  }
                })}
              >
                <Nav.Link>
                  <i className="fa fa-search" /> {_("Search")}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={CLIENT_URLS.USER.PARTY_LIST.buildPath(undefined, {
                  getParams: { is_participant: true, is_past: false }
                })}
              >
                <Nav.Link>
                  <i className="fa fa-list" /> {_("My parties")}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={CLIENT_URLS.USER.PARTY_LIST.buildPath(undefined, {
                  getParams: {
                    is_participant: false,
                    city__region: user.city.region.pk,
                    is_past: true
                  }
                })}
              >
                <Nav.Link>
                  <i className="fa fa-step-backward" /> {_("Past parties")}
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Card.Body>
        </Card>
        {getParams.is_participant !== "true" ? (
          <Card>
            <Card.Body>
              <Card.Title>
                <i className="fa fa-filter" /> {_("Filters")}
              </Card.Title>
              <FormAsyncSelect
                label={_("Country")}
                placeholder={_("Start typing...")}
                name="city__country"
                defaultValue={
                  user.city && user.city.country
                    ? {
                        pk: user.city.country.pk,
                        name: user.city.country.name
                      }
                    : null
                }
                onChange={(target: any) =>
                  onChangeGetParams({
                    city__country: target.value ? target.value.pk : undefined
                  })
                }
                fetchURL={SERVER_URLS.SELECTS.COUNTRY.buildPath()}
              />
              <FormAsyncSelect
                label={_("Region/State")}
                placeholder={_("Start typing...")}
                name="city__region"
                defaultValue={
                  user.city && user.city.region
                    ? {
                        pk: user.city.region.pk,
                        name: user.city.region.name
                      }
                    : null
                }
                onChange={(target: any) =>
                  onChangeGetParams({
                    city__region: target.value ? target.value.pk : undefined
                  })
                }
                fetchURL={SERVER_URLS.SELECTS.REGION.buildPath()}
                filterURL={`country=${
                  getParams.city__country
                    ? getParams.city__country
                    : user.city.country.pk
                }`}
              />
              <FormAsyncSelect
                label={_("City")}
                placeholder={_("Start typing...")}
                name="city"
                onChange={(target: any) =>
                  onChangeGetParams({
                    city: target.value ? target.value.pk : undefined
                  })
                }
                fetchURL={SERVER_URLS.SELECTS.CITY.buildPath()}
                filterURL={`region=${
                  getParams.city__region
                    ? getParams.city__region
                    : user.city.region.pk
                }`}
              />
              <hr />
              <FormSelect
                label={_("Theme")}
                placeholder={_("Start typing...")}
                name="thema"
                isClearable={true}
                options={COMMUNITY_THEMES}
                value={
                  getParams.theme
                    ? {
                        value: getParams.theme,
                        display: getDisplayValue(
                          getParams.theme,
                          COMMUNITY_THEMES
                        )
                      }
                    : null
                }
                onChange={(target: any) =>
                  onChangeGetParams({
                    theme: target.value ? target.value.value : undefined
                  })
                }
              />
            </Card.Body>
          </Card>
        ) : null}
      </>
    );
  };

  public renderNoItems = (getParams: any) => {
    if (getParams.is_participant === "false") {
      return "-";
    }
    const user = this.props.authUser.user;
    return (
      <Alert variant="warning">
        <div>
          {_(
            "You don't have parties. The search displays open parties of all clubs and closed parties in the clubs where you are a participant."
          )}
        </div>
        <hr />
        <div className="d-flex">
          <ButtonGroup vertical={true}>
            <LinkContainer
              to={CLIENT_URLS.USER.PARTY_LIST.buildPath(undefined, {
                getParams: {
                  is_participant: false,
                  city__region: user.city.region.pk
                }
              })}
            >
              <Button size="sm" variant="warning">
                <i className="fa fa-search" /> {_("Search a party")}
              </Button>
            </LinkContainer>
          </ButtonGroup>
        </div>
      </Alert>
    );
  };

  public render() {
    return (
      <BlockParties
        renderTitle={this.renderTitle}
        renderFilters={this.renderFilters}
        renderNoItems={this.renderNoItems}
        isReadonly={true}
      />
    );
  }
}

const withAuth = withAuthUser({
  propName: "authUser"
});

export default compose(withAuth)(PartyList);
