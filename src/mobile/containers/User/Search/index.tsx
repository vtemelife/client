import React, { useState, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  InputGroup,
  Form,
  Modal,
  Button,
  ListGroup,
  Alert,
} from 'react-bootstrap';
import { useGet, useMutate } from 'restful-react';
import ShowMore from 'react-show-more';

import Image from 'generic/components/Image';
import Loading from 'generic/components/Loading';
import userSVG from 'generic/layout/images/user.svg';

import { _ } from 'trans';
import { SERVER_URLS } from 'routes/server';
import { CLIENT_URLS } from 'mobile/routes/client';
import PaginateList from 'generic/components/PaginateList';
import {
  getGeo,
  getBirthday,
  getBirthdaySecond,
  getUserFormats,
} from 'desktop/containers/User/Profile/utils';
import { renderHtml, handleSuccess, handleErrors } from 'utils';
import { AuthUserContext } from 'generic/containers/ContextProviders/HeaderUserService';
import FormAsyncSelect from 'generic/components/Form/FormAsyncSelect';
import FormCheckBoxes from 'generic/components/Form/FormCheckBoxes';
import { USER_THEMES, USER_GENDER } from 'generic/constants';
import DeleteItem from 'mobile/components/DeleteItem';
import { LinkContainer } from 'react-router-bootstrap';

const Search: React.SFC<any> = () => {
  const [showFilters, toggleShowFilters] = useState(false);
  const [search, changeSearch] = useState('');
  const [offset, changeOffset] = useState(0);

  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {
    city: {
      country: {},
      region: {},
    },
  };

  const defaultFilters = {
    country:
      user.city && user.city.country
        ? {
            pk: user.city.country.pk,
            name: user.city.country.name,
          }
        : null,
    region:
      user.city && user.city.region
        ? {
            pk: user.city.region.pk,
            name: user.city.region.name,
          }
        : null,
    city: null,
    isOnline: null,
    isReal: null,
    themes: [],
    formats: [],
    gender: [],
  } as any;
  const [filters, changeFilters] = useState(defaultFilters);
  const [applyFilters, changeApplyFilters] = useState(null);

  const serverFilters = applyFilters || defaultFilters;

  const queryParams = {
    search,
    city__country:
      serverFilters.country !== null ? serverFilters.country.pk : undefined,
    city__region:
      serverFilters.region !== null ? serverFilters.region.pk : undefined,
    city: serverFilters.city !== null ? serverFilters.city.pk : undefined,
    is_online:
      serverFilters.isOnline !== null ? serverFilters.isOnline : undefined,
    is_real: serverFilters.isReal !== null ? serverFilters.isReal : undefined,
    gender:
      serverFilters.gender.length > 0
        ? serverFilters.gender.join(',')
        : undefined,
    relationship_themes:
      serverFilters.themes.length > 0
        ? serverFilters.themes.join(',')
        : undefined,
    relationship_formats:
      serverFilters.formats.length > 0
        ? serverFilters.formats.join(',')
        : undefined,
  };
  const { data: searchData, loading, refetch } = useGet({
    path: SERVER_URLS.FRIENDS_SEARCH.buildPath({
      queryParams: { ...queryParams, offset },
    }),
  });
  const searchItems = (searchData || {}).results || [];
  const searchCount = (searchData || {}).count || 0;

  const { mutate: addToFriends, loading: addToFriendsLoading } = useMutate({
    verb: 'POST',
    path: SERVER_URLS.MEMBERSHIP_REQUESTS_CREATE.buildPath(),
  });

  const hasRequest = (item: any) => {
    return Boolean(item.request);
  };
  return (
    <div className="container-search">
      <Helmet>
        <title>{_('Search')}</title>
        <meta name="description" content={_('Search')} />
      </Helmet>
      <div className="search">
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
            onChange={(event: any) => changeSearch(event.target.value)}
          />
          <InputGroup.Append>
            <InputGroup.Text
              id="filter"
              className={applyFilters ? 'text-notification' : ''}
              onClick={() => toggleShowFilters(true)}
            >
              {_('Filters')} <i className="fa fa-filter" />
            </InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
      </div>
      <div className="search-list">
        {addToFriendsLoading && <Loading />}
        {!loading && searchItems.length === 0 && (
          <Alert variant="warning">
            <div>{_('No results.')}</div>
          </Alert>
        )}
        <PaginateList
          offset={offset}
          changeOffset={changeOffset}
          count={searchCount}
          objs={searchItems}
          loading={loading}
          queryParamsHash={JSON.stringify(queryParams)}
        >
          {(item: any) => (
            <div className="search-item block" key={item.slug}>
              <div className="search-header">
                <div className="search-avatar">
                  <Link
                    to={CLIENT_URLS.USER.PROFILE.buildPath({
                      userSlug: item.slug,
                    })}
                  >
                    <Image
                      width={50}
                      height={50}
                      src={
                        item.avatar && item.avatar.thumbnail_100x100
                          ? item.avatar.thumbnail_100x100
                          : userSVG
                      }
                      roundedCircle={true}
                    />
                  </Link>
                </div>
                <div className="search-title">
                  <div className="search-title-name">
                    <Link
                      to={CLIENT_URLS.USER.PROFILE.buildPath({
                        userSlug: item.slug,
                      })}
                    >
                      <>
                        {item.online ? <i className="fa fa-circle" /> : null}{' '}
                        {item.name}
                      </>
                    </Link>
                  </div>
                  <div className="search-title-geo">{getGeo(item)}</div>
                </div>
                <div className="search-actions" />
              </div>
              <div className="search-body">
                <div className="search-text">
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <span className="item-title">{_('Real status')}:</span>{' '}
                      {item.is_real ? (
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
                      {item.gender.display}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <span className="item-title">{_('Age')}:</span>
                      {getBirthday(item)}
                      {', '}
                      {getBirthdaySecond(item)}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <span className="item-title">{_('Formats')}:</span>
                      {item.relationship_formats
                        .map((i: any) => i.display)
                        .join(', ')}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <span className="item-title">{_('Themes')}:</span>
                      {item.relationship_themes
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
                        {renderHtml(item.about)}
                      </ShowMore>
                    </ListGroup.Item>
                    <ListGroup.Item className="actions">
                      {hasRequest(item) && (
                        <DeleteItem
                          description={_(
                            'Are you sure you want to delete the request?',
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
                      )}
                      {!hasRequest(item) && (
                        <Button
                          size="sm"
                          className="float-right"
                          onClick={() => {
                            addToFriends({
                              content_type: 'users:user',
                              object_id: item.pk,
                            })
                              .then((result: any) => {
                                handleSuccess(
                                  _('Your request has been sent successfully.'),
                                );
                                refetch();
                              })
                              .catch((errors: any) => {
                                handleErrors(errors);
                              });
                          }}
                        >
                          <i className="fa fa-handshake-o" />{' '}
                          {_('Add to friends')}
                        </Button>
                      )}
                      <LinkContainer
                        to={
                          item.chat
                            ? CLIENT_URLS.USER.CHAT_DETAIL.buildPath({
                                chatPk: item.chat,
                              })
                            : CLIENT_URLS.USER.CHAT_CONVERSATION_CREATE.buildPath(
                                {
                                  recipientSlug: item.slug,
                                },
                              )
                        }
                      >
                        <Button size="sm" className="float-right">
                          <i className="fa fa-comment" /> {_('Send a message')}
                        </Button>
                      </LinkContainer>
                    </ListGroup.Item>
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
          <FormAsyncSelect
            label={_('Country')}
            placeholder={_('Start typing...')}
            name="city__country"
            value={filters.country}
            onChange={(target: any) => {
              changeFilters({
                ...filters,
                country: target.value,
              });
            }}
            fetchURL={SERVER_URLS.SELECTS.COUNTRY.buildPath()}
          />
          <FormAsyncSelect
            label={_('Region/State')}
            placeholder={_('Start typing...')}
            name="city__region"
            value={filters.region}
            onChange={(target: any) => {
              changeFilters({
                ...filters,
                region: target.value,
              });
            }}
            fetchURL={SERVER_URLS.SELECTS.REGION.buildPath()}
            filterURL={`country=${
              filters.country && filters.country.pk
                ? filters.country.pk
                : user.city.country.pk
            }`}
          />
          <FormAsyncSelect
            label={_('City')}
            placeholder={_('Start typing...')}
            name="city"
            value={filters.city}
            onChange={(target: any) => {
              changeFilters({
                ...filters,
                city: target.value,
              });
            }}
            fetchURL={SERVER_URLS.SELECTS.CITY.buildPath()}
            filterURL={`region=${
              filters.region && filters.region.pk
                ? filters.region.pk
                : user.city.region.pk
            }`}
          />
          <FormCheckBoxes
            type="checkbox"
            name="is_online"
            label={_('Online')}
            checkboxes={[{ value: true, display: _('Online') }]}
            value={filters.isOnline !== null ? [filters.isOnline] : []}
            onChange={(target: any) => {
              changeFilters({
                ...filters,
                isOnline: target.target.checked,
              });
            }}
          />
          <FormCheckBoxes
            type="checkbox"
            name="is_real"
            label={_('Real status')}
            checkboxes={[{ value: true, display: _('Real status') }]}
            value={filters.isReal !== null ? [filters.isReal] : []}
            onChange={(target: any) => {
              changeFilters({
                ...filters,
                isReal: target.target.checked,
              });
            }}
          />
          <FormCheckBoxes
            type="checkbox"
            name="gender"
            label={_('Gender')}
            checkboxes={USER_GENDER}
            value={filters.gender}
            onChange={(target: any) => {
              const el = target.target;
              const newValues = el.checked
                ? [...filters.gender, el.id]
                : filters.gender.filter((i: string) => i !== el.id);
              changeFilters({
                ...filters,
                gender: newValues as any,
              });
            }}
          />
          <FormCheckBoxes
            type="checkbox"
            name="relationship_themes"
            label={_('Themes')}
            checkboxes={USER_THEMES}
            value={filters.themes}
            onChange={(target: any) => {
              const el = target.target;
              const newValues = el.checked
                ? [...filters.themes, el.id]
                : filters.themes.filter((i: string) => i !== el.id);
              changeFilters({
                ...filters,
                themes: newValues as any,
              });
            }}
          />
          <FormCheckBoxes
            type="checkbox"
            name="relationship_formats"
            label={_('Formats')}
            checkboxes={getUserFormats(filters.gender, filters.themes)}
            value={filters.formats}
            onChange={(target: any) => {
              const el = target.target;
              const newValues = el.checked
                ? [...filters.formats, el.id]
                : filters.formats.filter((i: string) => i !== el.id);
              changeFilters({
                ...filters,
                formats: newValues as any,
              });
            }}
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
    </div>
  );
};

export default Search;
