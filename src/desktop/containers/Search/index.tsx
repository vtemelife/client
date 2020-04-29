import React from 'react';
import compose from 'lodash/flowRight';
import { Card } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';
import { Helmet } from 'react-helmet-async';

import { SERVER_URLS } from 'routes/server';
import { CLIENT_URLS } from 'desktop/routes/client';
import List from 'desktop/containers/Generics/List';
import FormAsyncSelect from 'generic/components/Form/FormAsyncSelect';
import FormCheckBoxes from 'generic/components/Form/FormCheckBoxes';
import { USER_GENDER, USER_THEMES } from 'generic/constants';
import { getUserFormats } from '../User/Profile/utils';
import { _ } from 'trans';

import SearchItem from './SearchItem';
import { withAuthUser } from 'generic/containers/Decorators';

interface IProps extends RouteComponentProps {
  match: any;
  authUser: any;
}

class Search extends React.PureComponent<IProps> {
  public renderTitle = (queryParams: any) => {
    return _('Search friends');
  };

  public renderItem = (item: any, queryParams: any, refetch: any) => {
    return <SearchItem item={item} refetch={refetch} />;
  };

  public renderFilters = (queryParams: any, onChangequeryParams: any) => {
    const userFormats = getUserFormats(
      queryParams.gender,
      queryParams.relationship_themes,
    );
    const user = this.props.authUser.user;
    return (
      <Card>
        <Helmet>
          <title>{_('Search')}</title>
          <meta name="description" content={_('Search')} />
        </Helmet>
        <Card.Body className="search-filter">
          <Card.Title>
            <i className="fa fa-filter" /> {_('Filters')}
          </Card.Title>
          <br />
          <FormAsyncSelect
            label={_('Country')}
            placeholder={_('Start typing...')}
            name="city__country"
            defaultValue={
              user.city && user.city.country
                ? {
                    pk: user.city.country.pk,
                    name: user.city.country.name,
                  }
                : null
            }
            onChange={(target: any) =>
              onChangequeryParams({
                city__country: target.value ? target.value.pk : undefined,
              })
            }
            fetchURL={SERVER_URLS.SELECTS.COUNTRY.buildPath()}
          />
          <FormAsyncSelect
            label={_('Region/State')}
            placeholder={_('Start typing...')}
            name="city__region"
            defaultValue={
              user.city && user.city.region
                ? {
                    pk: user.city.region.pk,
                    name: user.city.region.name,
                  }
                : null
            }
            onChange={(target: any) =>
              onChangequeryParams({
                city__region: target.value ? target.value.pk : undefined,
              })
            }
            fetchURL={SERVER_URLS.SELECTS.REGION.buildPath()}
            filterURL={`country=${
              queryParams.city__country
                ? queryParams.city__country
                : user.city.country.pk
            }`}
          />
          <FormAsyncSelect
            label={_('City')}
            placeholder={_('Start typing...')}
            name="city"
            onChange={(target: any) =>
              onChangequeryParams({
                city: target.value ? target.value.pk : undefined,
              })
            }
            fetchURL={SERVER_URLS.SELECTS.CITY.buildPath()}
            filterURL={`region=${
              queryParams.city__region
                ? queryParams.city__region
                : user.city.region.pk
            }`}
          />
          <FormCheckBoxes
            type="checkbox"
            name="is_online"
            label={_('Online')}
            checkboxes={[{ value: 'true', display: _('Online') }]}
            value={
              queryParams.is_online ? queryParams.is_online.split(',') : []
            }
            onChange={(target: any) => {
              onChangequeryParams({
                is_online: this.selectValues(
                  target,
                  queryParams.is_online || '',
                ),
              });
            }}
          />
          <FormCheckBoxes
            type="checkbox"
            name="is_real"
            label={_('Real status')}
            checkboxes={[{ value: 'true', display: _('Real status') }]}
            value={queryParams.is_real ? queryParams.is_real.split(',') : []}
            onChange={(target: any) => {
              onChangequeryParams({
                is_real: this.selectValues(target, queryParams.is_real || ''),
              });
            }}
          />
          <FormCheckBoxes
            type="checkbox"
            name="relationship_themes"
            label={_('Theme')}
            checkboxes={USER_THEMES}
            value={
              queryParams.relationship_themes
                ? queryParams.relationship_themes.split(',')
                : []
            }
            onChange={(target: any) => {
              onChangequeryParams({
                relationship_themes: this.selectValues(
                  target,
                  queryParams.relationship_themes || '',
                ),
              });
            }}
          />
          <FormCheckBoxes
            type="checkbox"
            name="relationship_formats"
            label={_('Format')}
            checkboxes={userFormats}
            value={
              queryParams.relationship_formats
                ? queryParams.relationship_formats.split(',')
                : []
            }
            onChange={(target: any) => {
              onChangequeryParams({
                relationship_formats: this.selectValues(
                  target,
                  queryParams.relationship_formats || '',
                ),
              });
            }}
          />
          <FormCheckBoxes
            type="checkbox"
            name="gender"
            label={_('Gender')}
            checkboxes={USER_GENDER}
            value={queryParams.gender ? queryParams.gender.split(',') : []}
            onChange={(target: any) => {
              onChangequeryParams({
                gender: this.selectValues(target, queryParams.gender || ''),
              });
            }}
          />
        </Card.Body>
      </Card>
    );
  };

  public render() {
    return (
      <List
        listClientPath={CLIENT_URLS.SEARCH.buildPath()}
        listServerPath={SERVER_URLS.FRIENDS_SEARCH}
        renderTitle={this.renderTitle}
        renderItem={this.renderItem}
        renderFilters={this.renderFilters}
      />
    );
  }

  private selectValues = (target: any, stringValues: any) => {
    const values = stringValues.length === 0 ? [] : stringValues.split(',');
    const el = target.target;
    if (el.checked) {
      return [...values, el.id].join(',');
    }
    return values.filter((item: string) => item !== el.id).join(',');
  };
}

const withAuth = withAuthUser({
  propName: 'authUser',
});

export default compose(withAuth)(Search);
