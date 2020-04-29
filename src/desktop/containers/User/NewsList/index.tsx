import React from 'react';
import compose from 'lodash/flowRight';
import { Card, Nav, Badge } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import { _ } from 'trans';
import BlockNews from 'desktop/components/BlockNews';
import {
  TYPE_SITE_NEWS,
  TYPE_MEDIA,
  TYPE_ARTICLES,
  TYPE_WHISPER,
  TYPE_FRIENDS_MEDIA,
  TYPE_FRIENDS_ARTICLE,
  TYPE_FRIENDS_INFO,
  TYPE_GROUPS_MEDIA,
  TYPE_GROUPS_ARTICLE,
  TYPE_CLUBS_MEDIA,
  TYPE_CLUBS_ARTICLE,
  TYPE_CLUBS_EVENTS,
} from 'generic/constants';
import FormSelect from 'generic/components/Form/FormSelect';
import { withCounters } from 'generic/containers/Decorators';

interface IProps extends RouteComponentProps {
  match: any;
  counters: any;
}

class NewsList extends React.PureComponent<IProps> {
  public valueTitle = (newsType: string) => {
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
  public renderTitle = (queryParams: any) => {
    return this.valueTitle(queryParams.news_type);
  };

  public renderFilters = (queryParams: any, onChangequeryParams: any) => {
    const counters = this.props.counters.counters;
    return (
      <>
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
                    news_type: undefined,
                  })
                }
              >
                <i className="fa fa-eye-slash" /> {_('Not read')}{' '}
                {counters.u_unread_news > 0 ? (
                  <Badge variant="primary">{counters.u_unread_news}</Badge>
                ) : null}
              </Nav.Link>
            </Nav>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="fa fa-sitemap" /> {_('Category')}
            </Card.Title>
            <FormSelect
              label={_('News type')}
              name="news_type"
              isClearable={true}
              options={[
                {
                  value: TYPE_SITE_NEWS,
                  display: this.valueTitle(TYPE_SITE_NEWS),
                },
                { value: TYPE_MEDIA, display: this.valueTitle(TYPE_MEDIA) },
                {
                  value: TYPE_ARTICLES,
                  display: this.valueTitle(TYPE_ARTICLES),
                },
                {
                  value: TYPE_WHISPER,
                  display: this.valueTitle(TYPE_WHISPER),
                },
                {
                  value: TYPE_FRIENDS_MEDIA,
                  display: this.valueTitle(TYPE_FRIENDS_MEDIA),
                },
                {
                  value: TYPE_FRIENDS_ARTICLE,
                  display: this.valueTitle(TYPE_FRIENDS_ARTICLE),
                },
                {
                  value: TYPE_FRIENDS_INFO,
                  display: this.valueTitle(TYPE_FRIENDS_INFO),
                },
                {
                  value: TYPE_GROUPS_MEDIA,
                  display: this.valueTitle(TYPE_GROUPS_MEDIA),
                },
                {
                  value: TYPE_GROUPS_ARTICLE,
                  display: this.valueTitle(TYPE_GROUPS_ARTICLE),
                },
                {
                  value: TYPE_CLUBS_MEDIA,
                  display: this.valueTitle(TYPE_CLUBS_MEDIA),
                },
                {
                  value: TYPE_CLUBS_ARTICLE,
                  display: this.valueTitle(TYPE_CLUBS_ARTICLE),
                },
                {
                  value: TYPE_CLUBS_EVENTS,
                  display: this.valueTitle(TYPE_CLUBS_EVENTS),
                },
              ]}
              value={
                queryParams.news_type
                  ? {
                      value: queryParams.news_type,
                      display: this.valueTitle(queryParams.news_type),
                    }
                  : null
              }
              onChange={(target: any) =>
                onChangequeryParams({
                  is_unread: undefined,
                  news_type: target.value ? target.value.value : undefined,
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
      <BlockNews
        renderFilters={this.renderFilters}
        renderTitle={this.renderTitle}
      />
    );
  }
}

const withCountersData = withCounters({
  propName: 'counters',
});

export default compose(withCountersData)(NewsList);
