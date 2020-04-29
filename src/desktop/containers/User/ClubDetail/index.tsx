import React from "react";
import compose from "lodash/flowRight";
import { Row, Col, Card, Button, Alert, Nav, Badge } from "react-bootstrap";
import { RouteComponentProps } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

import { getGeo } from "desktop/containers/User/Profile/utils";
import Image from "generic/components/Image";
import defaultSVG from "generic/layout/images/picture.svg";
import {
  TYPE_CLOSE,
  REQUEST_APPROVED,
  REQUEST_WAITING,
  ROLE_MODERATOR
} from "generic/constants";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import BlockMap from "desktop/components/BlockMap";
import BlockMedia from "desktop/components/BlockMedia";
import Participants from "desktop/components/Participants";
import BlockParties from "desktop/components/BlockParties";
import Loading from "generic/components/Loading";
import ResponseErrors from "desktop/components/ResponseErrors";
import { renderHtml } from "utils";
import { _ } from "trans";
import { withAuthUser, withRestGet } from "generic/containers/Decorators";
import ClubActions from "./ClubActions";
import ShowMore from "react-show-more";

interface IProps extends RouteComponentProps {
  club: any;
  authUser: any;
  match: any;
}

interface IState {
  tab: string;
}

class Club extends React.PureComponent<IProps, IState> {
  public state = {
    tab: "parties"
  };

  public onDeleteSuccess = () => {
    this.props.history.push(CLIENT_URLS.USER.CLUB_LIST.buildPath());
  };

  public onLeaveSuccess = () => {
    this.props.history.push(CLIENT_URLS.USER.CLUB_LIST.buildPath());
  };

  public render() {
    if (this.props.club.error) {
      return <ResponseErrors error={this.props.club.error} />;
    }
    if (!this.props.club.response || this.props.club.loading) {
      return <Loading />;
    }

    const user = this.props.authUser.user;
    const club = this.props.club.response;
    const isUser = club.users.map((u: any) => u.pk).indexOf(user.pk) !== -1;
    const isModerator =
      club.moderators.map((u: any) => u.pk).indexOf(user.pk) !== -1 ||
      user.role === ROLE_MODERATOR;
    const isClosed = club.club_type.value === TYPE_CLOSE;
    return (
      <Col lg={10} className="club-container">
        {club.status !== REQUEST_APPROVED && (
          <Alert variant="danger">
            <div>
              {_(
                "The club is on moderation. It is only visible to you and is not visible in the search results. Waiting for moderation."
              )}
            </div>
            <hr />
            <LinkContainer
              to={CLIENT_URLS.USER.CHAT_WITH_MODERATORS_CREATE.buildPath()}
            >
              <Button size="sm" variant="danger">
                <i className="fa fa-comment" /> {_("Chat with support")}
              </Button>
            </LinkContainer>
          </Alert>
        )}
        <Row>
          <Col lg={9}>
            <Row>
              <Col lg={6}>
                <Card className="club-action">
                  {club.image && club.image.thumbnail_500x500 ? (
                    <Image
                      variant="top"
                      width="100%"
                      src={club.image.thumbnail_500x500}
                    />
                  ) : (
                    <Image variant="top" width="100%" src={defaultSVG} />
                  )}
                </Card>
              </Col>
              <Col lg={6}>
                <Card>
                  <Card.Body>
                    <Card.Title>{_("Details")}</Card.Title>
                    <p>
                      <i className="fa fa-tag" /> {_("Theme")}:{" "}
                      {club.relationship_theme.display}
                    </p>
                    <p>
                      <i className="fa fa-sitemap" /> {_("Type")}:{" "}
                      {club.club_type.display}
                    </p>
                    <p>
                      <i className="fa fa-map-marker" /> {_("Geo")}{" "}
                      {getGeo(club)}
                    </p>
                    <p>
                      <i className="fa fa-users" /> {_("Participants")}:{" "}
                      {club.users.length}
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
                          to={CLIENT_URLS.USER.CLUB_DETAIL_REQUESTS.buildPath(
                            { clubSlug: club.slug },
                            {
                              getParams: {
                                status: REQUEST_WAITING,
                                object_id: club.pk
                              }
                            }
                          )}
                        >
                          <Nav.Link>
                            <i className="fa fa-list-ol" /> {_("Requests")}{" "}
                            {club.requests_count > 0 && (
                              <Badge variant="primary">
                                {club.requests_count}
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
                    <Card.Title>{club.name}</Card.Title>
                    <ShowMore
                      lines={10}
                      more={_("Show more")}
                      less={_("Show less")}
                      anchorClass=""
                    >
                      {renderHtml(club.description)}
                    </ShowMore>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Card>
                  <Card.Body>
                    <Card.Title>{_("Address")}</Card.Title>
                    {renderHtml(club.address)}
                    {club.geo && <BlockMap geo={club.geo} />}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            {isClosed && !isUser ? null : (
              <Row>
                <Col lg={12} className="club-media">
                  <Row>
                    <BlockMedia
                      objectId={club.pk}
                      contentType="clubs:club"
                      size={12}
                      isReadonly={!isModerator}
                    />
                  </Row>
                </Col>
              </Row>
            )}
            {isClosed && !isUser ? null : (
              <Row>
                <BlockParties
                  renderTitle={() => _("Parties")}
                  club={club.pk}
                  size={12}
                  isReadonly={!isModerator}
                />
              </Row>
            )}
          </Col>
          <Col lg={3}>
            <ClubActions
              club={club}
              onDeleteSuccess={this.onDeleteSuccess}
              onLeaveSuccess={this.onLeaveSuccess}
            />
            {isUser ? (
              <>
                <Participants participants={club.users} />
                <Participants
                  title={_("Moderators")}
                  participants={club.moderators}
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

const withClub = withRestGet({
  propName: "club",
  path: (props: any) =>
    SERVER_URLS.CLUB_DETAIL.buildPath({
      clubSlug: props.match.params.clubSlug
    })
});

export default compose(withAuth, withClub)(Club);
