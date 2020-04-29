import React from 'react';
import compose from 'lodash/flowRight';
import { Card, Nav, Media, Badge, Button, Row, Col } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';

import Image from 'generic/components/Image';
import { SERVER_URLS } from 'routes/server';
import { CLIENT_URLS } from 'desktop/routes/client';
import usersSVG from 'generic/layout/images/users.svg';

import List from 'desktop/containers/Generics/List';
import Delete from 'desktop/containers/Generics/Delete';
import {
  TYPE_CHAT_WITH_MODERATORS,
  TYPE_CHAT_WITH_DEVELOPERS,
} from 'generic/constants';
import { _ } from 'trans';
import {
  withAuthUser,
  withCounters,
  withRestMutate,
} from 'generic/containers/Decorators';
import handleErrors from 'desktop/components/ResponseErrors/utils';
import { getLocale } from 'utils';

interface IProps extends RouteComponentProps {
  match: any;
  authUser: any;
  counters: any;
  readAll: any;
}

class ChatList extends React.PureComponent<IProps> {
  public readAll = () => {
    confirmAlert({
      title: _('Are you sure?'),
      message: _('Are you sure you want to read all chats?'),
      buttons: [
        {
          label: _('Yes'),
          onClick: () => {
            this.props.readAll
              .mutate({
                is_moderation_mode: true,
              })
              .then(() => {
                this.props.counters.refetch();
                toast.success(_('You have read all chats.'));
              })
              .catch((errors: any) => {
                handleErrors(errors);
              });
          },
        },
        {
          label: _('No'),
          onClick: () => {
            return;
          },
        },
      ],
    });
  };

  public renderTitle = (queryParams: any) => {
    if (queryParams.is_unread) {
      return _('Unread chats');
    }
    if (queryParams.chat_type === TYPE_CHAT_WITH_MODERATORS) {
      return _('Chat with support');
    }
    return _('Chats');
  };

  public renderItem = (item: any, queryParams: any, refetch: any) => {
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
                    chatPk: item.pk,
                  })}
                >
                  <span className="text-break">
                    {item.unread_messages_count > 0 ? (
                      <span className="text-error">
                        <i className="fa fa-eye-slash">
                          {item.unread_messages_count}
                        </i>
                      </span>
                    ) : null}{' '}
                    {'  '}
                    <i className="fa fa-users" />
                    {item.name}
                  </span>
                </Link>
                <div className="chat-item-info">
                  <i className="fa fa-calendar" />{' '}
                  <Moment locale={locale} fromNow={true}>
                    {item.updated_date}
                  </Moment>
                </div>
                <div className="chat-item-info">
                  <i className="fa fa-comments" /> {item.messages_count}
                </div>
              </Col>
              <Col lg={6} className="chat-item-actions">
                {isModerator ? (
                  <LinkContainer
                    to={CLIENT_URLS.USER.CHAT_UPDATE.buildPath({
                      chatPk: item.pk,
                    })}
                  >
                    <Button size="sm">
                      <i className="fa fa-pencil" />
                    </Button>
                  </LinkContainer>
                ) : null}
                {isCreator && (
                  <Delete
                    title={_('Are you sure?')}
                    description={_('Are you sure you want to delete the chat?')}
                    onSuccess={refetch}
                    destoryServerPath={SERVER_URLS.CHAT_DELETE.buildPath({
                      chatPk: item.pk,
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

  public renderFilters = (queryParams: any, onChangequeryParams: any) => {
    const counters = this.props.counters.counters;
    return (
      <>
        {counters.m_unread_chats > 0 && (
          <Card>
            <Card.Body>
              <Card.Title>
                <i className="fa fa-tasks" /> {_('Actions')}
              </Card.Title>
              <Nav className="flex-column">
                <Nav.Link onClick={this.readAll} className="text-error">
                  <i className="fa fa-eye" /> {_('Read all')} (
                  {counters.m_unread_chats})
                </Nav.Link>
              </Nav>
            </Card.Body>
          </Card>
        )}
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="fa fa-users" /> {_('Type')}
            </Card.Title>
            <Nav className="flex-column">
              <Nav.Link
                onClick={() =>
                  onChangequeryParams({
                    is_unread: undefined,
                    chat_type: TYPE_CHAT_WITH_MODERATORS,
                  })
                }
              >
                <i className="fa fa-users" />{' '}
                {this.renderTitle({
                  is_unread: undefined,
                  chat_type: TYPE_CHAT_WITH_MODERATORS,
                })}
              </Nav.Link>
              <Nav.Link
                onClick={() =>
                  onChangequeryParams({
                    is_unread: undefined,
                    chat_type: TYPE_CHAT_WITH_DEVELOPERS,
                  })
                }
              >
                <i className="fa fa-cogs" />{' '}
                {this.renderTitle({
                  is_unread: undefined,
                  chat_type: TYPE_CHAT_WITH_DEVELOPERS,
                })}
              </Nav.Link>
            </Nav>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="fa fa-filter" /> {_('Filters')}
            </Card.Title>
            <Nav className="flex-column">
              <Nav.Link
                onClick={() =>
                  onChangequeryParams({
                    is_unread: 'true',
                    chat_type: undefined,
                  })
                }
              >
                <i className="fa fa-eye-slash" />{' '}
                {this.renderTitle({ is_unread: 'true', chat_type: undefined })}{' '}
                {this.props.counters.m_unread_chats > 0 ? (
                  <Badge variant="primary">
                    {this.props.counters.m_unread_chats}
                  </Badge>
                ) : null}
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
        listClientPath={CLIENT_URLS.MODERATOR.CHAT_LIST.buildPath()}
        listServerPath={
          SERVER_URLS.MODERATION_CHAT_WITH_MODERATORS_AND_DEVELOPERS_LIST
        }
        renderTitle={this.renderTitle}
        renderItem={this.renderItem}
        renderFilters={this.renderFilters}
      />
    );
  }
}

const withAuth = withAuthUser({
  propName: 'authUser',
});

const withCountersData = withCounters({
  propName: 'counters',
});

const withReadAll = withRestMutate({
  propName: 'readAll',
  verb: 'POST',
  path: () => SERVER_URLS.CHAT_READ_ALL.buildPath(),
});

export default compose(withAuth, withCountersData, withReadAll)(ChatList);
