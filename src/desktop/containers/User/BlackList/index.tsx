import React from "react";
import compose from "lodash/flowRight";
import { Card, Nav, Badge, Col, Media, Row, Button } from "react-bootstrap";
import { RouteComponentProps } from "react-router";
import { LinkContainer } from "react-router-bootstrap";

import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";

import Image from "generic/components/Image";
import userSVG from "generic/layout/images/user.svg";
import { withAuthUser, withCounters } from "generic/containers/Decorators";
import { _ } from "trans";
import List from "desktop/containers/Generics/List";
import { Link } from "react-router-dom";
import { REQUEST_WAITING } from "generic/constants";
import { Mutate } from "restful-react";
import { toast } from "react-toastify";
import handleErrors from "desktop/components/ResponseErrors/utils";
import { confirmAlert } from "react-confirm-alert";

interface IPropsWrapper extends RouteComponentProps {
  match: any;
}

interface IProps extends IPropsWrapper {
  counters: any;
  authUser: any;
}

class BlackList extends React.PureComponent<IProps> {
  public renderTitle = (getParams: any) => {
    return _("Black list");
  };

  public renderItem = (item: any, getParams: any, refetch: any) => {
    const user = item.user;
    return (
      <Col lg={12} className="block-request-user-item-container">
        <Media>
          <Link
            to={CLIENT_URLS.USER.PROFILE.buildPath({ userSlug: user.slug })}
          >
            {user.avatar && user.avatar.thumbnail_100x100 ? (
              <Image
                width={50}
                height={50}
                className="mr-3"
                src={user.avatar.thumbnail_100x100}
                roundedCircle={true}
              />
            ) : (
              <Image
                width={50}
                height={50}
                className="mr-3"
                src={userSVG}
                roundedCircle={true}
              />
            )}
          </Link>
          <Media.Body>
            <Row className="block-request-user-item-data">
              <Col lg={6}>
                <Link
                  target="_blank"
                  to={CLIENT_URLS.USER.PROFILE.buildPath({
                    userSlug: user.slug
                  })}
                >
                  <span className="text-break">
                    <i className="text-error fa fa-ban" />{" "}
                    {user.online ? <i className="fa fa-circle" /> : null}{" "}
                    {user.name}
                  </span>
                </Link>
                <span className="text-break block-request-user-item-geo">
                  <i className="fa fa-map-marker-alt" />{" "}
                  {user.city.country ? user.city.country.name : ""}
                  {user.city.country && user.city ? ", " : ""}
                  {user.city ? user.city.name : ""}
                </span>
              </Col>
              <Col lg={6} className="block-request-user-item-actions">
                <Mutate
                  verb="PATCH"
                  path={SERVER_URLS.BLACKLIST_DELETE.buildPath({
                    blacklistPk: item.pk
                  })}
                >
                  {removeFromBlackList => (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        confirmAlert({
                          title: _("Are you sure?"),
                          message: _(
                            "Are you sure you want to delete the user from black list?"
                          ),
                          buttons: [
                            {
                              label: _("Yes"),
                              onClick: () => {
                                removeFromBlackList({})
                                  .then((result: any) => {
                                    toast.success(
                                      _(
                                        "The user has been removed from your black list."
                                      )
                                    );
                                    refetch();
                                  })
                                  .catch((errors: any) => {
                                    handleErrors(errors);
                                  });
                              }
                            },
                            {
                              label: _("No"),
                              onClick: () => {
                                return;
                              }
                            }
                          ]
                        });
                      }}
                    >
                      <i className="fa fa-trash" />
                    </Button>
                  )}
                </Mutate>
              </Col>
            </Row>
            <hr />
          </Media.Body>
        </Media>
      </Col>
    );
  };

  public renderFilters = (getParams: any, onChangeGetParams: any) => {
    const user = this.props.authUser.user;
    const counters = this.props.counters.counters;
    return (
      <>
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="fa fa-users" /> {_("Friends")}
            </Card.Title>
            <Nav className="flex-column">
              <LinkContainer to={CLIENT_URLS.USER.FRIEND_LIST.buildPath()}>
                <Nav.Link>{_("Friends")}</Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={CLIENT_URLS.USER.FRIEND_LIST.buildPath(undefined, {
                  getParams: { is_online: "true" }
                })}
              >
                <Nav.Link>{_("Online")}</Nav.Link>
              </LinkContainer>
            </Nav>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="fa fa-list" /> {_("Requests")}
            </Card.Title>
            <Nav className="flex-column">
              <LinkContainer
                to={CLIENT_URLS.USER.FRIEND_REQUESTS.buildPath(undefined, {
                  getParams: { user: user.pk, status: REQUEST_WAITING }
                })}
              >
                <Nav.Link>
                  {_("My requests")}{" "}
                  {counters.u_friends_requests_mine > 0 ? (
                    <Badge variant="primary">
                      {counters.u_friends_requests_mine}
                    </Badge>
                  ) : null}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={CLIENT_URLS.USER.FRIEND_REQUESTS.buildPath(undefined, {
                  getParams: { object_id: user.pk, status: REQUEST_WAITING }
                })}
              >
                <Nav.Link>
                  {_("Users requests")}{" "}
                  {counters.u_friends_requests > 0 ? (
                    <Badge variant="primary">
                      {counters.u_friends_requests}
                    </Badge>
                  ) : null}
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Nav className="flex-column">
              <LinkContainer to={CLIENT_URLS.USER.BLACKLIST_LIST.buildPath()}>
                <Nav.Link>
                  <i className="fa fa-deaf" /> {_("Black list")}
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Card.Body>
        </Card>
      </>
    );
  };

  public render() {
    return (
      <List
        listClientPath={this.props.location.pathname}
        listServerPath={SERVER_URLS.BLACKLIST_LIST}
        renderTitle={this.renderTitle}
        renderItem={this.renderItem}
        renderFilters={this.renderFilters}
        searchLabel="search_blacklist"
        size={10}
      />
    );
  }
}

const withAuth = withAuthUser({
  propName: "authUser"
});

const withCountersData = withCounters({
  propName: "counters"
});

export default compose(withAuth, withCountersData)(BlackList);
