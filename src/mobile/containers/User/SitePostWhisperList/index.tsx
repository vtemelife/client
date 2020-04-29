import React, { useState, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  InputGroup,
  Form,
  Modal,
  OverlayTrigger,
  Popover,
  ListGroup,
  Alert,
  Button,
} from 'react-bootstrap';
import { useGet } from 'restful-react';
import ShowMore from 'react-show-more';
import { useLocation } from 'react-router';
import queryString from 'query-string';

import Image from 'generic/components/Image';
import defaultSVG from 'generic/layout/images/picture.svg';
import FormSelect from 'generic/components/Form/FormSelect';

import {
  ROLE_MODERATOR,
  POST_THEME_SWING,
  POST_THEMES,
  POST_THEME_SWING_HISTORY,
  POST_THEME_BDSM,
  POST_THEME_BDSM_HISTORY,
  POST_THEME_LGBT,
  POST_THEME_LGBT_HISTORY,
  POST_THEME_SEX,
  POST_THEME_SEX_HISTORY,
} from 'generic/constants';
import { _ } from 'trans';
import { SERVER_URLS } from 'routes/server';
import { CLIENT_URLS } from 'mobile/routes/client';
import PaginateList from 'generic/components/PaginateList';
import { renderHtml, getDisplayValue } from 'utils';
import { AuthUserContext } from 'generic/containers/ContextProviders/HeaderUserService';
import Header from 'mobile/containers/Header';
import DeleteItem from 'mobile/components/DeleteItem';

import Likes from 'desktop/components/Likes';
import { REQUEST_APPROVED } from 'generic/constants';

const SitePostWhisperList: React.SFC<any> = () => {
  const location = useLocation();
  const { objectId, contentType } = queryString.parse(location.search);
  const isSitePostsMode = !(objectId && contentType);

  const [search, changeSearch] = useState('');
  const [offset, changeOffset] = useState(0);

  const [showFilters, toggleShowFilters] = useState(false);
  const [filters, changeFilters] = useState({} as any);
  const [applyFilters, changeApplyFilters] = useState(null as any);

  const userAuth = useContext(AuthUserContext);
  const user = userAuth.headerUser || {
    city: {
      country: {},
      region: {},
    },
  };

  const queryParams = {
    search,
    is_whisper: true,
    theme:
      isSitePostsMode && applyFilters && applyFilters.theme
        ? applyFilters.theme.value
        : undefined,
    status: isSitePostsMode ? REQUEST_APPROVED : undefined,
    object_id: !isSitePostsMode ? objectId : undefined,
    content_type: !isSitePostsMode ? contentType : undefined,
  };
  const { data: postsData, loading, refetch } = useGet({
    path: SERVER_URLS.POSTS.buildPath({
      queryParams: { ...queryParams, offset },
    }),
  });
  const postsItems = (postsData || {}).results || [];
  const postsCount = (postsData || {}).count || 0;

  const valueTitle = (theme?: string) => {
    switch (theme) {
      case POST_THEME_SWING:
        return getDisplayValue(POST_THEME_SWING, POST_THEMES);
      case POST_THEME_SWING_HISTORY:
        return getDisplayValue(POST_THEME_SWING_HISTORY, POST_THEMES);
      case POST_THEME_BDSM:
        return getDisplayValue(POST_THEME_BDSM, POST_THEMES);
      case POST_THEME_BDSM_HISTORY:
        return getDisplayValue(POST_THEME_BDSM_HISTORY, POST_THEMES);
      case POST_THEME_LGBT:
        return getDisplayValue(POST_THEME_LGBT, POST_THEMES);
      case POST_THEME_LGBT_HISTORY:
        return getDisplayValue(POST_THEME_LGBT_HISTORY, POST_THEMES);
      case POST_THEME_SEX:
        return getDisplayValue(POST_THEME_SEX, POST_THEMES);
      case POST_THEME_SEX_HISTORY:
        return getDisplayValue(POST_THEME_SEX_HISTORY, POST_THEMES);
      default:
        return _('Articles');
    }
  };

  const isCreator = (item: any) => {
    return item.creator === user.pk || user.role === ROLE_MODERATOR;
  };

  const title = valueTitle(
    applyFilters && applyFilters.theme ? applyFilters.theme.value : undefined,
  );

  return (
    <div className="container-site-post-list">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <Header
        name={`${title} ${postsCount > 0 ? `(${postsCount})` : ''}`}
        fixed={true}
      >
        {objectId && contentType ? (
          <Link
            to={CLIENT_URLS.USER.POST_CREATE.buildPath({
              queryParams: {
                objectId,
                contentType,
              },
            })}
          >
            <i className="fa fa-plus" />
          </Link>
        ) : (
          <div
            className={applyFilters ? 'text-notification' : ''}
            onClick={() => toggleShowFilters(true)}
          >
            <i className="fa fa-filter" />
          </div>
        )}
      </Header>
      <div className="site-post-search">
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
        </InputGroup>
      </div>
      <div className="site-post-list">
        {!loading && postsItems.length === 0 && (
          <Alert variant="warning">
            <div>{_('No articles.')}</div>
          </Alert>
        )}
        <PaginateList
          offset={offset}
          changeOffset={changeOffset}
          count={postsCount}
          objs={postsItems}
          loading={loading}
          queryParamsHash={JSON.stringify(queryParams)}
        >
          {(item: any) => (
            <div className="site-post-item block" key={item.slug}>
              <div className="site-post-header">
                <div className="site-post-avatar">
                  <Link
                    to={CLIENT_URLS.POSTS_DETAIL.buildPath({
                      postSlug: item.slug,
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
                <div className="site-post-title">
                  <div className="site-post-title-name">
                    <Link
                      to={CLIENT_URLS.POSTS_DETAIL.buildPath({
                        postSlug: item.slug,
                      })}
                    >
                      <>{item.title}</>
                    </Link>
                  </div>
                  <div className="site-post-title-geo" />
                </div>
                <div className="site-post-actions">
                  {isCreator(item) && (
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
                                  to={CLIENT_URLS.USER.POST_UPDATE.buildPath({
                                    postSlug: item.slug,
                                  })}
                                >
                                  <i className="fa fa-pencil" /> {_('Update')}
                                </Link>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <DeleteItem
                                  description={_(
                                    'Are you sure you want to delete the post?',
                                  )}
                                  onSuccess={() => refetch()}
                                  path={SERVER_URLS.POSTS_DELETE.buildPath({
                                    postSlug: item.slug,
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
              <div className="site-post-body">
                <div className="site-post-text">
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <ShowMore
                        lines={10}
                        more={_('Show more')}
                        less={_('Show less')}
                        anchorClass=""
                      >
                        {renderHtml(item.description)}
                      </ShowMore>
                    </ListGroup.Item>
                  </ListGroup>
                </div>
                <div className="site-post-footer">
                  <Likes
                    likePath={SERVER_URLS.POSTS_LIKE.buildPath({
                      postSlug: item.slug,
                    })}
                    item={item}
                  />
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
            name="theme"
            isClearable={true}
            options={[
              {
                value: POST_THEME_SWING,
                display: valueTitle(POST_THEME_SWING),
              },
              {
                value: POST_THEME_SWING_HISTORY,
                display: valueTitle(POST_THEME_SWING_HISTORY),
              },
              {
                value: POST_THEME_BDSM,
                display: valueTitle(POST_THEME_BDSM),
              },
              {
                value: POST_THEME_BDSM_HISTORY,
                display: valueTitle(POST_THEME_BDSM_HISTORY),
              },
              {
                value: POST_THEME_LGBT,
                display: valueTitle(POST_THEME_LGBT),
              },
              {
                value: POST_THEME_LGBT_HISTORY,
                display: valueTitle(POST_THEME_LGBT_HISTORY),
              },
              {
                value: POST_THEME_SEX,
                display: valueTitle(POST_THEME_SEX),
              },
              {
                value: POST_THEME_SEX_HISTORY,
                display: valueTitle(POST_THEME_SEX_HISTORY),
              },
            ]}
            value={filters.theme}
            onChange={(target: any) => {
              changeFilters({
                ...filters,
                theme: target.value,
              });
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              changeOffset(0);
              toggleShowFilters(false);
              changeApplyFilters(null);
            }}
            variant="secondary"
          >
            {_('Reset')}
          </Button>
          <Button
            onClick={() => {
              changeOffset(0);
              toggleShowFilters(false);
              changeApplyFilters(filters);
            }}
            variant="primary"
          >
            {_('Apply')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SitePostWhisperList;
