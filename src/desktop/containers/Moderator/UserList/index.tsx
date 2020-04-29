import React from 'react';
import compose from 'lodash/flowRight';
import { Card, Nav } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import { SERVER_URLS } from 'routes/server';
import { CLIENT_URLS } from 'desktop/routes/client';
import List from 'desktop/containers/Generics/List';
import { _ } from 'trans';
import { withCounters } from 'generic/containers/Decorators';
import UserItem from './UserItem';

interface IProps extends RouteComponentProps {
  match: any;
  counters: any;
}

class UserList extends React.PureComponent<IProps> {
  public renderTitle = (queryParams: any) => {
    if (queryParams.is_guest === 'true') {
      return _('Users (Guests)');
    }
    if (queryParams.is_real === 'false') {
      return _('Users (Without real)');
    }
    if (queryParams.is_real_waiting === 'true') {
      return _('Users (Waiting real)');
    }
    if (queryParams.is_black_list === 'true') {
      return _('Users (In black list)');
    }
    if (queryParams.is_ban === 'true') {
      return _('Users (Banned)');
    }
    return _('Users');
  };

  public renderItem = (item: any, queryParams: any, refetch: any) => {
    return <UserItem item={item} refetch={refetch} />;
  };

  public renderFilters = (queryParams: any, onChangequeryParams: any) => {
    const counters = this.props.counters.counters;
    return (
      <Card>
        <Card.Body>
          <Card.Title>
            <i className="fa fa-list" /> {_('Type')}
          </Card.Title>
          <Nav className="flex-column">
            <Nav.Link
              onClick={() =>
                onChangequeryParams({
                  is_real_waiting: undefined,
                  is_real: undefined,
                  is_guest: undefined,
                  is_ban: undefined,
                  is_black_list: undefined,
                })
              }
            >
              <i className="fa fa-list" /> {_('All')}
            </Nav.Link>
            <Nav.Link
              onClick={() =>
                onChangequeryParams({
                  is_real_waiting: undefined,
                  is_real: undefined,
                  is_guest: 'true',
                  is_ban: undefined,
                  is_black_list: undefined,
                })
              }
            >
              <i className="fa fa-user-secret" /> {_('Guests')} (
              {counters.m_users_guest})
            </Nav.Link>
            <Nav.Link
              onClick={() =>
                onChangequeryParams({
                  is_real_waiting: undefined,
                  is_real: 'false',
                  is_guest: undefined,
                  is_ban: undefined,
                  is_black_list: undefined,
                })
              }
            >
              <i className="fa fa-user-times" /> {_('Without real')} (
              {counters.m_users_real})
            </Nav.Link>
            <Nav.Link
              onClick={() =>
                onChangequeryParams({
                  is_real_waiting: 'true',
                  is_real: undefined,
                  is_guest: undefined,
                  is_ban: undefined,
                  is_black_list: undefined,
                })
              }
            >
              <i className="fa fa-clock-o" /> {_('Waiting real')}
            </Nav.Link>
            <Nav.Link
              onClick={() =>
                onChangequeryParams({
                  is_real_waiting: undefined,
                  is_real: undefined,
                  is_guest: undefined,
                  is_ban: undefined,
                  is_black_list: 'true',
                })
              }
            >
              <i className="fa fa-deaf" /> {_('In black list')}
            </Nav.Link>
            <Nav.Link
              onClick={() =>
                onChangequeryParams({
                  is_real_waiting: undefined,
                  is_real: undefined,
                  is_guest: undefined,
                  is_ban: 'true',
                  is_black_list: undefined,
                })
              }
            >
              <i className="fa fa-ban" /> {_('Banned')}
            </Nav.Link>
          </Nav>
        </Card.Body>
      </Card>
    );
  };

  public render() {
    return (
      <List
        listClientPath={CLIENT_URLS.MODERATOR.USER_LIST.buildPath()}
        listServerPath={SERVER_URLS.MODERATION_USERS}
        renderTitle={this.renderTitle}
        renderItem={this.renderItem}
        renderFilters={this.renderFilters}
      />
    );
  }
}

const withCountersData = withCounters({
  propName: 'counters',
});

export default compose(withCountersData)(UserList);
