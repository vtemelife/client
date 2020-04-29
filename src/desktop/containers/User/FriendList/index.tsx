import React from "react";
import compose from "lodash/flowRight";
import { Card, Nav, Button, Badge, Media, Row, Col } from "react-bootstrap";
import { RouteComponentProps } from "react-router";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";

import Image from "generic/components/Image";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";

import userSVG from "generic/layout/images/user.svg";
import List from "desktop/containers/Generics/List";
import Delete from "desktop/containers/Generics/Delete";
import { REQUEST_WAITING } from "generic/constants";
import { _ } from "trans";
import { withAuthUser, withCounters } from "generic/containers/Decorators";

interface IProps extends RouteComponentProps {
  match: any;
  counters: any;
  authUser: any;
}

class FriendList extends React.PureComponent<IProps> {
  public onDeleteSuccess = (result: any, refetch: any) => {
    refetch();
  };

  public generateListServerPath = (listServerPath: any, params: any) => {
    return listServerPath.buildPath(undefined, params);
  };

  public renderTitle = (getParams: any) => {
    if (getParams.is_online === "true") {
      return _("Online");
    }
    return _("Friends");
  };

  public renderItem = (item: any, getParams: any, refetch: any) => {
    const user = item;
    return (
      <Col lg={12} className="friends-item-container">
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
            <Row className="friends-item-data">
              <Col lg={6}>
                <Link
                  to={CLIENT_URLS.USER.PROFILE.buildPath({
                    userSlug: user.slug
                  })}
                >
                  <span className="text-break">
                    {user.online ? <i className="fa fa-circle" /> : null}{" "}
                    {user.name}
                  </span>
                </Link>
                <span className="text-break friends-item-geo">
                  <i className="fa fa-map-marker-alt" />{" "}
                  {user.city.country ? user.city.country.name : ""}
                  {user.city.country && user.city ? ", " : ""}
                  {user.city ? user.city.name : ""}
                </span>
              </Col>
              <Col lg={6} className="friends-item-actions">
                <LinkContainer
                  to={
                    user.chat
                      ? CLIENT_URLS.USER.CHAT_DETAIL.buildPath({
                          chatPk: user.chat
                        })
                      : CLIENT_URLS.USER.CHAT_CONVERSATION_CREATE.buildPath({
                          recipientSlug: user.slug
                        })
                  }
                >
                  <Button size="sm">
                    <i className="fa fa-paper-plane" />
                  </Button>
                </LinkContainer>
                <Delete
                  title={_("Are you sure?")}
                  description={_(
                    "Are you sure you want to delete the user from friends?"
                  )}
                  onSuccess={(result: any) =>
                    this.onDeleteSuccess(result, refetch)
                  }
                  destoryServerPath={SERVER_URLS.FRIENDS_DELETE.buildPath({
                    userSlug: item.slug
                  })}
                >
                  <Button size="sm" variant="danger">
                    <i className="fa fa-trash" />
                  </Button>
                </Delete>
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
              <Nav.Link
                onClick={() => onChangeGetParams({ is_online: undefined })}
              >
                {this.renderTitle({ is_online: undefined })}
              </Nav.Link>
              <Nav.Link
                onClick={() => onChangeGetParams({ is_online: "true" })}
              >
                {this.renderTitle({ is_online: "true" })}
              </Nav.Link>
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
        listClientPath={CLIENT_URLS.USER.FRIEND_LIST.buildPath()}
        createClientPath={CLIENT_URLS.SEARCH.buildPath()}
        listServerPath={SERVER_URLS.FRIENDS_LIST}
        generateListServerPath={this.generateListServerPath}
        renderTitle={this.renderTitle}
        renderItem={this.renderItem}
        renderFilters={this.renderFilters}
        createBtnName={_("Search freinds")}
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

export default compose(withAuth, withCountersData)(FriendList);
