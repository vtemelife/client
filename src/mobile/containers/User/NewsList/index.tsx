import React, { useState, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Modal, Button, Alert } from 'react-bootstrap';
import Moment from 'react-moment';

import { AuthUserContext } from 'generic/containers/ContextProviders/HeaderUserService';
import Header from 'mobile/containers/Header';
import Image from 'generic/components/Image';
import userSVG from 'generic/layout/images/user.svg';

import Likes from 'desktop/components/Likes';
import PaginateList from 'generic/components/PaginateList';
import { _ } from 'trans';
import { CLIENT_URLS } from 'mobile/routes/client';
import { useGet } from 'restful-react';
import { SERVER_URLS } from 'routes/server';
import { getLocale, renderHtml } from 'utils';
import {
  TYPE_FRIENDS_INFO,
  TYPE_ARTICLES,
  TYPE_WHISPER,
  TYPE_FRIENDS_ARTICLE,
  TYPE_CLUBS_ARTICLE,
  TYPE_GROUPS_ARTICLE,
  TYPE_MEDIA,
  TYPE_FRIENDS_MEDIA,
  TYPE_CLUBS_MEDIA,
  TYPE_GROUPS_MEDIA,
  TYPE_CLUBS_EVENTS,
  TYPE_SITE_NEWS,
} from 'generic/constants';
import ShowMore from 'react-show-more';
import FormSelect from 'generic/components/Form/FormSelect';

const NewsList: React.SFC<any> = () => {
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
    news_type:
      applyFilters && applyFilters.news_type
        ? applyFilters.news_type.value
        : undefined,
  };
  const { data: newsData, loading } = useGet({
    path: SERVER_URLS.NEWS_LIST.buildPath({
      queryParams: { ...queryParams, offset },
    }),
  });
  const newsItems = (newsData || {}).results || [];
  const newsCount = (newsData || {}).count || 0;

  const valueTitle = (newsType?: string) => {
    switch (newsType) {
      case TYPE_SITE_NEWS:
        return _('Hot news');
      case TYPE_MEDIA:
        return _('VTeme: New media');
      case TYPE_ARTICLES:
        return _('VTeme: New articles');
      case TYPE_WHISPER:
        return _('VTeme: New whisper articles');
      case TYPE_FRIENDS_MEDIA:
        return _('Friends: New media');
      case TYPE_FRIENDS_ARTICLE:
        return _('Friends: New articles');
      case TYPE_FRIENDS_INFO:
        return _('Friends: Change profile');
      case TYPE_GROUPS_MEDIA:
        return _('Groups: New media');
      case TYPE_GROUPS_ARTICLE:
        return _('Groups: New articles');
      case TYPE_CLUBS_MEDIA:
        return _('Clubs: New media');
      case TYPE_CLUBS_ARTICLE:
        return _('Clubs: New articles');
      case TYPE_CLUBS_EVENTS:
        return _('Clubs: New parties');
      default:
        return _('All News');
    }
  };

  const getLink = (item: any) => {
    switch (item.news_type.value) {
      case TYPE_FRIENDS_INFO:
        return CLIENT_URLS.USER.PROFILE.buildPath({
          userSlug: item.slug,
        });
      case TYPE_ARTICLES:
      case TYPE_WHISPER:
      case TYPE_FRIENDS_ARTICLE:
      case TYPE_CLUBS_ARTICLE:
      case TYPE_GROUPS_ARTICLE:
        return CLIENT_URLS.POSTS_DETAIL.buildPath({
          postSlug: item.slug,
        });
      case TYPE_MEDIA:
      case TYPE_FRIENDS_MEDIA:
      case TYPE_CLUBS_MEDIA:
      case TYPE_GROUPS_MEDIA:
        return CLIENT_URLS.USER.MEDIA_FOLDER_DETAIL_MEDIA_DETAIL.buildPath({
          mediaPk: item.object_id,
        });
      case TYPE_CLUBS_EVENTS:
        return CLIENT_URLS.USER.PARTY_DETAIL.buildPath({
          partySlug: item.slug,
        });
      case TYPE_SITE_NEWS:
      default:
        return CLIENT_URLS.USER.NEWS_DETAIL.buildPath({
          newsPk: item.pk,
        });
    }
  };

  const getLikesLink = (item: any) => {
    switch (item.news_type.value) {
      case TYPE_ARTICLES:
      case TYPE_WHISPER:
      case TYPE_FRIENDS_ARTICLE:
      case TYPE_CLUBS_ARTICLE:
      case TYPE_GROUPS_ARTICLE:
        return SERVER_URLS.POSTS_LIKE.buildPath({
          postSlug: item.slug,
        });
      case TYPE_MEDIA:
      case TYPE_FRIENDS_MEDIA:
      case TYPE_CLUBS_MEDIA:
      case TYPE_GROUPS_MEDIA:
        return SERVER_URLS.MEDIA_LIKE.buildPath({
          mediaPk: item.object_id,
        });
      case TYPE_CLUBS_EVENTS:
        return SERVER_URLS.PARTY_LIKE.buildPath({
          partySlug: item.slug,
        });
      case TYPE_SITE_NEWS:
        return SERVER_URLS.NEWS_LIKE.buildPath({
          newsPk: item.pk,
        });
      case TYPE_FRIENDS_INFO:
      default:
        return null;
    }
  };

  const title = valueTitle(
    applyFilters && applyFilters.news_type
      ? applyFilters.news_type.value
      : undefined,
  );

  return (
    <div className="container-news-list">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>
      <Header name={title}>
        <div
          className={applyFilters ? 'text-notification' : ''}
          onClick={() => toggleShowFilters(true)}
        >
          <i className="fa fa-filter" />
        </div>
      </Header>
      <div className="block">
        <div className="profile d-flex">
          <Image
            width={50}
            height={50}
            src={
              user.avatar && user.avatar.thumbnail_100x100
                ? user.avatar.thumbnail_100x100
                : userSVG
            }
            roundedCircle={true}
          />
          <Link
            to={CLIENT_URLS.USER.PROFILE.buildPath({
              userSlug: user.slug,
            })}
          >
            {user.name}
            <br />
            <span>{_('Go to profile')}</span>
          </Link>
        </div>
      </div>
      <div className="news-list">
        {!loading && newsItems.length === 0 && (
          <Alert variant="warning">
            <div>{_('No news.')}</div>
          </Alert>
        )}
        <PaginateList
          offset={offset}
          changeOffset={changeOffset}
          count={newsCount}
          objs={newsItems}
          loading={loading}
          queryParamsHash={JSON.stringify(queryParams)}
        >
          {(item: any) => (
            <div className="news-item block" key={item.pk}>
              <div className="news-header">
                <div className="news-avatar">
                  <Link
                    to={CLIENT_URLS.USER.PROFILE.buildPath({
                      userSlug: item.creator.slug,
                    })}
                  >
                    <Image
                      width={40}
                      height={40}
                      src={
                        item.creator.avatar &&
                        item.creator.avatar.thumbnail_100x100
                          ? item.creator.avatar.thumbnail_100x100
                          : userSVG
                      }
                      roundedCircle={true}
                    />
                  </Link>
                </div>
                <div className="news-title">
                  <div className="news-title-name">
                    <Link
                      to={CLIENT_URLS.USER.PROFILE.buildPath({
                        userSlug: item.creator.slug,
                      })}
                    >
                      {item.creator.name}
                    </Link>
                  </div>
                  <div className="news-title-time">
                    <Moment locale={getLocale()} fromNow={true}>
                      {item.publish_date}
                    </Moment>
                  </div>
                </div>
              </div>
              <div className="news-body">
                <div className="news-body-type">
                  <i className="fa fa-sitemap" />: {item.news_type.display}
                </div>
                <Link to={getLink(item)}>
                  <h2>{item.title}</h2>
                  {item.description && (
                    <div className="news-text">
                      <ShowMore
                        lines={10}
                        more={_('Show more')}
                        less={_('Show less')}
                        anchorClass=""
                      >
                        {renderHtml(item.description)}
                      </ShowMore>
                    </div>
                  )}
                  {item.image && item.image.thumbnail_500x500 && (
                    <div className="news-image">
                      <Image src={item.image.thumbnail_500x500} />
                    </div>
                  )}
                </Link>
                <div className="news-footer">
                  {getLikesLink(item) && (
                    <Likes likePath={getLikesLink(item) as any} item={item} />
                  )}
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
            label={_('Type')}
            name="news_type"
            isClearable={true}
            options={[
              {
                value: TYPE_SITE_NEWS,
                display: valueTitle(TYPE_SITE_NEWS),
              },
              { value: TYPE_MEDIA, display: valueTitle(TYPE_MEDIA) },
              {
                value: TYPE_ARTICLES,
                display: valueTitle(TYPE_ARTICLES),
              },
              {
                value: TYPE_WHISPER,
                display: valueTitle(TYPE_WHISPER),
              },
              {
                value: TYPE_FRIENDS_MEDIA,
                display: valueTitle(TYPE_FRIENDS_MEDIA),
              },
              {
                value: TYPE_FRIENDS_ARTICLE,
                display: valueTitle(TYPE_FRIENDS_ARTICLE),
              },
              {
                value: TYPE_FRIENDS_INFO,
                display: valueTitle(TYPE_FRIENDS_INFO),
              },
              {
                value: TYPE_GROUPS_MEDIA,
                display: valueTitle(TYPE_GROUPS_MEDIA),
              },
              {
                value: TYPE_GROUPS_ARTICLE,
                display: valueTitle(TYPE_GROUPS_ARTICLE),
              },
              {
                value: TYPE_CLUBS_MEDIA,
                display: valueTitle(TYPE_CLUBS_MEDIA),
              },
              {
                value: TYPE_CLUBS_ARTICLE,
                display: valueTitle(TYPE_CLUBS_ARTICLE),
              },
              {
                value: TYPE_CLUBS_EVENTS,
                display: valueTitle(TYPE_CLUBS_EVENTS),
              },
            ]}
            value={filters.news_type}
            onChange={(target: any) =>
              changeFilters({
                ...filters,
                news_type: target.value,
              })
            }
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

export default NewsList;
