import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useGet, useMutate } from "restful-react";
import { useParams } from "react-router";
import { ListGroup, Button, Alert, ButtonGroup } from "react-bootstrap";
import ShowMore from "react-show-more";
import { LinkContainer } from "react-router-bootstrap";
import Moment from "react-moment";

import { CLIENT_URLS } from "mobile/routes/client";
import userSVG from "generic/layout/images/user.svg";
import { AuthUserContext } from "generic/containers/ContextProviders/HeaderUserService";
import Image from "generic/components/Image";
import { _ } from "trans";
import { SERVER_URLS } from "routes/server";
import Header from "mobile/containers/Header";
import Loading from "generic/components/Loading";

import ProfileMedia from "./ProfileMedia";
import ProfilePosts from "./ProfilePosts";
import ProfileRealStatus from "./ProfileRealStatus";
import ProfileMobile from "./ProfileMobile";

import {
  getBirthday,
  getBirthdaySecond,
  getGeo
} from "desktop/containers/User/Profile/utils";
import { getLocale, renderHtml, handleSuccess, handleErrors } from "utils";
import DeleteItem from "mobile/components/DeleteItem";
import { ROLE_GUEST } from "generic/constants";
import { GuestAlert } from "mobile/components/GuestAlert";

const Profile: React.SFC<any> = () => {
  const { userSlug } = useParams();
  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {
    pk: null,
    black_list: []
  };

  const { data: profileData, loading: profileLoading, refetch } = useGet({
    path: SERVER_URLS.PROFILE.toPath({
      urlParams: {
        userSlug
      }
    })
  });
  const profile = profileData || {
    name: "",
    pk: null,
    is_real: false,
    gender: {},
    relationship_formats: [],
    relationship_themes: [],
    black_list: [],
    is_deleted: false
  };

  const { mutate: addToFriends, loading: addToFriendsLoading } = useMutate({
    verb: "POST",
    path: SERVER_URLS.MEMBERSHIP_REQUESTS_CREATE.toPath()
  });

  if (profileLoading) {
    return <Loading />;
  }

  if (profile.is_deleted) {
    return (
      <div className="container-profile">
        <Header name={" "} fixed={true} />
        <div className="profile-data">
          <div className="profile-avatar block">
            <Image src={userSVG} />
            <Alert variant="warning" style={{ textAlign: "center" }}>
              {_("The user has deleted own profile")}
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  if (profile.black_list.indexOf(user.pk) > -1) {
    return (
      <div className="container-profile">
        <Header name={" "} fixed={true} />
        <div className="profile-data">
          <div className="profile-avatar block">
            <Image src={userSVG} />
            <Alert variant="warning" style={{ textAlign: "center" }}>
              {_(
                "You cannot view the user's profile and communicate with the user cause you are in blacklist for the user"
              )}
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  const title = profile.name;

  const hasRequest = (item: any) => {
    return Boolean(item.request);
  };

  const isFriend = (item: any) => {
    return item.friends.map((friend: any) => friend.pk).indexOf(user.pk) !== -1;
  };
  return (
    <div className="container-profile">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
        <body className="body-mobile body-profile" />
      </Helmet>
      <Header name={" "} fixed={true} />
      {(addToFriendsLoading || profileLoading) && <Loading />}
      <div className="profile-data">
        <div className="profile-avatar block">
          <Image
            src={
              profile.avatar && profile.avatar.image
                ? profile.avatar.image
                : userSVG
            }
          />
          {user.pk === profile.pk && !profile.is_real && profile.approver && (
            <Alert variant="warning">
              {_("User ")}{" "}
              <Link
                to={CLIENT_URLS.USER.PROFILE.buildPath({
                  userSlug: profile.approver.slug
                })}
              >
                {profile.approver.name}
              </Link>{" "}
              {_("approved your real status. Waiting for moderation.")}
            </Alert>
          )}
          {user.pk !== profile.pk &&
            user.black_list.indexOf(profile.pk) !== -1 && (
              <Alert variant="danger">
                <div>{_("This user is in your black list")}</div>
                <hr />
                <div className="d-flex">
                  <ButtonGroup vertical={true}>
                    <LinkContainer
                      to={CLIENT_URLS.USER.BLACKLIST_LIST.buildPath()}
                    >
                      <Button size="sm" variant="danger">
                        <i className="fa fa-deaf" /> {_("Black List")}
                      </Button>
                    </LinkContainer>
                  </ButtonGroup>
                </div>
              </Alert>
            )}
          {user.pk === profile.pk && profile.role.value === ROLE_GUEST && (
            <GuestAlert />
          )}

          <div className="profile-title">
            <h1>
              {profile.online ? <i className="fa fa-circle text-link" /> : null}{" "}
              {profile.name}
            </h1>
            {user.pk === profile.pk && (
              <div className="actions">
                <Link to={CLIENT_URLS.USER.SETTINGS.toPath()}>
                  <i className="fa fa-cogs fa-lg" />
                </Link>
              </div>
            )}
          </div>

          {user.pk !== profile.pk && profile.last_seen && (
            <div className="info-line last-seen">
              <div className="info-icon">
                <i className="fa fa-history" />
              </div>
              <Moment locale={getLocale()} fromNow={true}>
                {profile.last_seen}
              </Moment>
            </div>
          )}

          <div className="info-line friends">
            <div className="info-icon">
              <i className="fa fa-users" />
            </div>
            <div className="friends-count">
              {profile.friends.length} {_("Friends")}
            </div>
            <div className="friends-list">
              <Link
                to={
                  profile.pk === user.pk
                    ? CLIENT_URLS.USER.FRIEND_LIST.toPath()
                    : CLIENT_URLS.USER.PARTICIPANT_LIST.toPath({
                        getParams: {
                          objectId: profile.pk,
                          contentType: "users:user"
                        }
                      })
                }
              >
                {profile.friends.slice(0, 3).map((friend: any) => (
                  <Image
                    key={friend.pk}
                    src={
                      friend.avatar && friend.avatar.thumbnail_100x100
                        ? friend.avatar.thumbnail_100x100
                        : userSVG
                    }
                    width={30}
                    height={30}
                    roundedCircle={true}
                  />
                ))}
              </Link>
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
                {renderHtml(profile.about)}
              </ShowMore>
            </div>
          </div>
          {user.pk !== profile.pk && (
            <div className="info-line actions">
              {hasRequest(profile) && !isFriend(profile) && (
                <DeleteItem
                  description={_(
                    "Are you sure you want to delete the request?"
                  )}
                  onSuccess={() => refetch()}
                  path={SERVER_URLS.MEMBERSHIP_REQUESTS_DELETE.toPath({
                    urlParams: {
                      membershipPk: profile.request
                    }
                  })}
                >
                  <Button size="sm" className="float-right" variant="danger">
                    <i className="fa fa-trash" /> {_("Drop your request")}
                  </Button>
                </DeleteItem>
              )}
              {!hasRequest(profile) && !isFriend(profile) && (
                <Button
                  size="sm"
                  className="float-right"
                  onClick={() => {
                    addToFriends({
                      content_type: "users:user",
                      object_id: profile.pk
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
                  <i className="fa fa-handshake-o" /> {_("Add to friends")}
                </Button>
              )}
              {isFriend(profile) && (
                <DeleteItem
                  description={_(
                    "Are you sure you want to drop the user from friends?"
                  )}
                  onSuccess={() => refetch()}
                  path={SERVER_URLS.FRIENDS_DELETE.toPath({
                    urlParams: {
                      userSlug: profile.slug
                    }
                  })}
                >
                  <Button size="sm" className="float-right" variant="danger">
                    <i className="fa fa-trash" /> {_("Drop from friends")}
                  </Button>
                </DeleteItem>
              )}
              <LinkContainer
                to={
                  profile.chat
                    ? CLIENT_URLS.USER.CHAT_DETAIL.toPath({
                        urlParams: {
                          chatPk: profile.chat
                        }
                      })
                    : CLIENT_URLS.USER.CHAT_CONVERSATION_CREATE.toPath({
                        urlParams: {
                          recipientSlug: profile.slug
                        }
                      })
                }
              >
                <Button size="sm" className="float-right">
                  <i className="fa fa-comment" /> {_("Send a message")}
                </Button>
              </LinkContainer>
            </div>
          )}
        </div>
        {user.pk === profile.pk && <ProfileMobile profile={profile} />}
        <div className="profile-info block">
          <h2>{_("Contacts")}</h2>
          <ListGroup variant="flush">
            {profile.phone && (
              <ListGroup.Item>
                <span className="item-title">{_("Phone")}:</span>{" "}
                {profile.phone}
              </ListGroup.Item>
            )}
            {profile.skype && (
              <ListGroup.Item>
                <span className="item-title">{_("Skype")}:</span>{" "}
                {profile.skype}
              </ListGroup.Item>
            )}
            <ListGroup.Item>
              <span className="item-title">
                {_("Users can find me here (social links)")}:
              </span>{" "}
              {(!profile.social_links || profile.social_links.length === 0) &&
                _("No links")}
              {profile.social_links &&
                profile.social_links.map((link: string, index: number) => (
                  <span className="social-link" key={index}>
                    <a target="_blank" rel="noopener noreferrer" href={link}>
                      {link}
                    </a>
                  </span>
                ))}
            </ListGroup.Item>
          </ListGroup>
        </div>
        <div className="profile-info block">
          <h2>{_("Profile info")}</h2>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <span className="item-title">{_("Geo")}:</span> {getGeo(profile)}
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="item-title">{_("Real status")}:</span>{" "}
              <ProfileRealStatus
                profile={profile}
                user={user}
                refetch={refetch}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="item-title">{_("Role")}:</span>{" "}
              {profile.role.display}
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="item-title">{_("Gender")}:</span>
              {profile.gender.display}
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="item-title">{_("Age")}:</span>
              {getBirthday(profile)}
              {", "}
              {getBirthdaySecond(profile)}
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="item-title">{_("Formats")}:</span>
              {profile.relationship_formats
                .map((i: any) => i.display)
                .join(", ")}
            </ListGroup.Item>
            <ListGroup.Item>
              <span className="item-title">{_("Themes")}:</span>
              {profile.relationship_themes
                .map((i: any) => i.display)
                .join(", ")}
            </ListGroup.Item>
          </ListGroup>
        </div>
        {profile.pk && <ProfileMedia profile={profile} user={user} />}
        {profile.pk && <ProfilePosts profile={profile} user={user} />}
      </div>
    </div>
  );
};

export default Profile;
