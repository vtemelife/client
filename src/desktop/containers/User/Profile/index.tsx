import React from "react";
import compose from "lodash/flowRight";
import {
  Button,
  Col,
  Card,
  Alert,
  Row,
  ButtonGroup,
  Modal
} from "react-bootstrap";
import { Mutate } from "restful-react";
import { RouteComponentProps } from "react-router";
import { LinkContainer } from "react-router-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Moment from "react-moment";

import userSVG from "generic/layout/images/user.svg";
import Loading from "generic/components/Loading";
import Image from "generic/components/Image";
import BlockMediaFolders from "desktop/components/BlockMediaFolders";
import Participants from "desktop/components/Participants";
import BlockPosts from "desktop/components/BlockPosts";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";

import { getLocale, renderHtml } from "utils";
import ResponseErrors from "desktop/components/ResponseErrors";
import { ROLE_GUEST } from "generic/constants";
import Delete from "desktop/containers/Generics/Delete";
import {
  SERVICE_NOTIFICATION,
  MSG_TYPE_UPDATE_COUNTERS
} from "generic/containers/ContextProviders/WebSocketService/constants";
import handleErrors from "desktop/components/ResponseErrors/utils";
import { _ } from "trans";
import { confirmAlert } from "react-confirm-alert";
import FormCheckBoxes from "generic/components/Form/FormCheckBoxes";
import { USER_BL_REASONS, USER_BL_REASON_OTHER } from "generic/constants";
import FormRichEditor from "generic/components/Form/FormRichEditor";
import { getBirthday, getBirthdaySecond, getGeo } from "./utils";
import {
  withAuthUser,
  withGlobalStates,
  withWebSocket,
  withRestGet
} from "generic/containers/Decorators";

interface IProps extends RouteComponentProps {
  match: any;
  profile: any;
  authUser: any;
  sockets: any;
  states: any;
}

interface IState {
  searchPosts?: string;
  approvedRealStatus?: boolean;
  addToBLDialog: boolean;
  reasonBL: string;
  reasonBLMsg: string;
}

class Profile extends React.PureComponent<IProps, IState> {
  public state = {
    searchPosts: undefined,
    approvedRealStatus: undefined,
    addToBLDialog: false,
    reasonBL: "",
    reasonBLMsg: ""
  };

  public onSearchPosts = (search: string) => {
    this.setState({ searchPosts: search });
  };

  public onDeleteSuccess = () => {
    toast.success(_("You removed the user from friends."));
    this.props.history.push(
      CLIENT_URLS.USER.PROFILE.buildPath({
        userSlug: this.props.authUser.user.slug
      })
    );
  };

  public toggleAddToBLDialog = (show: boolean) => {
    this.setState({ addToBLDialog: show });
    if (!show) {
      this.setState({ reasonBL: "", reasonBLMsg: "" });
    }
  };

  public onChangeReasonBL = (value: any) => {
    this.setState({ reasonBL: value });
  };

  public onChangeReasonBLMsg = (value: any) => {
    this.setState({ reasonBLMsg: value });
  };

  public render() {
    const profile = this.props.profile.response;
    if (this.props.profile.error) {
      return <ResponseErrors error={this.props.profile.error} />;
    }
    if (!profile || this.props.profile.loading) {
      return <Loading />;
    }

    if (profile.is_deleted) {
      return (
        <>
          <Col lg={3} className="profile-container profile-left">
            <Card>
              <Image variant="top" width="100%" src={userSVG} />
            </Card>
          </Col>
          <Col lg={7} className="profile-container profile">
            <Card>
              <Card.Body>
                <Card.Title>{_("The user has deleted own profile")}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </>
      );
    }

    if (profile.black_list.indexOf(this.props.authUser.user.pk) > -1) {
      return (
        <>
          <Col lg={3} className="profile-container profile-left">
            <Card>
              <Image variant="top" width="100%" src={userSVG} />
            </Card>
          </Col>
          <Col lg={7} className="profile-container profile">
            <Card>
              <Card.Body>
                <Card.Title>
                  {_(
                    "You cannot view the user's profile and communicate with the user cause you are in blacklist for the user"
                  )}
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </>
      );
    }

    const isOwnProfile = profile.pk === this.props.authUser.user.pk;
    const isFriend =
      profile.friends
        .map((i: any) => i.pk)
        .indexOf(this.props.authUser.user.pk) !== -1;

    return (
      <>
        <Helmet>
          <title>{profile.name}</title>
          <meta name="description" content={profile.name} />
        </Helmet>
        <Col lg={3} className="profile-container profile-left">
          <Card>
            {profile.avatar && profile.avatar.thumbnail_500x500 ? (
              <Image
                variant="top"
                width="100%"
                src={profile.avatar.thumbnail_500x500}
              />
            ) : (
              <Image variant="top" width="100%" src={userSVG} />
            )}
            <Card.Body>
              {isOwnProfile ? (
                <div className="d-flex justify-content-center">
                  <ButtonGroup vertical={true}>
                    <LinkContainer to={CLIENT_URLS.USER.SETTINGS.buildPath()}>
                      <Button variant="primary" size="sm">
                        <i className="fa fa-cogs" /> {_("Change profile")}
                      </Button>
                    </LinkContainer>
                    <Button
                      variant={
                        this.props.states.isDisplayImages ? "danger" : undefined
                      }
                      onClick={this.props.states.toggleDisplayImages}
                      size="sm"
                    >
                      {this.props.states.isDisplayImages ? (
                        <i className="fa fa-eye-slash" />
                      ) : (
                        <i className="fa fa-eye" />
                      )}{" "}
                      {this.props.states.isDisplayImages
                        ? _("Hide pictures")
                        : _("Show pictures")}
                    </Button>
                  </ButtonGroup>
                </div>
              ) : (
                <div className="d-flex justify-content-center">
                  <ButtonGroup vertical={true}>
                    {!isFriend ? (
                      <Mutate
                        verb="POST"
                        path={SERVER_URLS.MEMBERSHIP_REQUESTS_CREATE.buildPath()}
                      >
                        {(requestFriend, response) => (
                          <Button
                            size="sm"
                            onClick={() => {
                              confirmAlert({
                                title: _("Are you sure?"),
                                message: _(
                                  "Are you sure you want to add the user to friends?"
                                ),
                                buttons: [
                                  {
                                    label: _("Yes"),
                                    onClick: () => {
                                      requestFriend({
                                        content_type: "users:user",
                                        object_id: profile.pk
                                      })
                                        .then((result: any) => {
                                          toast.success(
                                            _(
                                              "You have sent a request to the user. Waiting for approval. You can see all requests in the menu Friends -> Requests."
                                            ),
                                            { autoClose: 15000 }
                                          );
                                          this.props.sockets.sendSockJsMessage({
                                            service: SERVICE_NOTIFICATION,
                                            sender: this.props.authUser.user.pk,
                                            recipients: [profile.pk],
                                            message_type: MSG_TYPE_UPDATE_COUNTERS,
                                            data: {}
                                          });
                                        })
                                        .catch((errors: any) => {
                                          if (
                                            errors.data &&
                                            errors.data.friend &&
                                            errors.data.friend.length > 0
                                          ) {
                                            toast.error(errors.data.friend[0]);
                                          } else {
                                            handleErrors(errors);
                                          }
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
                            <i className="fa fa-plus" /> {_("Add to friends")}
                          </Button>
                        )}
                      </Mutate>
                    ) : (
                      <Delete
                        description={_(
                          "Are you sure you want to delete the user from friends?"
                        )}
                        onSuccess={this.onDeleteSuccess}
                        destoryServerPath={SERVER_URLS.FRIENDS_DELETE.buildPath(
                          { userSlug: profile.slug }
                        )}
                      >
                        <Button size="sm" variant="danger">
                          <i className="fa fa-trash" /> {_("Drop from friends")}
                        </Button>
                      </Delete>
                    )}
                    {this.props.authUser.user.black_list.indexOf(profile.pk) ===
                      -1 && (
                      <Button
                        variant="danger"
                        onClick={() => this.toggleAddToBLDialog(true)}
                        size="sm"
                      >
                        <i className="fa fa-deaf" /> {_("Add to black list")}
                      </Button>
                    )}
                    <LinkContainer
                      to={
                        profile.chat
                          ? CLIENT_URLS.USER.CHAT_DETAIL.buildPath({
                              chatPk: profile.chat
                            })
                          : CLIENT_URLS.USER.CHAT_CONVERSATION_CREATE.buildPath(
                              {
                                recipientSlug: profile.slug
                              }
                            )
                      }
                    >
                      <Button
                        size="sm"
                        variant="primary"
                        className="float-right"
                      >
                        <i className="fa fa-paper-plane" />{" "}
                        {_("Send a message")}
                      </Button>
                    </LinkContainer>
                  </ButtonGroup>
                </div>
              )}
            </Card.Body>
          </Card>

          <div>
            <Participants
              title={_("Friends online")}
              participants={profile.online_friends}
            />

            <Participants title={_("Friends")} participants={profile.friends} />
          </div>
        </Col>
        <Col lg={7} className="profile-container profile">
          <Card>
            <Card.Body>
              <Card.Title>
                {profile.online ? (
                  <i className="fa fa-circle text-link" />
                ) : null}{" "}
                <span className="username text-ellipsis">{profile.name}</span>
                {!isOwnProfile && profile.last_seen && (
                  <div className="title-last-seen">
                    <Moment locale={getLocale()} fromNow={true}>
                      {profile.last_seen}
                    </Moment>
                  </div>
                )}
              </Card.Title>
              {this.props.authUser.user.black_list.indexOf(profile.pk) > -1 && (
                <Alert dismissible={true} variant="danger">
                  <div>{_("This user is in your black list")}</div>
                  <hr />
                  <div className="d-flex">
                    <ButtonGroup vertical={true}>
                      <LinkContainer
                        to={CLIENT_URLS.USER.BLACKLIST_LIST.buildPath()}
                      >
                        <Button size="sm" variant="danger">
                          <i className="fa fa-deaf" /> {_("Black list")}
                        </Button>
                      </LinkContainer>
                    </ButtonGroup>
                  </div>
                </Alert>
              )}
              {isOwnProfile && profile.role.value === ROLE_GUEST && (
                <Alert dismissible={true} variant="danger">
                  <div>
                    {_(
                      "You have 'Guest' role on the site. You can not see list of groups, clubs, parties."
                    )}
                    <hr />
                    {_(
                      "Complete your profile and get 'Member' role. Provide the avatar and 'About me' information."
                    )}
                  </div>
                  <hr />
                  <div className="d-flex">
                    <ButtonGroup vertical={true}>
                      <LinkContainer to={CLIENT_URLS.USER.SETTINGS.buildPath()}>
                        <Button size="sm">
                          <i className="fa fa-cogs" /> {_("Change profile")}
                        </Button>
                      </LinkContainer>
                      <LinkContainer
                        to={CLIENT_URLS.USER.CHAT_WITH_MODERATORS_CREATE.buildPath()}
                      >
                        <Button size="sm" variant="danger">
                          <i className="fa fa-comment" />{" "}
                          {_("Chat with support")}
                        </Button>
                      </LinkContainer>
                    </ButtonGroup>
                  </div>
                </Alert>
              )}
              {isOwnProfile && !profile.is_real && profile.approver && (
                <Alert dismissible={true} variant="warning">
                  {_("User")}{" "}
                  <Link
                    to={CLIENT_URLS.USER.PROFILE.buildPath({
                      userSlug: profile.approver.slug
                    })}
                  >
                    {profile.approver.name}
                  </Link>{" "}
                  {_("give your a real status. Waiting for moderation.")}
                </Alert>
              )}
              <div>
                {renderHtml(profile.about)}
                <hr />
                <p>
                  <span className="title">{_("Gender")}:</span>{" "}
                  {profile.gender.display}
                </p>
                <p>
                  <span className="title">{_("Age")}:</span>
                  <br />
                  {getBirthday(profile)}
                  <br />
                  {getBirthdaySecond(profile)}
                </p>
                <p>
                  <span className="title">{_("Formats")}:</span>{" "}
                  {profile.relationship_formats
                    .map((item: any) => item.display)
                    .join(", ")}
                </p>
                <p>
                  <span className="title">{_("Themes")}:</span>{" "}
                  {profile.relationship_themes
                    .map((item: any) => item.display)
                    .join(", ")}
                </p>
                <p>
                  <span className="title">{_("Geo")}:</span> {getGeo(profile)}
                </p>
                {profile.social_links && profile.social_links.length > 0 && (
                  <p>
                    <span className="title">
                      {_("Users can find me here (social links)")}:
                    </span>
                    {profile.social_links.map((link: string, index: number) => (
                      <span key={index}>
                        <br />
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={link}
                        >
                          {link}
                        </a>
                      </span>
                    ))}
                  </p>
                )}
                {profile.phone && (
                  <p>
                    <span className="title">{_("Phone")}:</span> {profile.phone}
                  </p>
                )}
                {profile.skype && (
                  <p>
                    <span className="title">{_("Skype")}:</span> {profile.skype}
                  </p>
                )}
                <p>
                  <span className="title">{_("Real status")}:</span>{" "}
                  {profile.is_real ? (
                    <>
                      <span>
                        <i className="fa fa-user-circle" /> {_("Approved")}{" "}
                      </span>
                      {profile.approver ? (
                        <span>
                          {_("by user")}{" "}
                          <Link
                            to={CLIENT_URLS.USER.PROFILE.buildPath({
                              userSlug: profile.approver.slug
                            })}
                          >
                            {profile.approver.name}
                          </Link>
                        </span>
                      ) : null}
                    </>
                  ) : null}
                  {!profile.is_real && isOwnProfile ? (
                    <Button
                      size="sm"
                      variant="primary"
                      className="edit-btn"
                      onClick={() => {
                        toast.success(
                          _(
                            "Write to support or ask a friend with real status to click on this button on your profile and approve."
                          ),
                          { autoClose: 15000 }
                        );
                      }}
                    >
                      {_("Get a real status")}
                    </Button>
                  ) : null}
                  {!profile.is_real && !isOwnProfile
                    ? _("No real status")
                    : null}{" "}
                  {!profile.is_real &&
                  !isOwnProfile &&
                  this.props.authUser.user.is_real ? (
                    <Mutate
                      verb="PATCH"
                      path={SERVER_URLS.PROFILE_GIVE_REAL_STATUS.buildPath({
                        userSlug: profile.slug
                      })}
                    >
                      {(giveRealStatus, response) => (
                        <Button
                          disabled={this.state.approvedRealStatus !== undefined}
                          size="sm"
                          variant="primary"
                          className="edit-btn"
                          onClick={() => {
                            giveRealStatus({})
                              .then((result: any) => {
                                toast.success(
                                  _(
                                    "You approved the real status for the user. Waiting for moderation."
                                  ),
                                  { autoClose: 15000 }
                                );
                                this.setState({ approvedRealStatus: true });
                              })
                              .catch((errors: any) => {
                                if (
                                  errors.data &&
                                  errors.data.friend &&
                                  errors.data.friend.length > 0
                                ) {
                                  toast.error(errors.data.friend[0]);
                                  this.setState({ approvedRealStatus: false });
                                } else {
                                  handleErrors(errors);
                                }
                              });
                          }}
                        >
                          {_("Approve a real status")}
                        </Button>
                      )}
                    </Mutate>
                  ) : null}
                </p>
                <p>
                  <span className="title">{_("Role")}:</span>{" "}
                  {profile.role.display}
                </p>
              </div>
            </Card.Body>
          </Card>
          <Row>
            <BlockMediaFolders
              objectId={profile.pk}
              contentType="users:user"
              isReadonly={!isOwnProfile}
              size={12}
              maxHeight={280}
            />
          </Row>
          <Row>
            <BlockPosts
              objectId={profile.pk}
              contentType="users:user"
              isReadonly={!isOwnProfile}
              size={12}
            />
          </Row>
        </Col>
        <Mutate verb="POST" path={SERVER_URLS.BLACKLIST_CREATE.buildPath()}>
          {requestAddToBL => (
            <Modal
              show={this.state.addToBLDialog}
              onHide={() => this.toggleAddToBLDialog(false)}
            >
              <Modal.Header closeButton={true}>
                <Modal.Title>{_("Reason")}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Col lg={12}>
                    <FormCheckBoxes
                      type="radio"
                      name="reason"
                      label={`${_("Reason")}:`}
                      checkboxes={USER_BL_REASONS}
                      value={this.state.reasonBL}
                      onChange={(target: any) =>
                        this.onChangeReasonBL(target.target.id)
                      }
                    />
                  </Col>
                </Row>
                <hr />
                {this.state.reasonBL === USER_BL_REASON_OTHER && (
                  <FormRichEditor
                    label={_("My reason")}
                    name="reason_message"
                    required={true}
                    value={this.state.reasonBLMsg}
                    onChange={(target: any) =>
                      this.onChangeReasonBLMsg(target.value)
                    }
                  />
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => this.toggleAddToBLDialog(false)}
                >
                  {_("Cancel")}
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    requestAddToBL({
                      reason: this.state.reasonBL,
                      reason_message: this.state.reasonBLMsg,
                      user: profile.pk
                    })
                      .then((result: any) => {
                        toast.success(
                          _(
                            "You have added the user to the blacklist. You can view your blacklist in Friends menu."
                          )
                        );
                        this.toggleAddToBLDialog(false);
                        this.props.authUser.refetch();
                      })
                      .catch((errors: any) => {
                        if (
                          errors.data &&
                          errors.data.user &&
                          errors.data.user.length > 0
                        ) {
                          toast.error(errors.data.user[0]);
                        } else {
                          handleErrors(errors);
                        }
                      });
                  }}
                >
                  <i className="fa fa-deaf" /> {_("Add to black list")}
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </Mutate>
      </>
    );
  }
}

const withAuth = withAuthUser({
  propName: "authUser"
});

const withStates = withGlobalStates({
  propName: "states"
});

const withWebSocketData = withWebSocket({
  propName: "socket"
});

const withProfile = withRestGet({
  propName: "profile",
  path: (props: any) =>
    SERVER_URLS.PROFILE.buildPath({
      userSlug: props.match.params.userSlug
    })
});

export default compose(
  withAuth,
  withStates,
  withWebSocketData,
  withProfile
)(Profile);
