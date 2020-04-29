import React from "react";
import compose from "lodash/flowRight";
import { Row, Col, Card, Nav, Badge } from "react-bootstrap";
import { RouteComponentProps } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

import Image from "generic/components/Image";
import { TYPE_CLOSE, REQUEST_WAITING, ROLE_MODERATOR } from "generic/constants";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import userSVG from "generic/layout/images/user.svg";

import BlockMedia from "desktop/components/BlockMedia";
import Participants from "desktop/components/Participants";
import BlockPosts from "desktop/components/BlockPosts";
import ResponseErrors from "desktop/components/ResponseErrors";
import Loading from "generic/components/Loading";
import { renderHtml } from "utils";
import { _ } from "trans";
import { withAuthUser, withRestGet } from "generic/containers/Decorators";
import GroupActions from "./GroupActions";
import ShowMore from "react-show-more";

interface IProps extends RouteComponentProps {
  group: any;
  authUser: any;
  match: any;
}

interface IState {
  tab: string;
}

class Group extends React.PureComponent<IProps, IState> {
  public state = {
    tab: "posts"
  };

  public onDeleteSuccess = () => {
    this.props.history.push(CLIENT_URLS.USER.GROUP_LIST.buildPath());
  };

  public onLeaveSuccess = () => {
    this.props.history.push(CLIENT_URLS.USER.GROUP_LIST.buildPath());
  };

  public render() {
    if (this.props.group.error) {
      return <ResponseErrors error={this.props.group.error} />;
    }
    if (!this.props.group.response || this.props.group.loading) {
      return <Loading />;
    }
    const user = this.props.authUser.user;
    const group = this.props.group.response;
    const isUser = group.users.map((u: any) => u.pk).indexOf(user.pk) !== -1;
    const isModerator =
      group.moderators.map((u: any) => u.pk).indexOf(user.pk) !== -1 ||
      user.role === ROLE_MODERATOR;
    const isClosed = group.group_type.value === TYPE_CLOSE;
    return (
      <Col lg={10} className="group-container">
        <Row>
          <Col lg={9}>
            <Row>
              <Col lg={6}>
                <Card>
                  {group.image && group.image.thumbnail_500x500 ? (
                    <Image
                      variant="top"
                      width="100%"
                      src={group.image.thumbnail_500x500}
                    />
                  ) : (
                    <Image variant="top" width="100%" src={userSVG} />
                  )}
                </Card>
              </Col>
              <Col lg={6}>
                <Card>
                  <Card.Body>
                    <Card.Title>{_("Details")}</Card.Title>
                    <p>
                      <i className="fa fa-tag" /> {_("Theme")}:{" "}
                      {group.relationship_theme.display}
                    </p>
                    <p>
                      <i className="fa fa-sitemap" /> {_("Type")}:{" "}
                      {group.group_type.display}
                    </p>
                    <p>
                      <i className="fa fa-users" /> {_("Participants")}:{" "}
                      {group.users.concat(group.moderators).length}
                    </p>
                  </Card.Body>
                </Card>
                {isModerator ? (
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        <i className="fa fa-cogs" /> {_("Actions")}
                      </Card.Title>
                      <Nav className="flex-column">
                        <LinkContainer
                          to={CLIENT_URLS.USER.GROUP_DETAIL_REQUESTS.buildPath(
                            { groupSlug: group.slug },
                            {
                              getParams: {
                                status: REQUEST_WAITING,
                                object_id: group.pk
                              }
                            }
                          )}
                        >
                          <Nav.Link>
                            <i className="fa fa-list-ol" /> {_("Requests")}{" "}
                            {group.requests_count > 0 && (
                              <Badge variant="primary">
                                {group.requests_count}
                              </Badge>
                            )}
                          </Nav.Link>
                        </LinkContainer>
                      </Nav>
                    </Card.Body>
                  </Card>
                ) : null}
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Card>
                  <Card.Body>
                    <Card.Title>{_("Group")}</Card.Title>
                    <Card.Text>
                      <ShowMore
                        lines={10}
                        more={_("Show more")}
                        less={_("Show less")}
                        anchorClass=""
                      >
                        {renderHtml(group.description)}
                      </ShowMore>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            {isClosed && !isUser ? null : (
              <Row>
                <Col lg={12} className="group-media">
                  <Row>
                    <BlockMedia
                      objectId={group.pk}
                      contentType="groups:group"
                      size={12}
                      isReadonly={!isModerator}
                    />
                  </Row>
                </Col>
              </Row>
            )}
            {isClosed && !isUser ? null : (
              <Row>
                <BlockPosts
                  objectId={group.pk}
                  contentType="groups:group"
                  size={12}
                  isReadonly={!isModerator}
                />
              </Row>
            )}
          </Col>
          <Col lg={3}>
            <GroupActions
              group={group}
              onDeleteSuccess={this.onDeleteSuccess}
              onLeaveSuccess={this.onLeaveSuccess}
            />
            {isUser ? (
              <>
                <Participants participants={group.users} />
                <Participants
                  title={_("Moderators")}
                  participants={group.moderators}
                />
              </>
            ) : null}
          </Col>
        </Row>
      </Col>
    );
  }
}

const withAuth = withAuthUser({
  propName: "authUser"
});

const withGroup = withRestGet({
  propName: "group",
  path: (props: any) =>
    SERVER_URLS.GROUP_DETAIL.buildPath({
      groupSlug: props.match.params.groupSlug
    })
});

export default compose(withAuth, withGroup)(Group);
