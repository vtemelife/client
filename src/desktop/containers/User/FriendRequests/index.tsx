import React from 'react';
import compose from 'lodash/flowRight';
import { Card, Nav, Badge } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

import { CLIENT_URLS } from 'desktop/routes/client';

import { getDisplayValue } from 'utils';
import { REQUESTS } from 'generic/constants';
import FormSelect from 'generic/components/Form/FormSelect';
import BlockRequests from 'desktop/components/BlockRequests';
import { _ } from 'trans';
import { withAuthUser, withCounters } from 'generic/containers/Decorators';

interface IProps extends RouteComponentProps {
  match: any;
  counters: any;
  authUser: any;
}

class FriendRequests extends React.PureComponent<IProps> {
  public renderTitle = (queryParams: any) => {
    if (queryParams.object_id) {
      return _('Users requests');
    }
    return _('My requests');
  };

  public renderFilters = (queryParams: any, onChangequeryParams: any) => {
    const user = this.props.authUser.user;
    const counters = this.props.counters.counters;
    return (
      <>
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="fa fa-users" /> {_('Friends')}
            </Card.Title>
            <Nav className="flex-column">
              <LinkContainer to={CLIENT_URLS.USER.FRIEND_LIST.buildPath()}>
                <Nav.Link>{_('Friends')}</Nav.Link>
              </LinkContainer>
              <LinkContainer
                to={CLIENT_URLS.USER.FRIEND_LIST.buildPath({
                  queryParams: { is_online: 'true' },
                })}
              >
                <Nav.Link>{_('Online')}</Nav.Link>
              </LinkContainer>
            </Nav>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="fa fa-list" /> {_('Requests')}
            </Card.Title>
            <Nav className="flex-column">
              <Nav.Link
                onClick={() =>
                  onChangequeryParams({ user: user.pk, object_id: undefined })
                }
              >
                {this.renderTitle({ user: user.pk, object_id: undefined })}{' '}
                {counters.u_friends_requests_mine > 0 ? (
                  <Badge variant="primary">
                    {counters.u_friends_requests_mine}
                  </Badge>
                ) : null}
              </Nav.Link>
              <Nav.Link
                onClick={() =>
                  onChangequeryParams({ user: undefined, object_id: user.pk })
                }
              >
                {this.renderTitle({ user: undefined, object_id: user.pk })}{' '}
                {counters.u_friends_requests > 0 ? (
                  <Badge variant="primary">{counters.u_friends_requests}</Badge>
                ) : null}
              </Nav.Link>
            </Nav>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="fa fa-filter" /> {_('Filters')}
            </Card.Title>
            <FormSelect
              label={_('Request status')}
              name="status"
              isClearable={true}
              options={REQUESTS}
              value={
                queryParams.status
                  ? {
                      value: queryParams.status,
                      display: getDisplayValue(queryParams.status, REQUESTS),
                    }
                  : null
              }
              onChange={(target: any) =>
                onChangequeryParams({
                  status: target.value ? target.value.value : undefined,
                })
              }
            />
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Nav className="flex-column">
              <LinkContainer to={CLIENT_URLS.USER.BLACKLIST_LIST.buildPath()}>
                <Nav.Link>
                  <i className="fa fa-deaf" /> {_('Black list')}
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Card.Body>
        </Card>
      </>
    );
  };

  public render() {
    return (
      <BlockRequests
        contentType="users:user"
        renderTitle={this.renderTitle}
        renderFilters={this.renderFilters}
        size={10}
      />
    );
  }
}

const withAuth = withAuthUser({
  propName: 'authUser',
});

const withCountersData = withCounters({
  propName: 'counters',
});

export default compose(withAuth, withCountersData)(FriendRequests);
