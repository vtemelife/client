import React from "react";
import { Media, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Mutate } from "restful-react";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";

import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import { ROLE_GUEST } from "generic/constants";
import usersSVG from "generic/layout/images/users.svg";
import { _ } from "trans";

import Image from "generic/components/Image";
import { renderHtml } from "utils";
import handleErrors from "desktop/components/ResponseErrors/utils";
import {
  getBirthday,
  getBirthdaySecond,
  getGeo
} from "../../../User/Profile/utils";
import ShowMore from "react-show-more";

interface IProps {
  item: any;
  refetch: any;
}

class UserItem extends React.PureComponent<IProps> {
  public render() {
    const item = this.props.item;
    return (
      <Col lg={12} className="user-item-container">
        <Media>
          <Link
            target="_blank"
            to={CLIENT_URLS.USER.PROFILE.buildPath({ userSlug: item.slug })}
          >
            {item.avatar && item.avatar.thumbnail_100x100 ? (
              <Image
                width={50}
                height={50}
                className="mr-3"
                src={item.avatar.thumbnail_100x100}
                roundedCircle={true}
              />
            ) : (
              <Image
                width={50}
                height={50}
                className="mr-3"
                src={usersSVG}
                roundedCircle={true}
              />
            )}
          </Link>
          <Media.Body>
            <Row className="user-item-data">
              <Col lg={8}>
                <Link
                  target="_blank"
                  to={CLIENT_URLS.USER.PROFILE.buildPath({
                    userSlug: item.slug
                  })}
                >
                  <span className="text-break">{item.name}</span>
                </Link>
                <div className="text-break user-item-info">
                  {item.approver && (
                    <p>
                      <span className="title">
                        {_("Who approved real status")}:
                      </span>{" "}
                      <Link
                        target="_blank"
                        to={CLIENT_URLS.USER.PROFILE.buildPath({
                          userSlug: item.approver.slug
                        })}
                      >
                        <span className="text-break">{item.approver.name}</span>
                      </Link>
                    </p>
                  )}
                  <p>
                    <span className="title">{_("Geo")}:</span> {getGeo(item)}
                  </p>
                  <p>
                    <span className="title">{_("Gender")}:</span>{" "}
                    {item.gender.display}
                  </p>
                  <p>
                    <span className="title">{_("Age")}:</span>
                    <br />
                    {getBirthday(item)}
                    <br />
                    {getBirthdaySecond(item)}
                  </p>
                  <p>
                    <span className="title">{_("Formats")}:</span>{" "}
                    {item.relationship_formats
                      .map((i: any) => i.display)
                      .join(", ")}
                  </p>
                  <p>
                    <span className="title">{_("Themes")}:</span>{" "}
                    {item.relationship_themes
                      .map((i: any) => i.display)
                      .join(", ")}
                  </p>
                </div>
                {item.about && (
                  <div className="text-break user-item-description">
                    <ShowMore
                      lines={10}
                      more={_("Show more")}
                      less={_("Show less")}
                      anchorClass=""
                    >
                      {renderHtml(item.about)}
                    </ShowMore>
                  </div>
                )}
              </Col>
              <Col lg={4} className="user-item-actions">
                <ButtonGroup vertical={true} className="float-right">
                  {item.role.value === ROLE_GUEST && (
                    <Mutate
                      verb="PATCH"
                      path={SERVER_URLS.MODERATION_USER_SET_MEMBER.buildPath({
                        userPk: item.pk
                      })}
                    >
                      {moderate => (
                        <Button
                          size="sm"
                          onClick={() =>
                            confirmAlert({
                              title: _("Are you sure?"),
                              message: _(
                                "Are you sure you want to give the user 'Member' status?"
                              ),
                              buttons: [
                                {
                                  label: _("Yes"),
                                  onClick: () => {
                                    moderate({})
                                      .then((result: any) => {
                                        toast.success(_("Successfully"));
                                        this.props.refetch();
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
                          <i className="fa fa-user" /> {_("member")}
                        </Button>
                      )}
                    </Mutate>
                  )}
                  {!item.is_real && item.approver && (
                    <Mutate
                      verb="PATCH"
                      path={SERVER_URLS.MODERATION_USER_SET_REAL.buildPath({
                        userPk: item.pk
                      })}
                    >
                      {moderate => (
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() =>
                            confirmAlert({
                              title: _("Are you sure?"),
                              message: _("Approve real?"),
                              buttons: [
                                {
                                  label: _("Yes"),
                                  onClick: () => {
                                    moderate({})
                                      .then((result: any) => {
                                        toast.success(_("Successfully"));
                                        this.props.refetch();
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
                          <i className="fa fa-check" /> {_("Approve")}{" "}
                          {_("real")}
                        </Button>
                      )}
                    </Mutate>
                  )}
                  {!item.is_real && !item.approver && (
                    <Mutate
                      verb="PATCH"
                      path={SERVER_URLS.MODERATION_USER_SET_REAL.buildPath({
                        userPk: item.pk
                      })}
                    >
                      {moderate => (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            confirmAlert({
                              title: _("Are you sure?"),
                              message: _("Give real from administrator?"),
                              buttons: [
                                {
                                  label: _("Yes"),
                                  onClick: () => {
                                    moderate({ approver: null })
                                      .then((result: any) => {
                                        toast.success(_("Successfully"));
                                        this.props.refetch();
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
                          <i className="fa fa-exclamation" /> {_("give real")}
                        </Button>
                      )}
                    </Mutate>
                  )}
                  {!item.is_ban && (
                    <Mutate
                      verb="PATCH"
                      path={SERVER_URLS.MODERATION_USER_TOGGLE_BAN.buildPath({
                        userPk: item.pk
                      })}
                    >
                      {moderate => (
                        <Button
                          size="sm"
                          variant={!item.is_ban ? "danger" : "success"}
                          onClick={() =>
                            confirmAlert({
                              title: _("Are you sure?"),
                              message: _(
                                "Are you sure you want to ban the user?"
                              ),
                              buttons: [
                                {
                                  label: _("Yes"),
                                  onClick: () => {
                                    moderate({})
                                      .then((result: any) => {
                                        toast.success(_("Successfully"));
                                        this.props.refetch();
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
                          <i className="fa fa-ban" /> {_("ban")}
                        </Button>
                      )}
                    </Mutate>
                  )}
                  {item.is_ban && (
                    <Mutate
                      verb="PATCH"
                      path={SERVER_URLS.MODERATION_USER_TOGGLE_BAN.buildPath({
                        userPk: item.pk
                      })}
                    >
                      {moderate => (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() =>
                            confirmAlert({
                              title: _("Are you sure?"),
                              message: _(
                                "Are you sure you want to unban the user?"
                              ),
                              buttons: [
                                {
                                  label: _("Yes"),
                                  onClick: () => {
                                    moderate({})
                                      .then((result: any) => {
                                        toast.success(_("Successfully"));
                                        this.props.refetch();
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
                          <i className="fa fa-check" /> {_("Unban")}
                        </Button>
                      )}
                    </Mutate>
                  )}
                </ButtonGroup>
              </Col>
            </Row>
          </Media.Body>
        </Media>
        <hr />
      </Col>
    );
  }
}

export default UserItem;
