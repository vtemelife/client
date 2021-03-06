import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import List from 'desktop/containers/Generics/List';
import { SERVER_URLS } from 'routes/server';
import { CLIENT_URLS } from 'desktop/routes/client';

import PostPreview from './PostPreview';
import { _ } from 'trans';

interface IProps extends RouteComponentProps {
  objectId?: string;
  contentType?: string;
  isReadonly?: boolean;
  renderTitle?: any;
  renderFilters?: any;
  defaultqueryParams?: any;
  size?: number;
}

class BlockPosts extends React.PureComponent<IProps> {
  public renderTitle = (queryParams: any) => {
    return this.props.renderTitle
      ? this.props.renderTitle(queryParams)
      : _('Posts');
  };

  public renderItem = (item: any, queryParams: any, refetch: any) => {
    return <PostPreview item={item} />;
  };

  public render() {
    return (
      <List
        listClientPath={this.props.location.pathname}
        createClientPath={
          !this.props.isReadonly
            ? CLIENT_URLS.USER.POST_CREATE.buildPath({
                queryParams: {
                  object_id: this.props.objectId,
                  content_type: this.props.contentType,
                },
              })
            : undefined
        }
        listServerPath={SERVER_URLS.POSTS}
        contentType={this.props.contentType}
        objectId={this.props.objectId}
        renderTitle={this.renderTitle}
        renderItem={this.renderItem}
        renderFilters={this.props.renderFilters}
        searchLabel="search_posts"
        size={this.props.size}
        defaultqueryParams={this.props.defaultqueryParams}
      />
    );
  }
}

export default withRouter(BlockPosts);
