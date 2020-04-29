import React from "react";
import {
  Card,
  Media,
  Row,
  Col,
  Button,
  Nav,
  ButtonGroup
} from "react-bootstrap";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";

import Image from "generic/components/Image";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import pictureSVG from "generic/layout/images/picture.svg";

import List from "desktop/containers/Generics/List";
import { CountersConsumer } from "generic/containers/ContextProviders/CountersService";
import { renderHtml } from "utils";
import FormSelect from "generic/components/Form/FormSelect";
import {
  REQUESTS,
  REQUEST_APPROVED,
  REQUEST_NONE,
  REQUEST_DECLINED
} from "generic/constants";
import { getDisplayValue } from "utils";
import { Mutate } from "restful-react";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import handleErrors from "desktop/components/ResponseErrors/utils";
import { _ } from "trans";

interface IPropsWrapper extends RouteComponentProps {
  match: any;
}

interface IProps extends IPropsWrapper {
  counters: any;
}

class PartyList extends React.PureComponent<IProps> {
  public renderTitle = (getParams: any) => {
    if (getParams.is_ban) {
      return _("Parties (ban)");
    }
    if (getParams.status) {
      return `${_("Parties")} (${getDisplayValue(getParams.status, REQUESTS)})`;
    }
    return _("Parties");
  };

  public renderItem = (item: any, getParams: any, refetch: any) => {
    return (
      <Col lg={12} className="moderator-party-item-container">
        <Media>
          <Link
            target="_blank"
            to={CLIENT_URLS.USER.PARTY_DETAIL.buildPath({
              partySlug: item.slug
            })}
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
            <Row className="party-item-data">
              <Col lg={8}>
                <Link
                  target="_blank"
                  to={CLIENT_URLS.USER.PARTY_DETAIL.buildPath({
                    partySlug: item.slug
                  })}
                >
                  <span className="text-break">{item.name}</span>
                </Link>
                <div className="text-break party-item-info">
                  <i className="fa fa-map-marker-alt" />{" "}
                  {item.city ? item.city.country.name : ""}
                  {item.city ? ", " : ""}
                  {item.city ? item.city.name : ""}
                </div>
                <br />
                <div className="text-break party-item-info">
                  {renderHtml(item.description)}
                </div>
              </Col>
              <Col lg={3} className="party-item-actions">
                <ButtonGroup vertical={true} className="float-right">
                  {item.status !== REQUEST_APPROVED && (
                    <Mutate
                      verb="PATCH"
                      path={SERVER_URLS.MODERATION_PARTY_APPROVE.buildPath({
                        partyPk: item.pk
                      })}
                    >
                      {moderate => (
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() =>
                            confirmAlert({
                              title: _("Are you sure?"),
                              message: _(
                                "Are you sure you want to approve the party?"
                              ),
                              buttons: [
                                {
                                  label: _("Yes"),
                                  onClick: () => {
                                    moderate({})
                                      .then((result: any) => {
                                        toast.success(_("Successfully"));
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
                          <i className="fa fa-check" /> {_("Approve")}
                        </Button>
                      )}
                    </Mutate>
                  )}
                  {item.status !== REQUEST_DECLINED && (
                    <Mutate
                      verb="PATCH"
                      path={SERVER_URLS.MODERATION_PARTY_DECLINE.buildPath({
                        partyPk: item.pk
                      })}
                    >
                      {moderate => (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            confirmAlert({
                              title: _("Are you sure?"),
                              message: _(
                                "Are you sure you want to decline the party?"
                              ),
                              buttons: [
                                {
                                  label: _("Yes"),
                                  onClick: () => {
                                    moderate({})
                                      .then((result: any) => {
                                        toast.success(_("Successfully"));
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
                          <i className="fa fa-fa-times-circle" /> {_("Decline")}
                        </Button>
                      )}
                    </Mutate>
                  )}
                  {!item.is_ban && (
                    <Mutate
                      verb="PATCH"
                      path={SERVER_URLS.MODERATION_PARTY_TOGGLE_BAN.buildPath({
                        partyPk: item.pk
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
                                "Are you sure you want to ban the party?"
                              ),
                              buttons: [
                                {
                                  label: _("Yes"),
                                  onClick: () => {
                                    moderate({})
                                      .then((result: any) => {
                                        toast.success(_("Successfully"));
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
                          <i className="fa fa-ban" /> {_("ban")}
                        </Button>
                      )}
                    </Mutate>
                  )}
                  {item.is_ban && (
                    <Mutate
                      verb="PATCH"
                      path={SERVER_URLS.MODERATION_PARTY_TOGGLE_BAN.buildPath({
                        partyPk: item.pk
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
                                "Are you sure you want to unban the party?"
                              ),
                              buttons: [
                                {
                                  label: _("Yes"),
                                  onClick: () => {
                                    moderate({})
                                      .then((result: any) => {
                                        toast.success(_("Successfully"));
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
  };

  public renderFilters = (getParams: any, onChangeGetParams: any) => {
    return (
      <>
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="fa fa-list" /> {_("Type")}
            </Card.Title>
            <Nav className="flex-column">
              <Nav.Link
                onClick={() =>
                  onChangeGetParams({ is_ban: undefined, status: undefined })
                }
              >
                <i className="fa fa-list" /> {_("All")}
              </Nav.Link>
              <Nav.Link onClick={() => onChangeGetParams({ is_ban: "true" })}>
                <i className="fa fa-ban" /> {_("Banned")}
              </Nav.Link>
            </Nav>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="fa fa-filter" /> {_("Filters")}
            </Card.Title>
            <FormSelect
              label={_("Status")}
              name="status"
              isClearable={true}
              options={REQUESTS}
              value={
                getParams.status
                  ? {
                      value: getParams.status,
                      display: getDisplayValue(getParams.status, REQUESTS)
                    }
                  : {
                      value: REQUEST_NONE,
                      display: getDisplayValue(REQUEST_NONE, REQUESTS)
                    }
              }
              onChange={(target: any) =>
                onChangeGetParams({
                  status: target.value ? target.value.value : undefined
                })
              }
            />
          </Card.Body>
        </Card>
      </>
    );
  };

  public render() {
    return (
      <List
        listClientPath={CLIENT_URLS.MODERATOR.PARTY_LIST.buildPath()}
        listServerPath={SERVER_URLS.MODERATION_PARTIES}
        renderTitle={this.renderTitle}
        renderItem={this.renderItem}
        renderFilters={this.renderFilters}
      />
    );
  }
}

const PartyListWrapper: React.FC<IPropsWrapper> = props => (
  <CountersConsumer>
    {context => context && <PartyList {...props} counters={context.counters} />}
  </CountersConsumer>
);

export default PartyListWrapper;
