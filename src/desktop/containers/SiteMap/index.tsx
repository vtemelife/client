import React from 'react';
import { Helmet } from 'react-helmet-async';
import compose from 'lodash/flowRight';
import { Card } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import { SERVER_URLS } from 'routes/server';
import { CLIENT_URLS } from 'desktop/routes/client';
import List from 'desktop/containers/Generics/List';
import { _ } from 'trans';
import { withAuthUser } from 'generic/containers/Decorators';
import FormSelect from 'generic/components/Form/FormSelect';
import { MAP_TYPES } from 'generic/constants';
import { getDisplayValue } from 'utils';

import Items from './Items';

interface IProps extends RouteComponentProps {
  match: any;
  authUser: any;
}

class SiteMap extends React.PureComponent<IProps> {
  public renderTitle = (queryParams: any) => {
    return _('Map (parties and clubs)');
  };

  public renderItem = (item: any, queryParams: any, refetch: any) => {
    return <>{item}</>;
  };

  public renderFilters = (queryParams: any, onChangequeryParams: any) => {
    return (
      <Card>
        <Helmet>
          <title>{_('Map')}</title>
          <meta name="description" content={_('Map')} />
        </Helmet>
        <Card.Body>
          <Card.Title>
            <i className="fa fa-filter" /> {_('Filters')}
          </Card.Title>
          <FormSelect
            label={_('Type')}
            name="type"
            isClearable={true}
            options={MAP_TYPES}
            value={
              queryParams.type
                ? {
                    value: queryParams.type,
                    display: getDisplayValue(queryParams.type, MAP_TYPES),
                  }
                : null
            }
            onChange={(target: any) =>
              onChangequeryParams({
                type: target.value ? target.value.value : undefined,
              })
            }
          />
        </Card.Body>
      </Card>
    );
  };

  public render() {
    return (
      <List
        disableSearching={true}
        listClientPath={CLIENT_URLS.MAP.buildPath()}
        listServerPath={SERVER_URLS.MAP}
        renderTitle={this.renderTitle}
        renderItem={this.renderItem}
        renderFilters={this.renderFilters}
        itemsContainer={Items}
      />
    );
  }
}

const withAuth = withAuthUser({
  propName: 'authUser',
});

export default compose(withAuth)(SiteMap);
