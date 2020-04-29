import React from "react";
import compose from "lodash/flowRight";
import { Row, Col, Card, ButtonGroup, Button, Alert } from "react-bootstrap";
import { RouteComponentProps, Link } from "react-router-dom";

import Image from "generic/components/Image";
import { getGeo } from "desktop/containers/User/Profile/utils";
import defaultSVG from "generic/layout/images/picture.svg";
import {
  TYPE_CLOSE,
  ROLE_MODERATOR,
  REQUEST_APPROVED
} from "generic/constants";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import BlockMap from "desktop/components/BlockMap";
import BlockMedia from "desktop/components/BlockMedia";
import Participants from "desktop/components/Participants";
import Loading from "generic/components/Loading";
import ResponseErrors from "desktop/components/ResponseErrors";
import { renderHtml } from "utils";
import { _ } from "trans";
import { withAuthUser, withRestGet } from "generic/containers/Decorators";
import PartyActions from "generic/components/PartyActions";
import { LinkContainer } from "react-router-bootstrap";
import Delete from "desktop/containers/Generics/Delete";
import ShowMore from "react-show-more";

interface IProps extends RouteComponentProps {
  party: any;
  authUser: any;
  match: any;
}

interface IState {
  tab: string;
}

class Party extends React.PureComponent<IProps, IState> {
  public state = {
    tab: "address"
  };

  public onDeleteSuccess = () => {
    this.props.history.push(CLIENT_URLS.USER.CLUB_LIST.buildPath());
  };

  public render() {
    if (this.props.party.error) {
      return <ResponseErrors error={this.props.party.error} />;
    }
    if (!this.props.party.response && this.props.party.loading) {
      return <Loading />;
    }

    const user = this.props.authUser.user;
    const party = this.props.party.response;
    const isUser = party.users.map((u: any) => u.pk).indexOf(user.pk) !== -1;
    const isModerator =
      party.club.moderators.map((u: any) => u.pk).indexOf(user.pk) !== -1 ||
      user.role === ROLE_MODERATOR;
    const isClosed = party.party_type.value === TYPE_CLOSE;
    return (
      <Col lg={10} className="party-container">
        {party.status !== REQUEST_APPROVED && (
          <Alert variant="danger">
            <div>
              {_(
                "The party is on moderation. It is only visible to you and is not visible in the search results. Waiting for moderation."
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
                <Card className="party-action">
                  {party.image && party.image.thumbnail_500x500 ? (
                    <Image
                      variant="top"
                      width="100%"
                      src={party.image.thumbnail_500x500}
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
                      <i className="fa fa-venus-mars" /> {_("Club")}{" "}
                      <Link
                        to={CLIENT_URLS.USER.CLUB_DETAIL.buildPath({
                          clubSlug: party.club.slug
                        })}
                      >
                        {party.club.name}
                      </Link>
                    </p>
                    <p>
                      <i className="fa fa-tag" /> {_("Theme")}{" "}
                      {party.theme.display}
                    </p>
                    <p>
                      <i className="fa fa-sitemap" /> {_("Type")}:{" "}
                      {party.party_type.display}
                    </p>
                    <p>
                      <i className="fa fa-map-marker" /> {_("Geo")}{" "}
                      {getGeo(party)}
                    </p>
                    <p>
                      <i className="fa fa-users" /> {_("Couples")}{" "}
                      {party.pair_count}
                    </p>
                    <p>
                      <i className="fa fa-user" /> {_("M")} {party.man_count}
                    </p>
                    <p>
                      <i className="fa fa-user" /> {_("W")} {party.woman_count}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Card>
                  <Card.Body>
                    <Card.Title>{party.name}</Card.Title>
                    <ShowMore
                      lines={10}
                      more={_("Show more")}
                      less={_("Show less")}
                      anchorClass=""
                    >
                      {renderHtml(party.description)}
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
                    {renderHtml(party.address)}
                    {party.geo && <BlockMap geo={party.geo} />}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            {isClosed && !isUser ? null : (
              <Row>
                <Col lg={12} className="party-media">
                  <Row>
                    <BlockMedia
                      objectId={party.pk}
                      contentType="events:party"
                      size={12}
                      isReadonly={!isModerator}
                    />
                  </Row>
                </Col>
              </Row>
            )}
          </Col>
          <Col lg={3}>
            <Card>
              <Card.Body className="party-action">
                <Card.Title>{_("Actions")}</Card.Title>
                <ButtonGroup vertical={true}>
                  <PartyActions
                    item={party}
                    refetch={this.props.party.refetch}
                    user={user}
                    disableLoading={true}
                  />
                </ButtonGroup>
                <ButtonGroup vertical={true}>
                  {isModerator && (
                    <LinkContainer
                      to={CLIENT_URLS.USER.PARTY_UPDATE.buildPath({
                        partySlug: party.slug
                      })}
                    >
                      <Button size="sm" className="float-right">
                        <i className="fa fa-pencil" /> {_("Update")}
                      </Button>
                    </LinkContainer>
                  )}
                  {isModerator && (
                    <Delete
                      description={_(
                        "Are you sure you want to delete the party?"
                      )}
                      onSuccess={this.onDeleteSuccess}
                      destoryServerPath={SERVER_URLS.PARTY_DELETE.buildPath({
                        partySlug: party.slug
                      })}
                      method="PATCH"
                    >
                      <Button
                        size="sm"
                        variant="danger"
                        className="float-right"
                      >
                        <i className="fa fa-trash" /> {_("Delete")}
                      </Button>
                    </Delete>
                  )}
                </ButtonGroup>
              </Card.Body>
            </Card>
            {isUser && (
              <Card>
                <Card.Body>
                  <Card.Title>{_("Cost")}</Card.Title>
                  <p>
                    {_("For Couple:")} {party.pair_cost} {"Руб"}
                  </p>
                  <p>
                    {_("For M:")} {party.man_cost} {"Руб"}
                  </p>
                  <p>
                    {_("For W:")} {party.woman_cost} {"Руб"}
                  </p>
                </Card.Body>
              </Card>
            )}
            {isUser && (
              <>
                <Participants participants={party.users} />
                <Participants
                  title={_("Moderators")}
                  participants={party.moderators}
                />
              </>
            )}
          </Col>
        </Row>
      </Col>
    );
  }
}

const withAuth = withAuthUser({
  propName: "authUser"
});

const withParty = withRestGet({
  propName: "party",
  path: (props: any) =>
    SERVER_URLS.PARTY_DETAIL.buildPath({
      partySlug: props.match.params.partySlug
    })
});

export default compose(withAuth, withParty)(Party);
