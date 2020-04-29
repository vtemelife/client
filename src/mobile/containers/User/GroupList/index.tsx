import React, { useState, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  InputGroup,
  Form,
  Modal,
  Button,
  OverlayTrigger,
  Popover,
  ListGroup,
  Badge,
  Alert,
} from 'react-bootstrap';
import { useGet, useMutate } from 'restful-react';
import ShowMore from 'react-show-more';

import Image from 'generic/components/Image';
import Loading from 'generic/components/Loading';
import defaultSVG from 'generic/layout/images/picture.svg';

import { ROLE_MODERATOR } from 'generic/constants';
import { _ } from 'trans';
import { SERVER_URLS } from 'routes/server';
import { CLIENT_URLS } from 'mobile/routes/client';
import PaginateList from 'generic/components/PaginateList';
import { renderHtml, handleSuccess, handleErrors } from 'utils';
import { AuthUserContext } from 'generic/containers/ContextProviders/HeaderUserService';
import FormSelect from 'generic/components/Form/FormSelect';
import { COMMUNITY_THEMES, COMMUNITY_TYPES } from 'generic/constants';
import Header from 'mobile/containers/Header';
import DeleteItem from 'mobile/components/DeleteItem';
import { withGuestAlert } from 'mobile/components/GuestAlert';

const MENU_PAGE_MY = 'my';
const MENU_PAGE_SEARCH = 'search';

const GroupList: React.SFC<any> = () => {
  const [showMenu, toggleShowMenu] = useState(false);
  const [showFilters, toggleShowFilters] = useState(false);

  const [search, changeSearch] = useState('');
  const [offset, changeOffset] = useState(0);

  const [menuPage, changeMenuPage] = useState(MENU_PAGE_MY);

  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {
    city: {
      country: {},
      region: {},
    },
  };

  const defaultFilters = {
    relationship_theme: null,
    group_type: null,
  } as any;
  const [filters, changeFilters] = useState(defaultFilters);
  const [applyFilters, changeApplyFilters] = useState(null);

  const serverFilters = applyFilters || defaultFilters;

  const queryParams = {
    search,
    relationship_theme:
      serverFilters.relationship_theme !== null
        ? serverFilters.relationship_theme.value
        : undefined,
    group_type:
      serverFilters.group_type !== null
        ? serverFilters.group_type.value
        : undefined,
    is_participant: menuPage === MENU_PAGE_MY ? true : undefined,
  };
  const { data: groupsData, loading, refetch } = useGet({
    path: SERVER_URLS.GROUP_LIST.buildPath({
      queryParams: { ...queryParams, offset },
    }),
  });
  const groupsItems = (groupsData || {}).results || [];
  const groupsCount = (groupsData || {}).count || 0;

  const { mutate: join, loading: joinLoading } = useMutate({
    verb: 'POST',
    path: SERVER_URLS.MEMBERSHIP_REQUESTS_CREATE.buildPath(),
  });

  let title = _('My groups');
  switch (menuPage) {
    case MENU_PAGE_SEARCH:
      title = _('Search a group');
      break;
    case MENU_PAGE_MY:
    default:
      break;
  }

  const isModerator = (item: any) => {
    return (
      item.moderators.indexOf(user.pk) !== -1 || user.role === ROLE_MODERATOR
    );
  };
  const isParticipant = (item: any) => {
    return item.users.indexOf(user.pk) !== -1;
  };
  const hasRequest = (item: any) => {
    return Boolean(item.request);
  };

  return (
    <div className="container-groups">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <Header
        name={`${title} ${groupsCount > 0 ? `(${groupsCount})` : ''}`}
        fixed={true}
      >
        <div onClick={() => toggleShowMenu(true)}>
          <i className="fa fa-bars" />
        </div>
        <div onClick={() => toggleShowFilters(true)}>
          <i
            className={`fa fa-filter ${
              applyFilters ? 'text-notification' : ''
            }`}
          />
        </div>
        <div>
          <Link to={CLIENT_URLS.USER.GROUP_CREATE.buildPath()}>
            <i className="fa fa-plus" />
          </Link>
        </div>
      </Header>
      <div className="groups-search">
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id="search">
              <i className="fa fa-search" />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            type="text-break"
            placeholder={_('Start input here')}
            aria-describedby="search"
            value={search}
            onChange={(event: any): any => {
              return changeSearch(event.target.value);
            }}
          />
        </InputGroup>
      </div>
      <div className="groups-list">
        {joinLoading && <Loading />}
        {!loading && groupsItems.length === 0 && (
          <Alert variant="warning">
            <div>{_('No groups.')}</div>
            <hr />
            <div className="d-flex">
              <Button
                size="sm"
                variant="warning"
                onClick={() => {
                  changeMenuPage(MENU_PAGE_SEARCH);
                }}
              >
                <i className="fa fa-search" /> {_('Search a group')}
              </Button>
            </div>
          </Alert>
        )}
        <PaginateList
          offset={offset}
          changeOffset={changeOffset}
          count={groupsCount}
          objs={groupsItems}
          loading={loading}
          queryParamsHash={JSON.stringify(queryParams)}
        >
          {(item: any) => (
            <div className="groups-item block" key={item.pk}>
              <div className="groups-header">
                <div className="groups-avatar">
                  <Link
                    to={CLIENT_URLS.USER.GROUP_DETAIL.buildPath({
                      groupSlug: item.slug,
                    })}
                  >
                    <Image
                      width={50}
                      height={50}
                      src={
                        item.image && item.image.thumbnail_100x100
                          ? item.image.thumbnail_100x100
                          : defaultSVG
                      }
                    />
                  </Link>
                </div>
                <div className="groups-title">
                  <div className="groups-title-name">
                    <Link
                      to={CLIENT_URLS.USER.GROUP_DETAIL.buildPath({
                        groupSlug: item.slug,
                      })}
                    >
                      {isModerator(item) && item.requests_count > 0 && (
                        <Badge variant="primary">{item.requests_count}</Badge>
                      )}{' '}
                      {item.name}
                    </Link>
                  </div>
                  <div className="groups-title-geo" />
                </div>
                <div className="groups-actions">
                  {isModerator(item) && (
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
                                  to={CLIENT_URLS.USER.GROUP_UPDATE.buildPath({
                                    groupSlug: item.slug,
                                  })}
                                >
                                  <i className="fa fa-pencil" /> {_('Update')}
                                </Link>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <DeleteItem
                                  description={_(
                                    'Are you sure you want to delete the group?',
                                  )}
                                  onSuccess={() => refetch()}
                                  path={SERVER_URLS.GROUP_DELETE.buildPath({
                                    groupSlug: item.slug,
                                  })}
                                >
                                  <i className="fa fa-trash" /> {_('Delete')}
                                </DeleteItem>
                              </ListGroup.Item>
                            </ListGroup>
                          </Popover.Content>
                        </Popover>
                      }
                    >
                      <i className="fa fa-bars fa-lg" />
                    </OverlayTrigger>
                  )}
                </div>
              </div>
              <div className="groups-body">
                <div className="groups-text">
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <span className="item-title">{_('Type')}:</span>
                      {item.group_type.display}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <span className="item-title">{_('Theme')}:</span>
                      {item.relationship_theme.display}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <span className="item-title">{_('Participants')}:</span>
                      {item.users.length}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <span className="item-title">{_('About')}:</span>
                      <ShowMore
                        lines={3}
                        more={_('Show more')}
                        less={_('Show less')}
                        anchorClass=""
                      >
                        {renderHtml(item.description)}
                      </ShowMore>
                    </ListGroup.Item>
                    {!isParticipant(item) && (
                      <ListGroup.Item className="actions">
                        {hasRequest(item) ? (
                          <DeleteItem
                            description={_(
                              'Are you sure you want to delete the request to join the group?',
                            )}
                            onSuccess={() => refetch()}
                            path={SERVER_URLS.MEMBERSHIP_REQUESTS_DELETE.buildPath(
                              {
                                membershipPk: item.request,
                              },
                            )}
                          >
                            <Button
                              size="sm"
                              className="float-right"
                              variant="danger"
                            >
                              <i className="fa fa-trash" />{' '}
                              {_('Drop your request')}
                            </Button>
                          </DeleteItem>
                        ) : (
                          <Button
                            size="sm"
                            className="float-right"
                            onClick={() => {
                              join({
                                content_type: 'groups:group',
                                object_id: item.pk,
                              })
                                .then((result: any) => {
                                  handleSuccess(
                                    _(
                                      'Your request has been sent successfully.',
                                    ),
                                  );
                                  refetch();
                                })
                                .catch((errors: any) => {
                                  handleErrors(errors);
                                });
                            }}
                          >
                            <i className="fa fa-handshake-o" />{' '}
                            {_('Join to this group')}
                          </Button>
                        )}
                      </ListGroup.Item>
                    )}
                  </ListGroup>
                </div>
              </div>
            </div>
          )}
        </PaginateList>
      </div>
      <Modal
        size="lg"
        show={showFilters}
        onHide={() => toggleShowFilters(false)}
      >
        <Modal.Header closeButton={true}>
          <Modal.Title>
            <i className="fa fa-filter" /> {_('Filters')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormSelect
            label={_('Theme')}
            name="relationship_theme"
            isClearable={true}
            options={COMMUNITY_THEMES}
            value={filters.relationship_theme}
            onChange={(target: any) =>
              changeFilters({
                ...filters,
                relationship_theme: target.value,
              })
            }
          />
          <FormSelect
            label={_('Type')}
            name="group_type"
            isClearable={true}
            options={COMMUNITY_TYPES}
            value={filters.group_type}
            onChange={(target: any) =>
              changeFilters({
                ...filters,
                group_type: target.value,
              })
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              changeOffset(0);
              changeFilters(defaultFilters);
              changeApplyFilters(null);
              toggleShowFilters(false);
            }}
            variant="danger"
          >
            {_('Reset')}
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              changeOffset(0);
              changeApplyFilters(filters as any);
              toggleShowFilters(false);
            }}
          >
            {_('Apply')}
          </Button>
        </Modal.Footer>
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
                changeMenuPage(MENU_PAGE_MY);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-copy" /> {_('My groups')}
            </ListGroup.Item>
            <ListGroup.Item
              onClick={() => {
                changeOffset(0);
                changeMenuPage(MENU_PAGE_SEARCH);
                toggleShowMenu(false);
              }}
            >
              <i className="fa fa-search" /> {_('Search a group')}
            </ListGroup.Item>
            <ListGroup.Item>
              <Link to={CLIENT_URLS.USER.GROUP_REQUESTS.buildPath()}>
                <i className="fa fa-list-ol" />{' '}
                {_('My requests to join groups')}
              </Link>
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default withGuestAlert(GroupList);
