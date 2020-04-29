import React from "react";
import { Media, Button, Col, Row, ButtonGroup } from "react-bootstrap";
import { Mutate } from "restful-react";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import handleErrors from "desktop/components/ResponseErrors/utils";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import { renderHtml } from "utils";
import Image from "generic/components/Image";
import { REQUEST_APPROVED, REQUEST_DECLINED } from "generic/constants";
import FormSelect from "generic/components/Form/FormSelect";
import pictureSVG from "generic/layout/images/picture.svg";
import { _ } from "trans";
import { POST_THEMES } from "generic/constants";

interface IProps {
  item: any;
  refetch: any;
}

interface IState {
  theme: any;
}

class PostItem extends React.PureComponent<IProps, IState> {
  public state = {
    theme: {
      value: undefined
    }
  };
  public render() {
    const item = this.props.item;
    return (
      <Col lg={12} className="post-item-container">
        <Media>
          <Link
            target="_blank"
            to={CLIENT_URLS.POSTS_DETAIL.buildPath({ postSlug: item.slug })}
          >
            {item.image && item.image.thumbnail_100x100 ? (
              <Image
                width={50}
                height={50}
                className="mr-3"
                src={item.image.thumbnail_100x100}
              />
            ) : (
              <Image width={50} height={50} className="mr-3" src={pictureSVG} />
            )}
          </Link>
          <Media.Body>
            <Row className="post-item-data">
              <Col lg={8}>
                <Link
                  target="_blank"
                  to={CLIENT_URLS.POSTS_DETAIL.buildPath({
                    postSlug: item.slug
                  })}
                >
                  <span className="text-break">{item.title}</span>
                </Link>
                <div className="text-break post-item-info">
                  <Link
                    target="_blank"
                    to={CLIENT_URLS.USER.PROFILE.buildPath({
                      userSlug: item.creator.slug
                    })}
                  >
                    <i className="fa fa-user" /> {item.creator.name}
                  </Link>
                </div>
                <div className="text-break post-item-info">
                  {renderHtml(item.description)}
                </div>
              </Col>
              <Col lg={3}>
                <FormSelect
                  required={true}
                  placeholder={_("theme")}
                  name="theme"
                  options={POST_THEMES}
                  onChange={(target: any) =>
                    this.setState({ theme: target.value })
                  }
                />
                <ButtonGroup vertical={true} className="float-right">
                  {item.status !== REQUEST_APPROVED && (
                    <Mutate
                      verb="PATCH"
                      path={SERVER_URLS.MODERATION_POST_APPROVE.buildPath({
                        postPk: item.pk
                      })}
                    >
                      {moderate => (
                        <>
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={() =>
                              confirmAlert({
                                title: _("Are you sure?"),
                                message: _(
                                  "Are you sure you want to approve the post?"
                                ),
                                buttons: [
                                  {
                                    label: _("Yes"),
                                    onClick: () => {
                                      if (!this.state.theme.value) {
                                        toast.error(_("Choose a theme."));
                                        return;
                                      }
                                      moderate({
                                        theme: this.state.theme.value
                                      })
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
                            <i className="fa fa-check" /> {_("Approve")}
                          </Button>
                        </>
                      )}
                    </Mutate>
                  )}
                  {item.status !== REQUEST_DECLINED && (
                    <Mutate
                      verb="PATCH"
                      path={SERVER_URLS.MODERATION_POST_DECLINE.buildPath({
                        postPk: item.pk
                      })}
                    >
                      {moderate => (
                        <>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                              confirmAlert({
                                title: _("Are you sure?"),
                                message: _(
                                  "Are you sure you want to decline the post?"
                                ),
                                buttons: [
                                  {
                                    label: _("Yes"),
                                    onClick: () => {
                                      moderate({
                                        theme: this.state.theme.value
                                      })
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
                            <i className="fa fa-times-circle" /> {_("Decline")}
                          </Button>
                        </>
                      )}
                    </Mutate>
                  )}
                  {!item.is_ban && (
                    <Mutate
                      verb="PATCH"
                      path={SERVER_URLS.MODERATION_POST_TOGGLE_BAN.buildPath({
                        postPk: item.pk
                      })}
                    >
                      {moderate => (
                        <Button
                          size="sm"
                          variant={!item.is_ban ? "danger" : "success"}
                          className="float-right"
                          onClick={() =>
                            confirmAlert({
                              title: _("Are you sure?"),
                              message: _(
                                "Are you sure you want to ban the post?"
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
                      path={SERVER_URLS.MODERATION_POST_TOGGLE_BAN.buildPath({
                        postPk: item.pk
                      })}
                    >
                      {moderate => (
                        <Button
                          size="sm"
                          variant="success"
                          className="float-right"
                          onClick={() =>
                            confirmAlert({
                              title: _("Are you sure?"),
                              message: _(
                                "Are you sure you want to unban the post?"
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

export default PostItem;
