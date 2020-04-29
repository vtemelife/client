import React, { useState, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Modal, ListGroup, Alert, Badge } from 'react-bootstrap';
import { useGet } from 'restful-react';
import ShowMore from 'react-show-more';

import Image from 'generic/components/Image';
import defaultSVG from 'generic/layout/images/picture.svg';

import { _ } from 'trans';
import { SERVER_URLS } from 'routes/server';
import { CLIENT_URLS } from 'mobile/routes/client';
import PaginateList from 'generic/components/PaginateList';
import { renderHtml } from 'utils';
import { AuthUserContext } from 'generic/containers/ContextProviders/HeaderUserService';
import { CountersContext } from 'generic/containers/ContextProviders/CountersService';
import Header from 'mobile/containers/Header';
import {
  getBirthday,
  getBirthdaySecond,
  getGeo,
} from 'desktop/containers/User/Profile/utils';
import RequestActions from 'mobile/components/RequestActions';

const FILTER_PAGE_WAITING = 'waiting';
const FILTER_PAGE_APPROVED = 'approved';
const FILTER_PAGE_DECLINED = 'declined';

const MENU_PAGE_FROM_USERS = 'from-users';
const MENU_PAGE_TO_USERS = 'to-users';

const FriendMyRequests: React.SFC<any> = () => {
  const [showMenu, toggleShowMenu] = useState(false);
  const [showFilter, toggleShowFilter] = useState(false);

  const [offset, changeOffset] = useState(0);

  const [filterPage, changeFilterPage] = useState(FILTER_PAGE_WAITING);
  const [menuPage, changeMenuPage] = useState(MENU_PAGE_FROM_USERS);

  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {
    pk: null,
  };
  const countersData = useContext(CountersContext) || {
    counters: {},
  };
  const counters = countersData.counters || { u_friends_requests: 0 };

  const queryParams = {
    content_type: 'users:user',
    status: filterPage,
    user: menuPage !== MENU_PAGE_FROM_USERS ? user.pk : undefined,
    object_id: menuPage === MENU_PAGE_FROM_USERS ? user.pk : undefined,
  };
  const { data: requestsData, loading, refetch } = useGet({
    path: SERVER_URLS.MEMBERSHIP_REQUESTS_LIST.buildPath({
      queryParams: { ...queryParams, offset },
    }),
  });

  const requestsItems = (requestsData || {}).results || [];
  const requestsCount = (requestsData || {}).count || 0;

  let faStatusIcon = 'fa-clock-o';
  switch (filterPage) {
    case FILTER_PAGE_APPROVED:
      faStatusIcon = 'fa-check';
      break;
    case FILTER_PAGE_DECLINED:
      faStatusIcon = 'fa-ban';
      break;
    case FILTER_PAGE_WAITING:
    default:
      break;
  }

  let title = _('Users requests to me');
  switch (menuPage) {
    case MENU_PAGE_TO_USERS:
      title = _('My requests to users');
      break;
    case MENU_PAGE_FROM_USERS:
    default:
      break;
  }
  return (
    <div className="container-requests">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <Header
        name={`${title} ${requestsCount > 0 ? `(${requestsCount})` : ''}`}
        fixed={true}
      >
        <div onClick={() => toggleShowMenu(true)}>
          <i className="fa fa-bars" />{' '}
          {counters.u_friends_requests > 0 ? counters.u_friends_requests : null}
        </div>
        <div onClick={() => toggleShowFilter(true)}>
          <i className="fa fa-filter" />
        </div>
      </Header>
      <div className="requests-list">
        {!loading && requestsItems.length === 0 && (
          <Alert variant="warning">
            <div>{_('No requests.')}</div>
          </Alert>
        )}
        <PaginateList
          offset={offset}
          changeOffset={changeOffset}
          count={requestsCount}
          objs={requestsItems}
          loading={loading}
          queryParamsHash={JSON.stringify(queryParams)}
        >
          {(item: any) => {
            const itemUser =
              menuPage === MENU_PAGE_FROM_USERS
                ? item.user
                : item.content_object;
            return (
              <div className="requests-item block" key={itemUser.slug}>
                <div className="requests-header">
                  <div className="requests-avatar">
                    <Link
                      to={CLIENT_URLS.USER.PROFILE.buildPath({
                        userSlug: itemUser.slug,
                      })}
                    >
                      <Image
                        width={50}
                        height={50}
                        src={
                          itemUser.avatar && itemUser.avatar.thumbnail_100x100
                            ? itemUser.avatar.thumbnail_100x100
                            : defaultSVG
                        }
                      />
                    </Link>
                  </div>
                  <div className="requests-title">
                    <div className="requests-title-name">
                      <i className={`fa ${faStatusIcon}`} />{' '}
                      <Link
                        to={CLIENT_URLS.USER.PROFILE.buildPath({
                          userSlug: itemUser.slug,
                        })}
                      >
                        {itemUser.name}
                      </Link>
                    </div>
                    <div className="requests-title-geo">{getGeo(itemUser)}</div>
                  </div>
                  <div className="requests-actions">
                    <RequestActions
                      mine={menuPage === MENU_PAGE_TO_USERS}
                      membershipPk={item.pk}
                      refetch={refetch}
                    />
                  </div>
                </div>
                <div className="requests-body">
                  <div className="requests-text">
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <span className="item-title">{_('Real status')}:</span>{' '}
                        {itemUser.is_real ? (
                          <>
                            <i className="fa fa-check green-color" /> {_('Yes')}
                          </>
                        ) : (
                          <>
                            <i className="fa fa-times-circle red-color" />{' '}
                            {_('No')}
                          </>
                        )}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <span className="item-title">{_('Gender')}:</span>
                        {itemUser.gender.display}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <span className="item-title">{_('Age')}:</span>
                        {getBirthday(itemUser)}
                        {', '}
                        {getBirthdaySecond(itemUser)}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <span className="item-title">{_('Formats')}:</span>
                        {itemUser.relationship_formats
                          .map((i: any) => i.display)
                          .join(', ')}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <span className="item-title">{_('Themes')}:</span>
                        {itemUser.relationship_themes
                          .map((i: any) => i.display)
                          .join(', ')}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <span className="item-title">{_('About')}:</span>
                        <ShowMore
                          lines={3}
                          more={_('Show more')}
                          less={_('Show less')}
                          anchorClass=""
                        >
                          {renderHtml(itemUser.about)}
                        </ShowMore>
                      </ListGroup.Item>
                    </ListGroup>
                  </div>
                </div>
              </div>
            );
          }}
        </PaginateList>
      </div>
      <Modal size="lg" show={showFilter} onHide={() => toggleShowFilter(false)}>
        <Modal.Header closeButton={true}>
          <Modal.Title>
            <i className="fa fa-filter" /> {_('Filters')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup variant="flush">
            <ListGroup.Item
              onClick={() => {
                changeOffset(0);
                changeFilterPage(FILTER_PAGE_WAITING);
                toggleShowFilter(false);
              }}
            >
              <i className="fa fa-clock-o" /> {_('Pending')}
            </ListGroup.Item>
            <ListGroup.Item
              onClick={() => {
                changeOffset(0);
                changeFilterPage(FILTER_PAGE_APPROVED);
                toggleShowFilter(false);
              }}
            >
              <i className="fa fa-check" /> {_('Approved')}
            </ListGroup.Item>
            <ListGroup.Item
              onClick={() => {
                changeOffset(0);
                changeFilterPage(FILTER_PAGE_DECLINED);
                toggleShowFilter(false);
              }}
            >
              <i className="fa fa-ban" /> {_('Declined')}
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
      <Modal size="lg" show={showMenu} onHide={() => toggleShowMenu(false)}>
        <Modal.Header closeButton={true}>
          <Modal.Title>
            <i className="fa fa-bars" /> {_('Menu')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup variant="flush">
            <ListGroup.Item
              onClick={() => {
                changeOffset(0);
                changeMenuPage(MENU_PAGE_TO_USERS);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-user" /> {_('My requests to users')}
            </ListGroup.Item>
            <ListGroup.Item
              onClick={() => {
                changeOffset(0);
                changeMenuPage(MENU_PAGE_FROM_USERS);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-users" /> {_('Users requests to me')}{' '}
              {counters.u_friends_requests > 0 && (
                <Badge variant="primary">{counters.u_friends_requests}</Badge>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FriendMyRequests;
