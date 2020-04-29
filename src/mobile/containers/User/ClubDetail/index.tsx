import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useGet, useMutate } from "restful-react";
import { useParams } from "react-router";
import {
  ListGroup,
  Button,
  OverlayTrigger,
  Popover,
  Alert,
  Modal
} from "react-bootstrap";
import ShowMore from "react-show-more";
import { confirmAlert } from "react-confirm-alert";

import {
  TYPE_OPEN,
  ROLE_MODERATOR,
  REQUEST_WAITING,
  REQUEST_APPROVED
} from "generic/constants";
import defaultSVG from "generic/layout/images/picture.svg";
import { CLIENT_URLS } from "mobile/routes/client";
import userSVG from "generic/layout/images/user.svg";
import { AuthUserContext } from "generic/containers/ContextProviders/HeaderUserService";
import Image from "generic/components/Image";
import { _ } from "trans";
import { SERVER_URLS } from "routes/server";
import Header from "mobile/containers/Header";
import Loading from "generic/components/Loading";
import { getGeo } from "desktop/containers/User/Profile/utils";

import ClubMedia from "./ClubMedia";
import ClubParties from "./ClubParties";

import { renderHtml, handleSuccess, handleErrors } from "utils";
import DeleteItem from "mobile/components/DeleteItem";
import { LinkContainer } from "react-router-bootstrap";
import BlockMap from "desktop/components/BlockMap";

const ClubDetail: React.SFC<any> = () => {
  const [showMap, toggleShowMap] = useState(false);
  const { clubSlug } = useParams();
  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {
    pk: null
  };

  const { data: clubData, loading: clubLoading, refetch } = useGet({
    path: SERVER_URLS.CLUB_DETAIL.toPath({
      urlParams: {
        clubSlug
      }
    })
  });
  const club = clubData || {
    pk: null,
    name: ""
  };

  const { mutate: join, loading: joinLoading } = useMutate({
    verb: "POST",
    path: SERVER_URLS.MEMBERSHIP_REQUESTS_CREATE.toPath()
  });

  const { mutate: leave, loading: leaveLoading } = useMutate({
    verb: "PATCH",
    path: SERVER_URLS.CLUB_LEAVE.toPath({
      urlParams: {
        clubSlug
      }
    })
  });

  if (clubLoading) {
    return <Loading />;
  }

  const title = club.name;

  const isModerator = (item: any) => {
    return (
      item.moderators.map((m: any) => m.pk).indexOf(user.pk) !== -1 ||
      user.role === ROLE_MODERATOR
    );
  };
  const isParticipant = (item: any) => {
    return item.users.map((m: any) => m.pk).indexOf(user.pk) !== -1;
  };
  const isParticipantOrOpen = (item: any) => {
    return isParticipant(item) || item.club_type.value === TYPE_OPEN;
  };
  const hasRequest = (item: any) => {
    return Boolean(item.request);
  };
  return (
    <div className="container-club">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
        <body className="body-mobile body-club" />
      </Helmet>
      <Header name={" "} fixed={true}>
        {isModerator(club) && (
          <div>
            <Link
              to={CLIENT_URLS.USER.CLUB_DETAIL_REQUESTS.toPath({
                urlParams: {
                  clubSlug: club.slug
                },
                getParams: {
                  status: REQUEST_WAITING,
                  object_id: club.pk
                }
              })}
            >
              <i className="fa fa-bell" />
              {club.requests_count > 0 && <> ({club.requests_count})</>}
            </Link>
          </div>
        )}
      </Header>
      {(leaveLoading || joinLoading || clubLoading) && <Loading />}
      <div className="club-data">
        <div className="club-avatar block">
          <Image
            src={club.image && club.image.image ? club.image.image : defaultSVG}
          />
          {isModerator(club) && club.status !== REQUEST_APPROVED && (
            <Alert variant="danger">
              <div>
                {_(
                  "The club is on moderation. Users cannot see the club in search until moderators approve it."
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
          <div className="club-title">
            <h1>{club.name}</h1>
            {isModerator(club) && (
              <div className="actions">
                <OverlayTrigger
                  trigger="click"
                  rootClose={true}
                  placement="left"
                  overlay={
                    <Popover id="popover-basic">
                      <Popover.Content>
                        <ListGroup variant="flush">
                          <ListGroup.Item>
                            <Link
                              to={CLIENT_URLS.USER.CLUB_UPDATE.toPath({
                                urlParams: {
                                  clubSlug: club.slug
                                }
                              })}
                            >
                              <i className="fa fa-pencil" />{" "}
                              {_("Update the club")}
                            </Link>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <DeleteItem
                              description={_(
                                "Are you sure you want to delete the club?"
                              )}
                              onSuccess={() => refetch()}
                              path={SERVER_URLS.CLUB_DELETE.toPath({
                                urlParams: {
                                  clubSlug: club.slug
                                }
                              })}
                            >
                              <i className="fa fa-trash" />{" "}
                              {_("Delete the club")}
                            </DeleteItem>
                          </ListGroup.Item>
                        </ListGroup>
                      </Popover.Content>
                    </Popover>
                  }
                >
                  <i className="fa fa-bars fa-lg" />
                </OverlayTrigger>
              </div>
            )}
          </div>
          <div className="info-line about">
            <div className="info-icon">
              <i className="fa fa-map" />
            </div>
            <div className="geo-text">{getGeo(club)}</div>
          </div>
          <div className="info-line participants">
            <div className="info-icon">
              <i className="fa fa-users" />
            </div>
            <div className="participants-count">
              {club.users.length} {_("Participants")}
            </div>
            <div className="participants-list">
              {isParticipantOrOpen(club) && (
                <Link
                  to={CLIENT_URLS.USER.PARTICIPANT_LIST.toPath({
                    getParams: {
                      objectId: club.pk,
                      contentType: "clubs:club"
                    }
                  })}
                >
                  {club.users.slice(0, 3).map((participant: any) => (
                    <Image
                      key={participant.pk}
                      src={
                        participant.avatar &&
                        participant.avatar.thumbnail_100x100
                          ? participant.avatar.thumbnail_100x100
                          : userSVG
                      }
                      width={30}
                      height={30}
                      roundedCircle={true}
                    />
                  ))}
                </Link>
              )}
            </div>
          </div>
          <div className="info-line participants">
            <div className="info-icon">
              <i className="fa fa-users" />
            </div>
            <div className="participants-count">
              {club.moderators.length} {_("Moderators")}
            </div>
            <div className="participants-list">
              {isParticipantOrOpen(club) && (
                <Link
                  to={CLIENT_URLS.USER.PARTICIPANT_LIST.toPath({
                    getParams: {
                      objectId: club.pk,
                      contentType: "clubs:club",
                      moderators: true
                    }
                  })}
                >
                  {club.moderators.slice(0, 3).map((participant: any) => (
                    <Image
                      key={participant.pk}
                      src={
                        participant.avatar &&
                        participant.avatar.thumbnail_100x100
                          ? participant.avatar.thumbnail_100x100
                          : userSVG
                      }
                      width={30}
                      height={30}
                      roundedCircle={true}
                    />
                  ))}
                </Link>
              )}
            </div>
          </div>
          <div className="info-line about">
            <div className="info-icon">
              <i className="fa fa-comment" />
            </div>
            <div className="about-text">
              <ShowMore
                lines={3}
                more={_("Show more")}
                less={_("Show less")}
                anchorClass=""
              >
                {renderHtml(club.description)}
              </ShowMore>
            </div>
          </div>
          {!isParticipant(club) && (
            <div className="info-line actions">
              {hasRequest(club) ? (
                <DeleteItem
                  description={_(
                    "Are you sure you want to delete the request to join the club?"
                  )}
                  onSuccess={() => refetch()}
                  path={SERVER_URLS.MEMBERSHIP_REQUESTS_DELETE.toPath({
                    urlParams: {
                      membershipPk: club.request
                    }
                  })}
                >
                  <Button size="sm" className="float-right" variant="danger">
                    <i className="fa fa-trash" /> {_("Drop your request")}
                  </Button>
                </DeleteItem>
              ) : (
                <Button
                  size="sm"
                  className="float-right"
                  onClick={() => {
                    join({
                      content_type: "clubs:club",
                      object_id: club.pk
                    })
                      .then((result: any) => {
                        handleSuccess(
                          _("Your request has been sent successfully.")
                        );
                        refetch();
                      })
                      .catch((errors: any) => {
                        handleErrors(errors);
                      });
                  }}
                >
                  <i className="fa fa-handshake-o" /> {_("Join to this club")}
                </Button>
              )}
            </div>
          )}
          {isParticipant(club) && (
            <div className="info-line actions">
              <Button
                size="sm"
                variant="danger"
                className="float-left"
                onClick={() =>
                  confirmAlert({
                    title: _("Are you sure?"),
                    message: _("Are you sure you want to leave the club?"),
                    buttons: [
                      {
                        label: _("Yes"),
                        onClick: () => {
                          leave({})
                            .then((result: any) => {
                              handleSuccess(_("You has left the club."));
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
                  })
                }
              >
                <i className="fa fa-sign-out" /> {_("Leave the club")}
              </Button>
            </div>
          )}
        </div>
        <div className="club-info block">
          <h2>{_("Club info")}</h2>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <span className="item-title">{_("Type")}:</span>
              {club.club_type.display}
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="item-title">{_("Theme")}:</span>
              {club.relationship_theme.display}
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="item-title">{_("Address")}:</span>
              <ShowMore
                lines={3}
                more={_("Show more")}
                less={_("Show less")}
                anchorClass=""
              >
                {renderHtml(club.address)}
              </ShowMore>
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="item-title">{_("Map")}:</span>
              <br />
              <Button
                size="sm"
                variant="warning"
                className="float-left"
                onClick={() => toggleShowMap(true)}
              >
                <i className="fa fa-map" /> {_("Show map")}
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </div>
        {club.pk && isParticipantOrOpen(club) && (
          <ClubMedia club={club} user={user} />
        )}
        {club.pk && isParticipantOrOpen(club) && (
          <ClubParties club={club} user={user} />
        )}
      </div>
      <Modal size="lg" show={showMap} onHide={() => toggleShowMap(false)}>
        <Modal.Header closeButton={true}>
          <Modal.Title>
            <i className="fa fa-map" /> {_("Map")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BlockMap geo={club.geo} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ClubDetail;
