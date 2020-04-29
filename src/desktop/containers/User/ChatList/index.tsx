import React from "react";
import compose from "lodash/flowRight";
import { Card, Nav, Media, Badge, Button, Row, Col } from "react-bootstrap";
import { RouteComponentProps } from "react-router";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { confirmAlert } from "react-confirm-alert";

import Image from "generic/components/Image";
import { SERVER_URLS } from "routes/server";
import { CLIENT_URLS } from "desktop/routes/client";
import usersSVG from "generic/layout/images/users.svg";

import List from "desktop/containers/Generics/List";
import Delete from "desktop/containers/Generics/Delete";

import { TYPE_CONVERSATION, TYPE_CHAT } from "generic/constants";
import { _ } from "trans";
import { getLocale } from "utils";
import {
  withAuthUser,
  withCounters,
  withRestMutate
} from "generic/containers/Decorators";
import handleErrors from "desktop/components/ResponseErrors/utils";
import { toast } from "react-toastify";

interface IProps extends RouteComponentProps {
  match: any;
  authUser: any;
  counters: any;
  readAll: any;
}

class ChatList extends React.PureComponent<IProps> {
  public readAll = () => {
    confirmAlert({
      title: _("Are you sure?"),
      message: _("Are you sure you want to read all chats?"),
      buttons: [
        {
          label: _("Yes"),
          onClick: () => {
            this.props.readAll
              .mutate({})
              .then(() => {
                this.props.counters.refetch();
                toast.success(_("All chats have been read."));
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
    });
  };

  public renderTitle = (getParams: any) => {
    if (getParams.is_unread) {
      return _("Not read");
    }
    if (getParams.chat_type === TYPE_CONVERSATION) {
      return _("Dialogs");
    }
    return _("Chats");
  };

  public renderItem = (item: any, getParams: any, refetch: any) => {
    const user = this.props.authUser.user;
    const isModerator = item.moderators.indexOf(user.pk) !== -1;
    const isCreator = item.creator === user.pk;
    const locale = getLocale();
    return (
      <Col lg={12} className="chat-item-container">
        <Media>
          <Link
            to={CLIENT_URLS.USER.CHAT_DETAIL.buildPath({ chatPk: item.pk })}
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
            <Row className="chat-item-data">
              <Col lg={6}>
                <Link
                  to={CLIENT_URLS.USER.CHAT_DETAIL.buildPath({
                    chatPk: item.pk
                  })}
                >
                  <span className="text-break">
                    {item.unread_messages_count > 0 ? (
                      <span className="text-error">
                        <i className="fa fa-eye-slash">
                          {item.unread_messages_count}
                        </i>
                      </span>
                    ) : null}{" "}
                    {"  "}
                    {item.chat_type !== TYPE_CONVERSATION ? (
                      <i className="fa fa-users" />
                    ) : null}{" "}
                    {item.name}
                  </span>
                </Link>
                <div className="chat-item-info">
                  <i className="fa fa-calendar" />{" "}
                  <Moment locale={locale} fromNow={true}>
                    {item.updated_date}
                  </Moment>
                </div>
                <div className="chat-item-info">
                  <i className="fa fa-comments" /> {item.messages_count}
                </div>
              </Col>
              <Col lg={6} className="chat-item-actions">
                {item.chat_type === TYPE_CHAT && isModerator && (
                  <LinkContainer
                    to={CLIENT_URLS.USER.CHAT_UPDATE.buildPath({
                      chatPk: item.pk
                    })}
                  >
                    <Button size="sm">
                      <i className="fa fa-pencil" />
                    </Button>
                  </LinkContainer>
                )}
                {isCreator && (
                  <Delete
                    description={_("Are you sure you want to delete the chat?")}
                    onSuccess={refetch}
                    destoryServerPath={SERVER_URLS.CHAT_DELETE.buildPath({
                      chatPk: item.pk
                    })}
                  >
                    <Button size="sm" variant="danger">
                      <i className="fa fa-trash" />
                    </Button>
                  </Delete>
                )}
              </Col>
            </Row>
          </Media.Body>
        </Media>
        <hr />
      </Col>
    );
  };

  public renderFilters = (getParams: any, onChangeGetParams: any) => {
    const counters = this.props.counters.counters;
    return (
      <>
        {counters.chat_count > 0 && (
          <Card>
            <Card.Body>
              <Card.Title>
                <i className="fa fa-tasks" /> {_("Actions")}
              </Card.Title>
              <Nav className="flex-column">
                <Nav.Link onClick={this.readAll} className="text-error">
                  <i className="fa fa-eye" /> {_("Read all")} (
                  {counters.chat_count})
                </Nav.Link>
              </Nav>
            </Card.Body>
          </Card>
        )}
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="fa fa-users" /> {_("Type")}
            </Card.Title>
            <Nav className="flex-column">
              <Nav.Link
                onClick={() =>
                  onChangeGetParams({
                    is_unread: undefined,
                    chat_type: undefined
                  })
                }
              >
                <i className="fa fa-users" />{" "}
                {this.renderTitle({
                  is_unread: undefined,
                  chat_type: undefined
                })}
              </Nav.Link>
              <Nav.Link
                onClick={() =>
                  onChangeGetParams({
                    is_unread: undefined,
                    chat_type: TYPE_CONVERSATION
                  })
                }
              >
                <i className="fa fa-comment" />{" "}
                {this.renderTitle({
                  is_unread: undefined,
                  chat_type: TYPE_CONVERSATION
                })}
              </Nav.Link>
            </Nav>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="fa fa-filter" /> {_("Filters")}
            </Card.Title>
            <Nav className="flex-column">
              <Nav.Link
                onClick={() =>
                  onChangeGetParams({ is_unread: "true", chat_type: undefined })
                }
              >
                <i className="fa fa-eye-slash" />{" "}
                {this.renderTitle({ is_unread: "true", chat_type: undefined })}{" "}
                {counters.chat_count > 0 && (
                  <Badge variant="primary">{counters.chat_count}</Badge>
                )}
              </Nav.Link>
            </Nav>
          </Card.Body>
        </Card>
      </>
    );
  };

  public render() {
    return (
      <List
        listClientPath={CLIENT_URLS.USER.CHAT_LIST.buildPath()}
        createClientPath={CLIENT_URLS.USER.CHAT_CREATE.buildPath()}
        listServerPath={SERVER_URLS.CHAT_LIST}
        renderTitle={this.renderTitle}
        renderItem={this.renderItem}
        renderFilters={this.renderFilters}
      />
    );
  }
}

const withAuth = withAuthUser({
  propName: "authUser"
});

const withCountersData = withCounters({
  propName: "counters"
});

const withReadAll = withRestMutate({
  propName: "readAll",
  verb: "POST",
  path: () => SERVER_URLS.CHAT_READ_ALL.buildPath()
});

export default compose(withAuth, withCountersData, withReadAll)(ChatList);
