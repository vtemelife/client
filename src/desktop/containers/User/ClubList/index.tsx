import React from 'react';
import compose from 'lodash/flowRight';
import { Card, Nav, Alert, ButtonGroup, Button } from 'react-bootstrap';
import { RouteComponentProps as IPropsWrapper } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

import { SERVER_URLS } from 'routes/server';
import { CLIENT_URLS } from 'desktop/routes/client';
import { getDisplayValue } from 'utils';
import { _ } from 'trans';

import List from 'desktop/containers/Generics/List';
import FormAsyncSelect from 'generic/components/Form/FormAsyncSelect';
import FormSelect from 'generic/components/Form/FormSelect';
import { withAuthUser } from 'generic/containers/Decorators';

import {
  REQUEST_WAITING,
  COMMUNITY_THEMES,
  COMMUNITY_TYPES,
} from 'generic/constants';
import ClubItem from './ClubItem';

interface IProps extends IPropsWrapper {
  authUser: any;
}

class ClubList extends React.PureComponent<IProps> {
  public renderTitle = (queryParams: any) => {
    if (queryParams.is_participant === 'true') {
      return _('My clubs');
    }
    return _('Search clubs');
  };

  public renderItem = (item: any, queryParams: any, refetch: any) => {
    return <ClubItem item={item} refetch={refetch} />;
  };

  public renderFilters = (queryParams: any, onChangequeryParams: any) => {
    const user = this.props.authUser.user;
    return (
      <>
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="fa fa-bars" /> {_('Menu')}
            </Card.Title>
            <Nav className="flex-column">
              <LinkContainer
                to={CLIENT_URLS.USER.CLUB_LIST.buildPath({
                  queryParams: { is_participant: true },
                })}
              >
                <Nav.Link>
                  <i className="fa fa-venus-mars" /> {_('Clubs')}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={CLIENT_URLS.USER.CLUB_LIST.buildPath({
                  queryParams: {
                    is_participant: false,
                    city__region: user.city.region.pk,
                  },
                })}
              >
                <Nav.Link>
                  <i className="fa fa-search" /> {_('Search')}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={CLIENT_URLS.USER.CLUB_REQUESTS.buildPath({
                  queryParams: { status: REQUEST_WAITING, user: user.pk },
                })}
              >
                <Nav.Link>
                  <i className="fa fa-list-ol" /> {_('Requests')}
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Card.Body>
        </Card>
        {queryParams.is_participant !== 'true' ? (
          <Card>
            <Card.Body>
              <Card.Title>
                <i className="fa fa-filter" /> {_('Filters')}
              </Card.Title>
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
              <hr />
              <FormSelect
                label={_('Theme')}
                name="relationship_theme"
                isClearable={true}
                options={COMMUNITY_THEMES}
                value={
                  queryParams.relationship_theme
                    ? {
                        value: queryParams.relationship_theme,
                        display: getDisplayValue(
                          queryParams.relationship_theme,
                          COMMUNITY_THEMES,
                        ),
                      }
                    : null
                }
                onChange={(target: any) =>
                  onChangequeryParams({
                    relationship_theme: target.value
                      ? target.value.value
                      : undefined,
                  })
                }
              />
              <FormSelect
                label={_('Type')}
                name="club_type"
                isClearable={true}
                options={COMMUNITY_TYPES}
                value={
                  queryParams.club_type
                    ? {
                        value: queryParams.club_type,
                        display: getDisplayValue(
                          queryParams.club_type,
                          COMMUNITY_TYPES,
                        ),
                      }
                    : null
                }
                onChange={(target: any) =>
                  onChangequeryParams({
                    club_type: target.value ? target.value.value : undefined,
                  })
                }
              />
            </Card.Body>
          </Card>
        ) : null}
      </>
    );
  };

  public renderNoItems = (queryParams: any) => {
    if (queryParams.is_participant === 'false') {
      return '-';
    }
    const user = this.props.authUser.user;
    return (
      <Alert variant="warning">
        <div>
          {_(
            'You are not a participant of any club. You can create your own club or join an existing one.',
          )}
        </div>
        <hr />
        <div className="d-flex">
          <ButtonGroup vertical={true}>
            <LinkContainer
              to={CLIENT_URLS.USER.CLUB_LIST.buildPath({
                queryParams: {
                  is_participant: false,
                  city__region: user.city.region.pk,
                },
              })}
            >
              <Button size="sm" variant="warning">
                <i className="fa fa-search" /> {_('Search clubs')}
              </Button>
            </LinkContainer>
            <LinkContainer to={CLIENT_URLS.USER.CLUB_CREATE.buildPath()}>
              <Button size="sm">
                <i className="fa fa-plus" /> {_('Create a club')}
              </Button>
            </LinkContainer>
          </ButtonGroup>
        </div>
      </Alert>
    );
  };

  public render() {
    return (
      <List
        listClientPath={CLIENT_URLS.USER.CLUB_LIST.buildPath()}
        createClientPath={CLIENT_URLS.USER.CLUB_CREATE.buildPath()}
        listServerPath={SERVER_URLS.CLUB_LIST}
        renderTitle={this.renderTitle}
        renderItem={this.renderItem}
        renderFilters={this.renderFilters}
        renderNoItems={this.renderNoItems}
      />
    );
  }
}

const withAuth = withAuthUser({
  propName: 'authUser',
});

export default compose(withAuth)(ClubList);
