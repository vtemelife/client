import React from 'react';
import compose from 'lodash/flowRight';
import { Media, Button, Col, Row, ButtonGroup } from 'react-bootstrap';
import { Mutate } from 'restful-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import { SERVER_URLS } from 'routes/server';
import { CLIENT_URLS } from 'desktop/routes/client';
import { _ } from 'trans';
import userSVG from 'generic/layout/images/user.svg';
import {
  getBirthday,
  getBirthdaySecond,
  getGeo,
} from '../../User/Profile/utils';
import {
  SERVICE_NOTIFICATION,
  MSG_TYPE_UPDATE_COUNTERS,
} from 'generic/containers/ContextProviders/WebSocketService/constants';

import Image from 'generic/components/Image';
import { renderHtml } from 'utils';
import handleErrors from 'desktop/components/ResponseErrors/utils';
import { withAuthUser, withWebSocket } from 'generic/containers/Decorators';
import ShowMore from 'react-show-more';
import { LinkContainer } from 'react-router-bootstrap';

interface IProps {
  item: any;
  refetch: any;
  socket: any;
  authUser: any;
}

class SearchItem extends React.PureComponent<IProps> {
  public render() {
    const user = this.props.authUser.user;
    const item = this.props.item;
    return (
      <Col lg={12} className="search-item-container">
        <Media>
          <Link
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
                src={userSVG}
                roundedCircle={true}
              />
            )}
          </Link>
          <Media.Body>
            <Row className="search-item-data">
              <Col lg={9}>
                <Link
                  to={CLIENT_URLS.USER.PROFILE.buildPath({
                    userSlug: item.slug,
                  })}
                >
                  <div className="text-break search-item-title">
                    {item.online ? <i className="fa fa-circle" /> : null}{' '}
                    {item.name}
                  </div>
                </Link>
                <div className="text-break search-item-info">
                  <p>
                    <span className="title">{_('Geo')}:</span> {getGeo(item)}
                  </p>
                  <p>
                    <span className="title">{_('Real status')}:</span>{' '}
                    {item.is_real ? (
                      <i className="fa fa-check green-color" />
                    ) : (
                      <i className="fa fa-times-circle red-color" />
                    )}
                  </p>
                  <p>
                    <span className="title">{_('Gender')}:</span>{' '}
                    {item.gender.display}
                  </p>
                  <p>
                    <span className="title">{_('Age')}:</span>
                    <br />
                    {getBirthday(item)}
                    <br />
                    {getBirthdaySecond(item)}
                  </p>
                  <p>
                    <span className="title">{_('Formats')}:</span>{' '}
                    {item.relationship_formats
                      .map((i: any) => i.display)
                      .join(', ')}
                  </p>
                  <p>
                    <span className="title">{_('Themes')}:</span>{' '}
                    {item.relationship_themes
                      .map((i: any) => i.display)
                      .join(', ')}
                  </p>
                </div>
                {item.about && (
                  <div className="text-break search-item-description">
                    <ShowMore
                      lines={10}
                      more={_('Show more')}
                      less={_('Show less')}
                      anchorClass=""
                    >
                      {renderHtml(item.about)}
                    </ShowMore>
                  </div>
                )}
              </Col>
              <Col lg={3} className="user-item-actions">
                <ButtonGroup vertical={true} className="float-right">
                  <Mutate
                    verb="POST"
                    path={SERVER_URLS.MEMBERSHIP_REQUESTS_CREATE.buildPath()}
                  >
                    {(requestFriend, response) => (
                      <Button
                        size="sm"
                        onClick={() => {
                          requestFriend({
                            content_type: 'users:user',
                            object_id: item.pk,
                          })
                            .then((result: any) => {
                              toast.success(
                                _(
                                  'The friend request has been successfully sent',
                                ),
                                { autoClose: 15000 },
                              );
                              this.props.refetch();
                              this.props.socket.sendMessage({
                                service: SERVICE_NOTIFICATION,
                                sender: user.pk,
                                recipients: [item.pk],
                                message_type: MSG_TYPE_UPDATE_COUNTERS,
                                data: {},
                              });
                            })
                            .catch((errors: any) => {
                              handleErrors(errors);
                            });
                        }}
                      >
                        <i className="fa fa-plus" /> {_('to friends')}
                      </Button>
                    )}
                  </Mutate>
                  <LinkContainer
                    to={
                      item.chat
                        ? CLIENT_URLS.USER.CHAT_DETAIL.buildPath({
                            chatPk: item.chat,
                          })
                        : CLIENT_URLS.USER.CHAT_CONVERSATION_CREATE.buildPath({
                            recipientSlug: item.slug,
                          })
                    }
                  >
                    <Button size="sm" className="float-right">
                      <i className="fa fa-comment" /> {_('send a message')}
                    </Button>
                  </LinkContainer>
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

const withAuth = withAuthUser({
  propName: 'authUser',
});

const withWebSocketData = withWebSocket({
  propName: 'socket',
});

export default compose(withAuth, withWebSocketData)(SearchItem);
