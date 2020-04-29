import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useGet, useMutate } from "restful-react";
import { useParams } from "react-router";
import { ListGroup, Button, OverlayTrigger, Popover } from "react-bootstrap";
import ShowMore from "react-show-more";
import { confirmAlert } from "react-confirm-alert";

import { TYPE_OPEN, ROLE_MODERATOR, REQUEST_WAITING } from "generic/constants";
import defaultSVG from "generic/layout/images/picture.svg";
import { CLIENT_URLS } from "mobile/routes/client";
import userSVG from "generic/layout/images/user.svg";
import { AuthUserContext } from "generic/containers/ContextProviders/HeaderUserService";
import Image from "generic/components/Image";
import { _ } from "trans";
import { SERVER_URLS } from "routes/server";
import Header from "mobile/containers/Header";
import Loading from "generic/components/Loading";

import GroupMedia from "./GroupMedia";
import GroupPosts from "./GroupPosts";

import { renderHtml, handleSuccess, handleErrors } from "utils";
import DeleteItem from "mobile/components/DeleteItem";

const GroupDetail: React.SFC<any> = () => {
  const { groupSlug } = useParams();
  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {
    pk: null
  };

  const { data: groupData, loading: groupLoading, refetch } = useGet({
    path: SERVER_URLS.GROUP_DETAIL.toPath({
      urlParams: {
        groupSlug
      }
    })
  });
  const group = groupData || {
    pk: null,
    name: ""
  };

  const { mutate: join, loading: joinLoading } = useMutate({
    verb: "POST",
    path: SERVER_URLS.MEMBERSHIP_REQUESTS_CREATE.toPath()
  });

  const { mutate: leave, loading: leaveLoading } = useMutate({
    verb: "PATCH",
    path: SERVER_URLS.GROUP_LEAVE.toPath({
      urlParams: {
        groupSlug
      }
    })
  });

  if (groupLoading) {
    return <Loading />;
  }

  const title = group.name;

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
    return isParticipant(item) || item.group_type.value === TYPE_OPEN;
  };
  const hasRequest = (item: any) => {
    return Boolean(item.request);
  };
  return (
    <div className="container-group">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
        <body className="body-mobile body-group" />
      </Helmet>
      <Header name={" "} fixed={true}>
        {isModerator(group) && (
          <div>
            <Link
              to={CLIENT_URLS.USER.GROUP_DETAIL_REQUESTS.toPath({
                urlParams: {
                  groupSlug: group.slug
                },
                getParams: {
                  status: REQUEST_WAITING,
                  object_id: group.pk
                }
              })}
            >
              <i className="fa fa-bell" />
              {group.requests_count > 0 && <> ({group.requests_count})</>}
            </Link>
          </div>
        )}
      </Header>
      {(leaveLoading || joinLoading || groupLoading) && <Loading />}
      <div className="group-data">
        <div className="group-avatar block">
          <Image
            src={
              group.image && group.image.image ? group.image.image : defaultSVG
            }
          />
          <div className="group-title">
            <h1>{group.name}</h1>
            {isModerator(group) && (
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
                              to={CLIENT_URLS.USER.GROUP_UPDATE.toPath({
                                urlParams: {
                                  groupSlug: group.slug
                                }
                              })}
                            >
                              <i className="fa fa-pencil" />{" "}
                              {_("Update the group")}
                            </Link>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            <DeleteItem
                              description={_(
                                "Are you sure you want to delete the group?"
                              )}
                              onSuccess={() => refetch()}
                              path={SERVER_URLS.GROUP_DELETE.toPath({
                                urlParams: {
                                  groupSlug: group.slug
                                }
                              })}
                            >
                              <i className="fa fa-trash" />{" "}
                              {_("Delete the group")}
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
          <div className="info-line participants">
            <div className="info-icon">
              <i className="fa fa-users" />
            </div>
            <div className="participants-count">
              {group.users.length} {_("Participants")}
            </div>
            <div className="participants-list">
              {isParticipantOrOpen(group) && (
                <Link
                  to={CLIENT_URLS.USER.PARTICIPANT_LIST.toPath({
                    getParams: {
                      objectId: group.pk,
                      contentType: "groups:group"
                    }
                  })}
                >
                  {group.users.slice(0, 3).map((participant: any) => (
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
              {group.moderators.length} {_("Moderators")}
            </div>
            <div className="participants-list">
              {isParticipantOrOpen(group) && (
                <Link
                  to={CLIENT_URLS.USER.PARTICIPANT_LIST.toPath({
                    getParams: {
                      objectId: group.pk,
                      contentType: "groups:group",
                      moderators: true
                    }
                  })}
                >
                  {group.moderators.slice(0, 3).map((participant: any) => (
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
                {renderHtml(group.description)}
              </ShowMore>
            </div>
          </div>
          {!isParticipant(group) && (
            <div className="info-line actions">
              {hasRequest(group) ? (
                <DeleteItem
                  description={_(
                    "Are you sure you want to delete the request to join the group?"
                  )}
                  onSuccess={() => refetch()}
                  path={SERVER_URLS.MEMBERSHIP_REQUESTS_DELETE.toPath({
                    urlParams: {
                      membershipPk: group.request
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
                      content_type: "groups:group",
                      object_id: group.pk
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
                  <i className="fa fa-handshake-o" /> {_("Join to this group")}
                </Button>
              )}
            </div>
          )}
          {isParticipant(group) && (
            <div className="info-line actions">
              <Button
                size="sm"
                variant="danger"
                className="float-left"
                onClick={() =>
                  confirmAlert({
                    title: _("Are you sure?"),
                    message: _("Are you sure you want to leave the group?"),
                    buttons: [
                      {
                        label: _("Yes"),
                        onClick: () => {
                          leave({})
                            .then((result: any) => {
                              handleSuccess(_("You has left the group."));
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
                <i className="fa fa-sign-out" /> {_("Leave the group")}
              </Button>
            </div>
          )}
        </div>
        <div className="group-info block">
          <h2>{_("Group info")}</h2>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <span className="item-title">{_("Type")}:</span>
              {group.group_type.display}
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="item-title">{_("Theme")}:</span>
              {group.relationship_theme.display}
            </ListGroup.Item>
          </ListGroup>
        </div>
        {group.pk && isParticipantOrOpen(group) && (
          <GroupMedia group={group} user={user} />
        )}
        {group.pk && isParticipantOrOpen(group) && (
          <GroupPosts group={group} user={user} />
        )}
      </div>
    </div>
  );
};

export default GroupDetail;
