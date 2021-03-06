import React from 'react';
import { Card, Nav } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import { SERVER_URLS } from 'routes/server';
import { CLIENT_URLS } from 'desktop/routes/client';

import List from 'desktop/containers/Generics/List';
import { CountersConsumer } from 'generic/containers/ContextProviders/CountersService';
import FormSelect from 'generic/components/Form/FormSelect';
import { REQUESTS, REQUEST_NONE } from 'generic/constants';
import { getDisplayValue } from 'utils';

import PostItem from './PostItem';
import { _ } from 'trans';

interface IPropsWrapper extends RouteComponentProps {
  match: any;
}

interface IProps extends IPropsWrapper {
  counters: any;
}

class PostList extends React.PureComponent<IProps> {
  public renderTitle = (queryParams: any) => {
    if (queryParams.is_ban) {
      return _('Articles (banned)');
    }
    if (queryParams.status) {
      return `${_('Posts')} (${getDisplayValue(queryParams.status, REQUESTS)})`;
    }
    return _('Posts');
  };

  public renderItem = (item: any, queryParams: any, refetch: any) => {
    return <PostItem item={item} refetch={refetch} />;
  };

  public renderFilters = (queryParams: any, onChangequeryParams: any) => {
    return (
      <>
        <Card>
          <Card.Body>
            <Card.Title>
              <i className="fa fa-list" /> {_('Type')}
            </Card.Title>
            <Nav className="flex-column">
              <Nav.Link
                onClick={() =>
                  onChangequeryParams({
                    is_ban: undefined,
                    is_whisper: undefined,
                    status: undefined,
                  })
                }
              >
                <i className="fa fa-list" /> {_('All')}
              </Nav.Link>
              <Nav.Link
                onClick={() => onChangequeryParams({ is_whisper: false })}
              >
                <i className="fa fa-book" /> {_('Posts')}
              </Nav.Link>
              <Nav.Link
                onClick={() => onChangequeryParams({ is_whisper: true })}
              >
                <i className="fa fa-eye-slash" /> {_('Whisper')}
              </Nav.Link>
              <Nav.Link onClick={() => onChangequeryParams({ is_ban: 'true' })}>
                <i className="fa fa-ban" /> {_('Banned')}
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
              label={_('Status')}
              name="status"
              isClearable={true}
              options={REQUESTS}
              value={
                queryParams.status
                  ? {
                      value: queryParams.status,
                      display: getDisplayValue(queryParams.status, REQUESTS),
                    }
                  : {
                      value: REQUEST_NONE,
                      display: getDisplayValue(REQUEST_NONE, REQUESTS),
                    }
              }
              onChange={(target: any) =>
                onChangequeryParams({
                  status: target.value ? target.value.value : undefined,
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
      <List
        listClientPath={CLIENT_URLS.MODERATOR.POST_LIST.buildPath()}
        listServerPath={SERVER_URLS.MODERATION_POSTS}
        renderTitle={this.renderTitle}
        renderItem={this.renderItem}
        renderFilters={this.renderFilters}
      />
    );
  }
}

const PostListWrapper: React.FC<IPropsWrapper> = (props) => (
  <CountersConsumer>
    {(context) =>
      context && <PostList {...props} counters={context.counters} />
    }
  </CountersConsumer>
);

export default PostListWrapper;
