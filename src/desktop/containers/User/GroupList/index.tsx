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
import FormSelect from 'generic/components/Form/FormSelect';

import {
  REQUEST_WAITING,
  COMMUNITY_THEMES,
  COMMUNITY_TYPES,
} from 'generic/constants';
import GroupItem from './GroupItem';
import { withAuthUser } from 'generic/containers/Decorators';

interface IProps extends IPropsWrapper {
  authUser: any;
}

class GroupList extends React.PureComponent<IProps> {
  public renderTitle = (queryParams: any) => {
    if (queryParams.is_participant === 'true') {
      return _('My groups');
    }
    return _('Search a group');
  };

  public renderItem = (item: any, queryParams: any, refetch: any) => {
    return <GroupItem item={item} refetch={refetch} />;
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
                to={CLIENT_URLS.USER.GROUP_LIST.buildPath({
                  queryParams: { is_participant: true },
                })}
              >
                <Nav.Link>
                  <i className="fa fa-users" /> {_('Groups')}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={CLIENT_URLS.USER.GROUP_LIST.buildPath({
                  queryParams: { is_participant: false },
                })}
              >
                <Nav.Link>
                  <i className="fa fa-search" /> {_('Search')}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={CLIENT_URLS.USER.GROUP_REQUESTS.buildPath({
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
        {queryParams.is_participant === 'false' ? (
          <Card>
            <Card.Body>
              <Card.Title>
                <i className="fa fa-filter" /> {_('Filters')}
              </Card.Title>
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
                name="group_type"
                isClearable={true}
                options={COMMUNITY_TYPES}
                value={
                  queryParams.group_type
                    ? {
                        value: queryParams.group_type,
                        display: getDisplayValue(
                          queryParams.group_type,
                          COMMUNITY_TYPES,
                        ),
                      }
                    : null
                }
                onChange={(target: any) =>
                  onChangequeryParams({
                    group_type: target.value ? target.value.value : undefined,
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
    return (
      <Alert variant="warning">
        <div>
          {_(
            'You are not a participant of any group. You can create your own group or join an existing one',
          )}
        </div>
        <hr />
        <div className="d-flex">
          <ButtonGroup vertical={true}>
            <LinkContainer
              to={CLIENT_URLS.USER.GROUP_LIST.buildPath({
                queryParams: { is_participant: false },
              })}
            >
              <Button size="sm" variant="warning">
                <i className="fa fa-search" /> {_('Search a group')}
              </Button>
            </LinkContainer>
            <LinkContainer to={CLIENT_URLS.USER.GROUP_CREATE.buildPath()}>
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
        listClientPath={CLIENT_URLS.USER.GROUP_LIST.buildPath()}
        createClientPath={CLIENT_URLS.USER.GROUP_CREATE.buildPath()}
        listServerPath={SERVER_URLS.GROUP_LIST}
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

export default compose(withAuth)(GroupList);
